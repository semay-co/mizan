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
import { VEHICLE_TYPES } from '../../model/vehicle.model'
import { addOutline } from 'ionicons/icons'
import { useMutation } from '@apollo/client'
import { CREATE_VEHICLE } from '../../gql/mutations/vehicle.mutations'
import LicensePlate from '../LicensePlate/LicensePlate'

const NewVehicleForm = (props: any) => {
  const [runCreateVehicle] = useMutation(CREATE_VEHICLE)

  const selectVehicleType = (type: number) => {
    props.updateRecordDraft({
      ...props.draft,
      vehicle: {
        type,
      },
    })
  }

  const createVehicle = () => {
    const draft = props.draft

    if (
      draft &&
      !isNaN(draft.vehicle?.type) &&
      draft.licensePlate?.plate &&
      draft.licensePlate?.code &&
      draft.licensePlate?.region
    ) {
      runCreateVehicle({
        variables: {
          type: draft.vehicle.type,
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
              type: draft.vehicle.type,
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
              <div className="vehicle-type">
                <IonLabel>Select Vehicle Type:</IonLabel>
                <div>
                  {VEHICLE_TYPES.map((type: string, i: number) => (
                    <IonButton
                      onClick={() => selectVehicleType(i)}
                      shape="round"
                      fill={
                        props.draft.vehicle?.type === i ? 'solid' : 'outline'
                      }
                      color="secondary"
                    >
                      {type}
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
          isNaN(props.draft?.vehicle?.type)
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
