import {
  IonButton,
  IonCard,
  IonCardContent,
  IonIcon,
  IonItemDivider,
  IonItemGroup,
  IonLabel,
  IonList,
} from '@ionic/react'
import { connect } from 'react-redux'
import React from 'react'
import {
  updateRecordDraft,
  deleteRecordDraft,
} from '../../state/actions/record.action'
import { VEHICLE_SIZES } from '../../model/vehicle.model'
import { addOutline } from 'ionicons/icons'
import { useMutation } from '@apollo/client'
import { CREATE_VEHICLE } from '../../gql/mutations/vehicle.mutations'
import LicensePlate from '../LicensePlate/LicensePlate'

const NewVehicleForm = (props: any) => {
  const [runCreateVehicle] = useMutation(CREATE_VEHICLE)

  const selectVehicleType = (size: number) => {
    props.updateRecordDraft({
      ...props.draft,
      vehicle: {
        size,
      },
    })
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

  return (
    <IonCard className="entity-card">
      <IonList lines="full" className="vehicle-suggestions">
        <IonItemGroup>
          <IonItemDivider>
            <IonLabel>Create New Vehicle</IonLabel>
          </IonItemDivider>

          <IonCardContent className="vehicle-form">
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
                  {VEHICLE_SIZES.map((size: string, i: number) => (
                    <IonButton
                      onClick={() => selectVehicleType(i)}
                      shape="round"
                      fill={
                        props.draft.vehicle?.size === i ? 'solid' : 'outline'
                      }
                      color="secondary"
                    >
                      {size}
                    </IonButton>
                  ))}
                </div>
              </div>
            </div>
          </IonCardContent>
        </IonItemGroup>
      </IonList>

      <IonButton
        expand="full"
        onClick={createVehicle}
        disabled={
          props.draft?.licensePlate?.plate?.length < 5 ||
          isNaN(props.draft?.vehicle?.size)
        }
      >
        <IonIcon icon={addOutline} />
        Create New Vehicle
      </IonButton>
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
  updateRecordDraft,
  deleteRecordDraft,
})(NewVehicleForm)
