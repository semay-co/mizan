import {
  IonButton,
  IonCard,
  IonCardTitle,
  IonCardContent,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonSelect,
  IonSelectOption,
  IonItemDivider,
  IonItemGroup,
  IonChip,
  IonTitle,
} from '@ionic/react'
import { connect } from 'react-redux'
import './Form.scss'
import { updateReading } from '../../state/actions/scoreboard.action'
import {
  updateRecordDraft,
  deleteRecordDraft,
} from '../../state/actions/record.action'
import {
  checkmark,
  closeCircleOutline,
  receiptOutline,
  speedometerOutline,
} from 'ionicons/icons'
import {
  PLATE_CODES,
  PLATE_REGIONS,
  VEHICLE_SIZES,
} from '../../model/vehicle.model'
import { useMutation, useQuery } from '@apollo/client'
import {
  FETCH_VEHICLE,
  FETCH_VEHICLES,
} from '../../gql/queries/vehicle.queries'
import { FETCH_RECORDS } from '../../gql/queries/record.queries'
import LicensePlate from '../LicensePlate/LicensePlate'
import $ from 'jquery'
import React from 'react'
import * as _ from 'ramda'
import RecordItem from '../Record/RecordItem'
import { CREATE_RECORD } from '../../gql/mutations/record.mutations'
import { CREATE_VEHICLE } from '../../gql/mutations/vehicle.mutations'

