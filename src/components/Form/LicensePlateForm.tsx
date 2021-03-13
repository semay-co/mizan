import {
  IonCard,
  IonInput,
  IonItem,
  IonSelect,
  IonSelectOption,
} from '@ionic/react'
import { connect } from 'react-redux'
import React, { useEffect } from 'react'
import {
  updateRecordDraft,
  deleteRecordDraft,
} from '../../state/actions/record.action'
import { PLATE_CODES, PLATE_REGIONS } from '../../model/vehicle.model'
import VehicleSuggestions from './VehicleSuggestions'
import NewVehicleForm from './NewVehicleForm'
import { useQuery } from '@apollo/client'
import { FETCH_VEHICLES } from '../../gql/queries/vehicle.queries'

const LicensePlateForm = (props: any) => {
  const vehicles = useQuery(FETCH_VEHICLES, {
    variables: {
      query: props.draft?.licensePlate?.plate,
      limit: 5,
    },
  })

  useEffect(() => {
    return () => vehicles.data
  }, [vehicles.data])

  const onPlateNumberChange = (ev: any) => {
    const plate = ev.detail?.value
      .split(/[^a-zA-Z0-9]/)
      .join('')
      .trim()
      .toUpperCase()

    ev.target.value = plate

    props.updateRecordDraft({
      ...props.draft,
      licensePlate: {
        ...props.draft?.licensePlate,
        plate,
      },
    })

    vehicles.refetch()
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

    vehicles.refetch()
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

    vehicles.refetch()
  }

  return (
    <>
      <IonCard className='license-plate-form entity-card'>
        <IonItem>
          <IonInput
            id='license-plate-input'
            onIonChange={onPlateNumberChange}
            debounce={500}
            maxlength={6}
            size={6}
            required
            autofocus
            pattern='/[a-zA-Z0-9]/'
            placeholder='Enter License Plate'
            clearInput
            className='uppercase align-right'
          />

          <IonSelect
            onIonChange={onPlateCodeChange}
            value={
              typeof props.draft?.licensePlate?.code === 'number'
                ? props.draft.licensePlate.code
                : 3
            }
            interface='popover'
          >
            {PLATE_CODES.map((code, index) => (
              <IonSelectOption key={code} value={index}>
                {typeof code === 'number' ? `CODE 0${code}` : code}
              </IonSelectOption>
            ))}
          </IonSelect>

          <IonSelect
            id='plate-region-select'
            onIonChange={onPlateRegionChange}
            value={props.draft?.licensePlate?.region || 'AA'}
            interface='action-sheet'
          >
            {PLATE_REGIONS.map((region) => (
              <IonSelectOption key={region.code} value={region.code}>
                {region.code !== 'OTHER' ? `[${region.code}] ` : ''}
                {region.name}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>
      </IonCard>
      {props.draft.licensePlate.plate && (
        <>
          {vehicles.data?.vehicles?.length > 0 && <VehicleSuggestions />}
          {vehicles.data?.vehicles.filter((vehicle: any) => {
            const suggestion = vehicle.licensePlate
            const draft = props.draft.licensePlate

            return (
              suggestion.plate === draft.plate &&
              suggestion.code === draft.code &&
              suggestion.region.code === draft.region
            )
          }).length === 0 && <NewVehicleForm />}
        </>
      )}
    </>
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
})(LicensePlateForm)
