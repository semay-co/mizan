import {
  IonCard,
  IonChip,
  IonItem,
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
import LicensePlate from '../LicensePlate/LicensePlate'
import { useQuery } from '@apollo/client'
import { FETCH_VEHICLES } from '../../gql/queries/vehicle.queries'
import { FETCH_RECORDS } from '../../gql/queries/record.queries'
import { VEHICLE_TYPES } from '../../model/vehicle.model'

const VehicleSuggestions = (props: any) => {
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

  const onSelectPlate = (vehicleId: string) => {
    selectedVehicleRecords.refetch()

    props.updateRecordDraft({
      ...props.draft,
      vehicleId,
    })
  }

  // const getVehicleType = (type: number) => VEHICLE_TYPES[type] || 'UNKNOWN'

  return (
    <IonCard>
      <IonList lines='full' className='vehicle-suggestions'>
        <IonItemGroup>
          <IonItemDivider>
            <IonLabel>Select Existing Vehicle</IonLabel>
          </IonItemDivider>

          {vehicles.data?.vehicles.map((vehicle: any) => (
            <IonItem
              key={vehicle.id}
              button
              onClick={() => onSelectPlate(vehicle.id)}
            >
              <LicensePlate
                number={vehicle.licensePlate.plate}
                region={vehicle.licensePlate.region}
                code={vehicle.licensePlate.code}
              />

              <IonChip color='secondary'>
                {VEHICLE_TYPES[vehicle.type] || 'UNKNOWN'}
              </IonChip>
            </IonItem>
          ))}
        </IonItemGroup>
      </IonList>
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
})(VehicleSuggestions)