const Form = (props: any) => {
  const [runCreateRecord] = useMutation(CREATE_RECORD)
  const [runCreateVehicle] = useMutation(CREATE_VEHICLE)
  const vehicles = useQuery(FETCH_VEHICLES, {
    variables: {
      query: props.draft?.licensePlate?.plate,
      limit: 5,
    },
  })

  const selectedVehicleRecords = useQuery(FETCH_RECORDS, {
    variables: {
      vehicleId: props.draft?.vehicleId,
    },
  })

  const selectedVehicle = useQuery(FETCH_VEHICLE, {
    variables: {
      id: props.draft?.vehicleId,
    },
  })

  const onPlateNumberChange = (ev: any) => {
    const plate = ev.detail?.value
      .split(/[^a-zA-Z0-9]/)
      .join('')
      .trim()
      .toUpperCase()

    ev.target.value = plate

    console.log(props.draft)

    props.updateRecordDraft({
      ...props.draft,
      licensePlate: {
        ...props.draft?.licensePlate,
        plate,
      },
    })
  }

  const onPlateCodeChange = (ev: any) => {
    const code = ev.detail?.value
    props.updateRecordDraft({
      ...props.draft,
      licensePlate: {
        ...props.draft?.licensePlate,
        code,
      },
    })
  }

  const onPlateRegionChange = (ev: any) => {
    const region = ev.detail?.value
    props.updateRecordDraft({
      ...props.draft,
      licensePlate: {
        ...props.draft?.licensePlate,
        region,
      },
    })
  }

  const selectVehicleType = (size: number) => {
    props.updateRecordDraft({
      ...props.draft,
      vehicle: {
        size,
      },
    })
  }

  const clearSelectedVehicle = () => {
    props.updateRecordDraft({
      ...props.draft,
      vehicleId: undefined,
      vehicle: undefined,
    })
  }

  const capture = () => {
    if (props.reading) {
      props.updateRecordDraft({
        ...props.draft,
        reading: props.reading,
        licensePlate: {
          plate: props.draft?.licensePlate?.plate || '',
          code: props.draft?.licensePlate?.code || 3,
          region: props.draft?.licensePlate?.region || 'AA',
        },
      })

      setTimeout(() => {
        const input = $('#license-plate-input').find('input').first()
        input.focus()
        input.val = props.draft?.licensePlate?.plate
      }, 200)
    }
  }

  const createRecord = () => {
    const draft = props.draft

    if (draft && draft.reading?.weight && draft.licensePlate?.plate) {
      console.log(draft)

      runCreateRecord({
        variables: {
          weight: draft.reading.weight,
          vehicleId: draft.vehicleId,
        },
      })
    } else {
      alert('Record information incomplete')
    }
  }

  const createVehicle = () => {
    const draft = props.draft

    if (
      draft &&
      !isNaN(draft.vehicle?.size) &&
      draft.licensePlate?.plate &&
      draft.licensePlate?.code &&
      draft.licensePlate?.region
    ) {
      runCreateVehicle({
        variables: {
          size: draft.vehicle.size,
          plateNumber: draft.licensePlate.plate,
          plateCode: draft.licensePlate.code,
          plateRegion: draft.licensePlate.region,
        },
      })
        .then((plate) => {
          const vehicleId = plate.data.createVehicle
          props.updateRecordDraft({
            ...props.draft,
            vehicleId,
            vehicle: {
              size: draft.vehicle.size,
            },
          })
        })
        .catch(console.error)
    } else {
      alert('Vehicle information incomplete')
    }
  }

  const onSelectPlate = (vehicleId: string) => {
    props.updateRecordDraft({
      ...props.draft,
      vehicleId,
    })
  }

  const deleteDraft = () => {
    props.deleteRecordDraft()
  }

  const getVehicleSize = (size: number) => {
    return VEHICLE_SIZES[size] || 'UNKNOWN'
  }

  return (
    <IonCard>
      {props.draft ? (
        <>
          <IonItem>
            <div className="card-action-buttons">
              <IonButton
                onClick={deleteDraft}
                shape="round"
                fill="clear"
                color="danger"
                size="small"
              >
                <IonIcon slot="start" icon={closeCircleOutline}></IonIcon>
                Delete
              </IonButton>
            </div>
          </IonItem>

          <IonCard className="current-weight-card">
            <IonCard>
              <IonCardTitle>Recorded Weight</IonCardTitle>
              <IonCardContent>
                <h1>{props.draft?.reading?.weight} KG</h1>
                <IonButton onClick={capture} fill="solid">
                  <IonIcon slot="start" icon={speedometerOutline}></IonIcon>
                  Update
                </IonButton>
              </IonCardContent>
            </IonCard>
            {!props.draft.vehicleId && (
              <IonList lines="none">
                <IonCard className="license-plate-form">
                  <IonItem>
                    <IonInput
                      id="license-plate-input"
                      onIonChange={onPlateNumberChange}
                      maxlength={6}
                      size={6}
                      required
                      autofocus
                      pattern="/[a-zA-Z0-9]/"
                      placeholder="Enter License Plate"
                      clearInput
                      className="uppercase align-right"
                    />

                    <IonSelect
                      onIonChange={onPlateCodeChange}
                      value={
                        typeof props.draft?.licensePlate?.code === 'number'
                          ? props.draft.licensePlate.code
                          : 3
                      }
                      interface="popover"
                    >
                      {PLATE_CODES.map((code, index) => (
                        <IonSelectOption value={index}>
                          {typeof code === 'number' ? `CODE 0${code}` : code}
                        </IonSelectOption>
                      ))}
                    </IonSelect>

                    <IonSelect
                      id="plate-region-select"
                      onIonChange={onPlateRegionChange}
                      value={props.draft?.licensePlate?.region || 'AA'}
                      interface="action-sheet"
                    >
                      {PLATE_REGIONS.map((region) => (
                        <IonSelectOption value={region.code}>
                          {region.code !== 'OTHER' ? `[${region.code}] ` : ''}
                          {region.name}
                        </IonSelectOption>
                      ))}
                    </IonSelect>
                  </IonItem>
                </IonCard>
                {props.draft.licensePlate.plate && (
                  <IonCard>
                    <IonList lines="full" className="vehicle-suggestions">
                      {vehicles.data?.vehicles?.length > 0 && (
                        <IonItemGroup>
                          <IonItemDivider>
                            <IonLabel>Select Existing Vehicle</IonLabel>
                          </IonItemDivider>

                          {vehicles.data?.vehicles.map((vehicle: any) => (
                            <IonItem
                              button
                              onClick={() => onSelectPlate(vehicle.id)}
                            >
                              <LicensePlate
                                number={vehicle.licensePlate.plate}
                                region={vehicle.licensePlate.region}
                                code={vehicle.licensePlate.code}
                              />
                            </IonItem>
                          ))}
                        </IonItemGroup>
                      )}

                      <IonItemGroup>
                        <IonItemDivider>
                          <IonLabel>Create New Vehicle</IonLabel>
                        </IonItemDivider>

                        <IonItem>
                          <div className="vehicle-form">
                            <div className="vehicle-form-content">
                              <div>
                                <LicensePlate
                                  number={props.draft.licensePlate.plate}
                                  code={props.draft.licensePlate.code}
                                  region={{
                                    code: props.draft.licensePlate.region,
                                  }}
                                />
                              </div>
                              <div className="vehicle-size">
                                <IonLabel>Select Vehicle Size:</IonLabel>
                                <div>
                                  {VEHICLE_SIZES.map(
                                    (size: string, i: number) => (
                                      <IonButton
                                        onClick={() => selectVehicleType(i)}
                                        shape="round"
                                        fill={
                                          props.draft.vehicle?.size === i
                                            ? 'solid'
                                            : 'outline'
                                        }
                                        color="secondary"
                                      >
                                        {size}
                                      </IonButton>
                                    )
                                  )}
                                </div>
                              </div>
                            </div>
                            <IonButton
                              onClick={createVehicle}
                              disabled={
                                props.draft?.licensePlate?.plate?.length < 5 ||
                                isNaN(props.draft?.vehicle?.size)
                              }
                            >
                              <IonIcon icon={checkmark} />
                              Create Vehicle
                            </IonButton>
                          </div>
                        </IonItem>
                      </IonItemGroup>
                    </IonList>
                  </IonCard>
                )}

                {false ? (
                  <IonItem>
                    <IonLabel>Driver:</IonLabel>
                    <IonInput
                      className="uppercase"
                      placeholder="Enter Driver's Name"
                    />
                  </IonItem>
                ) : (
                  ''
                )}
              </IonList>
            )}

            {props.draft.vehicleId && (
              <>
                {selectedVehicleRecords.data?.records &&
                  selectedVehicleRecords.data.records
                    .filter((record: any) => record.weights.length < 2)
                    .map((pending: any) => (
                      <RecordItem
                        record={pending}
                        secondWeightDraft={props.draft.reading}
                      />
                    ))}
                <IonCard className="new-record-card">
                  {selectedVehicle.data?.vehicle?.licensePlate && (
                    <IonList lines="full" className="selected-vehicle-wrap">
                      <IonItem className="title-row">
                        <IonTitle>Selected Vehicle</IonTitle>
                        <IonButton onClick={clearSelectedVehicle} fill="solid">
                          <IonIcon icon={closeCircleOutline} />
                          Clear
                        </IonButton>
                      </IonItem>
                      <IonItem className="content-row">
                        <div>
                          <LicensePlate
                            number={
                              selectedVehicle.data.vehicle.licensePlate.plate
                            }
                            code={
                              selectedVehicle.data.vehicle.licensePlate.code
                            }
                            region={
                              selectedVehicle.data.vehicle.licensePlate.region
                            }
                          />
                        </div>

                        <div>
                          <IonLabel>
                            <h4>Vehicle Size:</h4>
                          </IonLabel>
                          <IonChip color="secondary">
                            {getVehicleSize(selectedVehicle.data.vehicle.size)}
                          </IonChip>
                        </div>
                      </IonItem>
                    </IonList>
                  )}
                  <div className="create-button">
                    <IonButton onClick={createRecord}>
                      <IonIcon icon={receiptOutline} />
                      Create New Record
                    </IonButton>
                  </div>
                </IonCard>
              </>
            )}
          </IonCard>
        </>
      ) : (
        /* IF NO DRAFT */

        <IonList lines="full">
          <IonItem>
            <IonButton
              className="big-record-button"
              color="primary"
              size="large"
              shape="round"
              fill="solid"
              expand="block"
              onClick={capture}
            >
              <IonIcon slot="start" icon={speedometerOutline}></IonIcon>
              Record Current Weight
            </IonButton>
          </IonItem>
        </IonList>
      )}
    </IonCard>
  )
}

const mapStateToProps = (state: any) => {
  return {
    reading: state.scoreboard.reading,
    draft: state.record.recordDraft,
  }
}

export default connect(mapStateToProps, {
  updateReading,
  updateRecordDraft,
  deleteRecordDraft,
})(Form)
