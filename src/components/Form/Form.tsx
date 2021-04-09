import { IonButton, IonCard, IonIcon, IonText } from '@ionic/react'
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
  reloadOutline,
  speedometerOutline,
} from 'ionicons/icons'
import { VEHICLE_TYPES } from '../../model/vehicle.model'
import { useMutation, useQuery } from '@apollo/client'
import { FETCH_RECORD, FETCH_RECORDS } from '../../gql/queries/record.queries'
import $ from 'jquery'
import React from 'react'
import RecordItem from '../Record/RecordItem'
import { CREATE_RECORD } from '../../gql/mutations/record.mutations'
import RecordedWeight from './RecordedWeight'
import LicensePlateForm from './LicensePlateForm'
import SelectedVehicleCard from './SelectedVehicleCard'
import classNames from 'classnames'
import CustomerForm from './CustomerForm'
import SelectedCustomerCard from './SelectedCustomerCard'

const Form = (props: any) => {
  const [runCreateRecord] = useMutation(CREATE_RECORD)
  const recordQuery = useQuery(FETCH_RECORD, {
    variables: {
      id: props.result,
    },
    skip: !props.result,
    fetchPolicy: 'network-only',
  })

  const selectedVehicleRecords = useQuery(FETCH_RECORDS, {
    variables: {
      vehicleId: props.draft?.vehicleId,
    },
    fetchPolicy: 'network-only',
  })

  const selectedRecord = useQuery(FETCH_RECORD, {
    variables: {
      id: props.draft?.recordId,
    },
    fetchPolicy: 'network-only',
  })

  const clearForm = () => {
    props.deleteRecordDraft()
    // props.updateRecordResult(undefined)
  }

  const clearSelectedVehicle = () => {
    props.updateRecordDraft({
      ...props.draft,
      vehicleId: undefined,
      vehicle: undefined,
    })
  }

  const clearSelectedBuyer = () => {
    props.updateRecordDraft({
      ...props.draft,
      buyerId: undefined,
      buyer: undefined,
    })
  }

  const clearSelectedSeller = () => {
    props.updateRecordDraft({
      ...props.draft,
      sellerId: undefined,
      seller: undefined,
    })
  }

  const isSynced = () => props.reading.weight === props.draft?.reading?.weight

  const isLoaded = () => props.draft?.reading?.weight >= 1000

  const recordReading = (
    skipBuyer: boolean = false,
    skipSeller: boolean = false
  ) => {
    if (props.reading) {
      props.updateRecordDraft({
        ...props.draft,
        reading: props.reading,
        licensePlate: {
          plate: props.draft?.licensePlate?.plate || '',
          code: props.draft?.licensePlate?.code || 3,
          region: props.draft?.licensePlate?.region || 'AA',
        },
        skipBuyer: props.draft?.skipBuyer || skipBuyer,
        skipSeller: props.draft?.skipSeller || skipSeller,
      })

      setTimeout(() => {
        const input = $('#license-plate-input').find('input').first()
        input.trigger('focus')
        input.val = props.draft?.licensePlate?.plate
      }, 200)
    }
  }

  const createRecord = () => {
    const draft = props.draft

    if (draft && !isNaN(draft.reading?.weight) && draft.licensePlate?.plate) {
      runCreateRecord({
        variables: {
          weight: draft.reading.weight,
          vehicleId: draft.vehicleId,
          sellerId: draft.sellerId || undefined,
          buyerId: draft.buyerId || undefined,
        },
        update: (cache, { data }) => {
          const result = data?.createRecord.record
          const current = cache.readQuery({
            query: FETCH_RECORDS,
          }) as any

          cache.writeQuery({
            query: FETCH_RECORDS,
            data: [...current.records, result],
          })
        },
      }).then((record) => {
        console.log('record', record)
        props.updateRecordResult(record.data.createRecord.id)

        if (props.result) {
          recordQuery.refetch()
          selectedVehicleRecords.refetch()
        }
      })
    } else {
      alert('Record information incomplete')
    }
  }

  const addParty = (type: string) => {
    const party =
      type === 'seller'
        ? {
            skipSeller: undefined,
          }
        : {
            skipBuyer: undefined,
          }

    props.updateRecordDraft({
      ...props.draft,
      ...party,
    })
  }

  const getVehicleType = (type: number) => {
    return VEHICLE_TYPES[type] || 'UNKNOWN'
  }

  return (
    <div>
      {props.draft &&
        props.draft.vehicleId &&
        selectedVehicleRecords.data?.records &&
        selectedVehicleRecords.data.records
          .filter((record: any) => record.weights.length < 2)
          .map((pending: any) => (
            <div key={pending.id} className='existing-record'>
              <RecordItem
                record={pending}
                secondWeightDraft={props.draft.reading}
              />
            </div>
          ))}

      {props.draft && props.draft.recordId && (
        <div key={selectedRecord.data?.record.id} className='existing-record'>
          <RecordItem
            record={selectedRecord.data?.record}
            secondWeightDraft={props.draft.reading}
          />
        </div>
      )}

      <div className='form-wrap'>
        {!props.draft ? (
          <>
            {recordQuery.data ? (
              <>
                <IonButton fill='clear' size='large' onClick={clearForm}>
                  <IonIcon icon={closeOutline}></IonIcon>
                  Clear
                </IonButton>
                <RecordItem record={recordQuery.data.record} />
              </>
            ) : (
              <IonCard
                className='big-record-button'
                color='primary'
                button={true}
                onClick={() => recordReading(true, true)}
              >
                <IonIcon icon={speedometerOutline}></IonIcon>
                Start Meauring
              </IonCard>
            )}
          </>
        ) : (
          <>
            <RecordedWeight onRecord={recordReading} />

            {!props.draft.vehicleId ? (
              <LicensePlateForm />
            ) : (
              <>
                <SelectedVehicleCard
                  getVehicleType={getVehicleType}
                  onClear={clearSelectedVehicle}
                />

                {!props.draft.buyerId && !props.draft.skipBuyer ? (
                  <>
                    {!props.draft.skipBuyer ? (
                      <CustomerForm party='buyer' />
                    ) : (
                      ''
                    )}
                  </>
                ) : (
                  <>
                    <SelectedCustomerCard
                      party='buyer'
                      onClear={clearSelectedBuyer}
                    />
                    {!props.draft.sellerId ? (
                      <>
                        {!props.draft.skipSeller ? (
                          <CustomerForm party='seller' />
                        ) : (
                          ''
                        )}
                      </>
                    ) : (
                      <SelectedCustomerCard
                        party='seller'
                        onClear={clearSelectedSeller}
                      />
                    )}
                  </>
                )}

                {props.draft.skipBuyer && (
                  <IonCard>
                    <IonButton
                      onClick={() => addParty('buyer')}
                      fill='outline'
                      expand='block'
                    >
                      <IonIcon icon={addOutline} />
                      Add Buyer
                    </IonButton>
                  </IonCard>
                )}
                {props.draft.skipSeller && (
                  <IonCard>
                    <IonButton
                      onClick={() => addParty('seller')}
                      fill='outline'
                      expand='block'
                    >
                      <IonIcon icon={addOutline} />
                      Add Seller
                    </IonButton>
                  </IonCard>
                )}
              </>
            )}

            {props.draft.vehicleId &&
              (props.draft.sellerId || props.draft.skipSeller) &&
              (props.draft.buyerId || props.draft.skipBuyer) && (
                <>
                  <IonCard
                    className={classNames({
                      'create-button-card': true,
                      'danger-button': !isLoaded() || !isSynced(),
                    })}
                  >
                    {' '}
                    {!isSynced() ? (
                      <>
                        <IonText>Weight has changed</IonText>
                        <IonButton
                          className='update-button'
                          shape='round'
                          color='secondary'
                          fill='solid'
                          onClick={() => recordReading()}
                        >
                          <IonIcon icon={reloadOutline} />
                          Update
                        </IonButton>
                      </>
                    ) : (
                      !isLoaded() && <IonText>Weight is too small</IonText>
                    )}
                    <IonButton
                      className='create-button'
                      size='large'
                      onClick={createRecord}
                    >
                      <IonIcon icon={addOutline} />
                      Create New Record
                    </IonButton>
                  </IonCard>
                </>
              )}
          </>
        )}
      </div>
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
