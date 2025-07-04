import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonChip,
  IonIcon,
} from '@ionic/react'
import { connect } from 'react-redux'
import React from 'react'
import {
  updateRecordDraft,
  deleteRecordDraft,
} from '../../state/actions/record.action'
import { closeCircleOutline } from 'ionicons/icons'
import { useQuery } from '@apollo/client'
import { FETCH_VEHICLE } from '../../gql/queries/vehicle.queries'
import LicensePlate from '../LicensePlate/LicensePlate'

const SelectedVehicleCard = (props: any) => {
  const selectedVehicle = useQuery(FETCH_VEHICLE, {
    variables: {
      id: props.draft?.vehicleId,
    },
    fetchPolicy: 'network-only',
  })
  return (
    <>
      {selectedVehicle.data?.vehicle?.licensePlate && (
        <IonCard className='selected-vehicle-wrap entity-card'>
          <IonCardHeader>
            <div>Selected Vehicle</div>
            <IonButton
              onClick={props.onClear}
              fill='clear'
              shape='round'
              color='danger'
            >
              <IonIcon icon={closeCircleOutline} />
              Clear
            </IonButton>
          </IonCardHeader>
          <IonCardContent className='content-row'>
            <div>
              <LicensePlate
                number={selectedVehicle.data.vehicle.licensePlate.plate}
                code={selectedVehicle.data.vehicle.licensePlate.code}
                region={selectedVehicle.data.vehicle.licensePlate.region}
              />
            </div>

            <div>
              <IonChip color='secondary'>
                {props.getVehicleType(selectedVehicle.data.vehicle.type)}
              </IonChip>
            </div>
          </IonCardContent>
        </IonCard>
      )}
    </>
  )
}

const mapStateToProps = (state: any) => {
  return {
    draft: state.record.recordDraft,
  }
}

export default connect(mapStateToProps, {
  updateRecordDraft,
  deleteRecordDraft,
})(SelectedVehicleCard)
