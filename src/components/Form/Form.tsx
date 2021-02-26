import { IonButton, IonCard, IonIcon, IonItem, IonList } from '@ionic/react'
import { connect } from 'react-redux'
import './Form.scss'
import { updateReading } from '../../state/actions/scoreboard.action'
import {
  updateRecordDraft,
  deleteRecordDraft,
  updateRecordResult,
} from '../../state/actions/record.action'
import {
  addOutline,
  closeOutline,
  homeOutline,
  speedometerOutline,
} from 'ionicons/icons'
import { VEHICLE_SIZES } from '../../model/vehicle.model'
import { useMutation, useQuery } from '@apollo/client'
import { FETCH_RECORD, FETCH_RECORDS } from '../../gql/queries/record.queries'
import $ from 'jquery'
import React from 'react'
import * as _ from 'ramda'
import RecordItem from '../Record/RecordItem'
import { CREATE_RECORD } from '../../gql/mutations/record.mutations'
import RecordedWeight from './RecordedWeight'
import LicensePlateForm from './LicensePlateForm'
import SelectedVehicleCard from './SelectedVehicleCard'

const Form = (props: any) => {
  const [runCreateRecord] = useMutation(CREATE_RECORD)
  const recordQuery = useQuery(FETCH_RECORD, {
    variables: {
      id: props.result,
    },
    skip: !props.result,
  })

  const selectedVehicleRecords = useQuery(FETCH_RECORDS, {
    variables: {
      vehicleId: props.draft?.vehicleId,
    },
  })

  const clearForm = () => {
    props.deleteRecordDraft()
    props.updateRecordResult(undefined)
  }

  const clearSelectedVehicle = () => {
    props.updateRecordDraft({
      ...props.draft,
      vehicleId: undefined,
      vehicle: undefined,
    })
  }

  const recordReading = () => {
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
      }).then((record) => {
        console.log('record', record)
        props.updateRecordResult(record.data.createRecord)
        if (props.result) {
          recordQuery.refetch()
        }
      })
    } else {
      alert('Record information incomplete')
    }
  }

  const getVehicleSize = (size: number) => {
    return VEHICLE_SIZES[size] || 'UNKNOWN'
  }

  return (
    <div>
      {props.draft &&
        props.draft.vehicleId &&
        selectedVehicleRecords.data?.records &&
        selectedVehicleRecords.data.records
          .filter((record: any) => record.weights.length < 2)
          .map((pending: any) => (
            <div className="existing-record">
              <RecordItem
                record={pending}
                secondWeightDraft={props.draft.reading}
              />
            </div>
          ))}

      <IonCard className="form-wrap">
        {props.draft ? (
          <>
            <RecordedWeight onRecord={recordReading} />

            {!props.draft.vehicleId && <LicensePlateForm />}

            {props.draft.vehicleId && (
              <>
                <SelectedVehicleCard
                  getVehicleSize={getVehicleSize}
                  onClear={clearSelectedVehicle}
                />

                <IonCard className="create-button-card">
                  <IonButton size="large" onClick={createRecord}>
                    <IonIcon icon={addOutline} />
                    Create New Record
                  </IonButton>
                </IonCard>
              </>
            )}
          </>
        ) : (
          <>
            {recordQuery.data ? (
              <>
                <IonButton fill="clear" size="large" onClick={clearForm}>
                  <IonIcon icon={closeOutline}></IonIcon>
                  Clear
                </IonButton>
                <RecordItem record={recordQuery.data.record} />
              </>
            ) : (
              <IonList lines="full">
                <IonItem>
                  <IonButton
                    className="big-record-button"
                    color="primary"
                    size="large"
                    // shape="round"
                    fill="solid"
                    expand="block"
                    onClick={recordReading}
                  >
                    <IonIcon slot="start" icon={speedometerOutline}></IonIcon>
                    Record Current Weight
                  </IonButton>
                </IonItem>
              </IonList>
            )}
          </>
        )}
      </IonCard>
    </div>
  )
}

const mapStateToProps = (state: any) => {
  return {
    reading: state.scoreboard.reading,
    draft: state.record.recordDraft,
    result: state.record.recordResult,
  }
}

export default connect(mapStateToProps, {
  updateReading,
  updateRecordDraft,
  updateRecordResult,
  deleteRecordDraft,
})(Form)
