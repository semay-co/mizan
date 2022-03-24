import React, { useState } from 'react'
import './RecordItem.scss'

import {
  IonButton,
  IonCard,
  IonCardContent,
  IonChip,
  IonIcon,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonList,
  IonToast,
  useIonPopover,
} from '@ionic/react'
import {
  addOutline,
  alertCircleOutline,
  chevronForward,
  closeOutline,
  create,
  menuOutline,
  personAddOutline,
  print,
  send,
  refreshOutline,
  trashOutline,
  cashOutline,
  checkmarkOutline,
} from 'ionicons/icons'
import moment from 'moment'
import LicensePlate from '../LicensePlate/LicensePlate'
import { connect } from 'react-redux'
import {
  updateRecordResult,
  deleteRecordDraft,
  updateRecordDraft,
} from '../../state/actions/record.action'
import { useMutation, useQuery } from '@apollo/client'
import {
  ADD_CUSTOMER,
  ADD_SECOND_WEIGHT,
  CREATE_RECORD,
  DELETE_CUSTOMER,
  SEND_CONFIRMATION_SMS,
  UPDATE_RECORD,
} from '../../gql/mutations/record.mutations'
import { VEHICLE_TYPES } from '../../model/vehicle.model'
import { PRINT_RECORD } from '../../gql/mutations/record.mutations'
import classNames from 'classnames'
import { FETCH_RECORD, FETCH_RECORDS } from '../../gql/queries/record.queries'
import { updateUIState } from '../../state/actions/ui.action'
import CustomerForm from '../Form/CustomerForm'

const RecordItem = (props: any) => {
  const record = props.record
  const [printRecord] = useMutation(PRINT_RECORD)
  const [sendConfirmationSms] = useMutation(SEND_CONFIRMATION_SMS)
  const [runCreateRecord] = useMutation(CREATE_RECORD)

  const [setAsUnpaid] = useMutation(UPDATE_RECORD)
  const [setAsFree] = useMutation(UPDATE_RECORD)
  const [setAsMistake] = useMutation(UPDATE_RECORD)

  const [addSecondWeightMutation] = useMutation(ADD_SECOND_WEIGHT)
  const [addCustomerMutation] = useMutation(ADD_CUSTOMER)
  const [deleteCustomerMutation] = useMutation(DELETE_CUSTOMER)

  const [showPrintingToast, setPrinting] = useState(false)
  const [paymentConfirmed, setPaymentConfirmed] = useState(false)

  const PopoverList: React.FC<{
    onHide: () => void
  }> = ({ onHide }) => (
    <IonList>
      <IonItem
        button
        className={record.isMistake ? 'success' : 'warning'}
        onClick={() => {
          onSetAsMistake(!record.isMistake)
          dismissPopover()
        }}
      >
        <IonIcon icon={alertCircleOutline} />
        <IonLabel>{record.isMistake ? 'Not Mistake' : 'Mistake'}</IonLabel>
      </IonItem>
      <IonItem
        button
        className={record.isUnpaid ? 'success' : 'warning'}
        onClick={() => {
          onSetAsUnpaid(!record.isUnpaid)
          dismissPopover()
        }}
      >
        <IonIcon icon={cashOutline} />
        <IonLabel>{record.isUnpaid ? 'Paid' : 'Unpaid'}</IonLabel>
      </IonItem>

      <IonItemDivider />

      {
        // record.seller || record.buyer ? (
        <IonItem
          button
          onClick={() => {
            onSendSms()
            onHide()
          }}
        >
          <IonIcon icon={send} />
          <IonLabel>Send SMS</IonLabel>
        </IonItem>
        // ) : (
        //   <></>
        // )
      }
      <IonItem
        button
        onClick={() => {
          onPrint()
          onHide()
        }}
      >
        <IonIcon icon={print} />
        <IonLabel>Print</IonLabel>
      </IonItem>
    </IonList>
  )

  const [presentPopover, dismissPopover] = useIonPopover(PopoverList, {
    onHide: () => dismissPopover(),
  })

  const recordQuery = useQuery(FETCH_RECORD, {
    variables: {
      id: props.record?.id,
    },
    skip: !props.record?.id,
    fetchPolicy: 'no-cache',
  })

  const formatDate = (date: number) =>
    moment(date).format('dddd - MMM DD, YYYY - h:mm a')

  const getNetWeight = () => {
    const firstWeight = record.weights[0].weight
    const secondWeight = record.weights[1]?.weight || weightDraft()?.weight

    return secondWeight
      ? Math.abs(firstWeight - secondWeight) + ' KG'
      : '...'
  }

  const weightDraft = () => {
    return props.draft?.reading || props.secondWeightDraft
  }

  const onSaveSecondWeight = () => {
    addSecondWeightMutation({
      variables: {
        recordId: record.id,
        weight: weightDraft().weight,
        manual: weightDraft().manual,
        createdAt: weightDraft().receivedAt.toString(),
      },
      update: () => {
        recordQuery.refetch()
      },
    })

    props.updateRecordResult(record.id)

    props.deleteRecordDraft()
  }

  const onPrint = () => {
    setPrinting(true)

    printRecord({
      variables: {
        id: record.id,
      },
    })
      .then(() => {
        setTimeout(() => {
          window.location.reload()
        }, 600)
      })
      .catch(console.error)

    // sendConfirmationSms({
    //   variables: {
    //     recordId: record.id,
    //   },
    // }).catch(console.error)
  }

  const onSendSms = (to: 'all' | 'buyer' | 'seller' = 'all') => {
    sendConfirmationSms({
      variables: {
        recordId: record.id,
        to,
      },
    }).catch(console.error)
  }

  const onSetAsMistake = (isMistake = true) => {
    setAsMistake({
      variables: {
        id: record.id,
        isMistake,
      },
      update: () => {
        recordQuery.refetch()
      },
    })
  }

  const onSetAsUnpaid = (isUnpaid = true) => {
    setAsUnpaid({
      variables: {
        id: record.id,
        isUnpaid,
      },
      update: () => {
        recordQuery.refetch()
      },
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
    }
  }

  const getPrice = (type: number) => {
    switch (type) {
      case 0:
        return 80 // pickup
      case 1:
        return 100 // light truck
      case 2:
        return 150 // midium truck
      case 3:
        return 200 // heavy truck
      case 4:
        return 250 // heavy truck + trailer
      default:
        return 0
    }
  }

  const makeNewRecord = (weight: number, weightTime: string) => {
    props.deleteRecordDraft()
    props.updateRecordDraft(undefined)

    runCreateRecord({
      variables: {
        weight,
        manual: props.draft?.reading?.manual || false,
        weightTime,
        vehicleId: record.vehicle?.id,
        sellerId: undefined,
        buyerId: undefined,
      },
      update: (cache, { data }) => {
        const result = data?.createRecord.record
        const current = cache.readQuery({
          query: FETCH_RECORDS,
        }) as any

        cache.writeQuery({
          query: FETCH_RECORDS,
          data: [...current.records.payload, result],
        })
      },
    }).then((record) => {
      props.updateRecordResult(record.data.createRecord.id)

      if (props.result) {
        // recordQuery.refetch()
        // selectedVehicleRecords.refetch()
      }
    })

    // props.updateRecordDraft({
    //   ...props.draft,
    //   recordId: record.id,
    //   reading: props.reading || 0,
    // })
  }

  const addCustomer = (party: string) => {
    props.updateUIState({
      addCustomerForm: {
        party,
        recordId: record.id,
      },
    })
  }

  const onAddCustomer = (customerId: string, customerType: string) => {
    console.log(record.id, customerId, customerType)
    addCustomerMutation({
      variables: {
        recordId: record.id,
        customerId,
        customerType,
      },
      update: () => {
        recordQuery.refetch()
      },
    })

    resetCustomerForm()
  }

  const onDeleteCustomer = (customerType: string) => {
    deleteCustomerMutation({
      variables: {
        recordId: record.id,
        customerType,
      },
      update: () => {
        recordQuery.refetch()
      },
    })
  }

  const resetCustomerForm = () => {
    props.updateUIState({
      addCustomerForm: undefined,
    })
  }

  const isSynced = () => props.reading?.weight === props.draft?.reading?.weight

  const isLoaded = () => props.draft?.reading?.weight > 1000

  return (
    <>
      {record && (
        <>
          <IonCard
            className={classNames(
              'record-card',
              record.isMistake ? 'error-card' : '',
              record.isFree ? 'green-card' : '',
              record.isUnpaid ? 'warning-card' : ''
            )}
          >
            <div className='card-left-content'>
              <IonList>
                {record?.serial && (
                  <IonItem className='serial-row'>
                    <IonLabel>
                      <h2>
                        Serial: <span>{record.serial}</span>
                      </h2>
                    </IonLabel>
                  </IonItem>
                )}

                <IonItem>
                  <IonLabel>
                    <span className='record-date'>
                      {moment(+record?.createdAt).format('MMM DD, YYYY')} <br />
                      {moment(+record?.createdAt).format('h:mm a')} <br />
                    </span>
                  </IonLabel>
                </IonItem>
                <IonItem>
                  <LicensePlate
                    code={record?.vehicle?.licensePlate?.code}
                    region={record?.vehicle?.licensePlate?.region}
                    number={record?.vehicle?.licensePlate?.plate}
                  />
                </IonItem>
                <IonItem>
                  <IonLabel>
                    <h2>Vehicle Type</h2>
                    <IonChip color='tertiary'>
                      {VEHICLE_TYPES[record?.vehicle?.type] || 'Unknown'}
                    </IonChip>
                  </IonLabel>
                </IonItem>
                {record?.seller ? (
                  <IonItem className='customer-row'>
                    <IonLabel>
                      <h2>Seller</h2>
                      <div>
                        <div className='name'>
                          {record.seller.name?.display}
                        </div>
                        <IonChip>{record.seller.phoneNumber?.number}</IonChip>

                        <div>
                          <IonButton
                            fill='outline'
                            color='danger'
                            onClick={() => onDeleteCustomer('seller')}
                          >
                            <IonIcon icon={trashOutline} />
                          </IonButton>

                          <IonButton
                            fill='outline'
                            onClick={() => onSendSms('buyer')}
                          >
                            <IonIcon icon={send} />
                          </IonButton>
                        </div>
                      </div>
                    </IonLabel>
                  </IonItem>
                ) : (
                  <IonItem button onClick={() => addCustomer('seller')}>
                    <IonIcon icon={personAddOutline} />
                    <IonLabel>Add Seller</IonLabel>
                  </IonItem>
                )}
                {record?.buyer ? (
                  <IonItem className='customer-row'>
                    <IonLabel>
                      <h2>Buyer</h2>
                      <div>
                        <div className='name'>{record.buyer.name?.display}</div>
                        <IonChip>{record.buyer.phoneNumber?.number}</IonChip>
                      </div>

                      <div>
                        <IonButton
                          fill='outline'
                          color='danger'
                          onClick={() => onDeleteCustomer('buyer')}
                        >
                          <IonIcon icon={trashOutline} />
                        </IonButton>
                        <IonButton
                          fill='outline'
                          onClick={() => onSendSms('buyer')}
                        >
                          <IonIcon icon={send} />
                        </IonButton>
                      </div>
                    </IonLabel>
                  </IonItem>
                ) : (
                  <>
                    <IonItem button onClick={() => addCustomer('buyer')}>
                      <IonIcon icon={personAddOutline} />
                      <IonLabel>Add Buyer</IonLabel>
                    </IonItem>
                  </>
                )}

              </IonList>
            </div>

            <div className='card-right-content'>
              <div className='weight-entry first-weight'>
                <h3>First Weight</h3>
                <span className='capture-date'>
                  {formatDate(+record?.weights[0]?.createdAt)}
                </span>

                <div
                  className={classNames(
                    'weight-measure',
                    record?.weights[0]?.manual && 'manual-input'
                  )}
                >
                  {record?.weights[0]?.weight} KG
                  {record?.weights[0]?.manual && (
                    <IonChip color='secondary'>
                      <IonIcon icon={create} />
                      <IonLabel>Manual</IonLabel>
                    </IonChip>
                  )}
                </div>

                {record?.weights[1] &&
                  moment(+record.weights[0].createdAt).isAfter(
                    moment().subtract(2, 'days')
                  ) && (
                    <IonButton
                      onClick={() =>
                        makeNewRecord(
                          record.weights[0].weight,
                          record.weights[0].createdAt
                        )
                      }
                      className='use-record-button'
                      color='success'
                      fill='outline'
                    >
                      <IonIcon icon={addOutline}></IonIcon>
                      New Record
                    </IonButton>
                  )}
              </div>

              {props.type === 'result' && !record?.weights[1] ? (
                <IonCard
                  className='price-card'
                  color={
                    record.isPaid !== true && record.isPaid !== false
                      ? 'warning'
                      : 'success'
                  }
                >
                  <h1><IonIcon icon={cashOutline} /> {getPrice(record.vehicle.type)} BIRR</h1>

                  {/* {!(record.isPaid !== true && record.isPaid !== false) && ( */}
                    <IonCardContent>
                      <IonButton
                        onClick={() => {
                          onSetAsUnpaid(true)
                          setPaymentConfirmed(true)
                        }}
                        color='danger'
                        fill='outline'
                        slot='end'
                      >
                        <IonIcon icon={closeOutline} />
                        <IonLabel>Unpaid</IonLabel>
                      </IonButton>

                      <IonButton
                        onClick={() => {
                          onSetAsUnpaid(false)
                          setPaymentConfirmed(true)
                        }}
                        color='success'
                        fill='solid'
                        slot='start'
                      >
                        <IonIcon icon={checkmarkOutline} />
                        <IonLabel>Paid</IonLabel>
                      </IonButton>
                    </IonCardContent>
                  {/* )} */}
                </IonCard>
              ) : (
                <>
                  {!record?.weights[1] && !weightDraft() ? (
                    <></>
                  ) : (
                    <>
                      <div className='weight-entry second-weight'>
                        <h3>Second Weight</h3>
                        {record?.weights[1] ? (
                          <>
                            <span className='capture-date'>
                              {formatDate(+record.weights[1]?.createdAt)}
                            </span>
                            <div
                              className={classNames(
                                'weight-measure',
                                record?.weights[1]?.manual && 'manual-input'
                              )}
                            >
                              {record.weights[1].weight} KG
                              {record?.weights[1]?.manual && (
                                <IonChip color='secondary'>
                                  <IonIcon icon={create} />
                                  <IonLabel>Manual</IonLabel>
                                </IonChip>
                              )}
                            </div>
                            {moment(+record.weights[1].createdAt).isAfter(
                              moment().subtract(2, 'days')
                            ) && (
                              <IonButton
                                onClick={() =>
                                  makeNewRecord(
                                    record.weights[1].weight,
                                    record.weights[1].createdAt
                                  )
                                }
                                className='use-record-button'
                                color='success'
                                fill='outline'
                              >
                                <IonIcon icon={addOutline}></IonIcon>
                                New Record
                              </IonButton>
                            )}
                          </>
                        ) : (
                          <>
                            {weightDraft() ? (
                              <>
                                <span className='capture-date'>
                                  {formatDate(+weightDraft().receivedAt)}
                                </span>
                                <div
                                  className={classNames(
                                    'weight-measure',
                                    isLoaded() && isSynced()
                                      ? 'green-draft'
                                      : 'red-draft'
                                  )}
                                >
                                  {weightDraft().weight} KG
                                  {!isSynced() && (
                                    <IonButton
                                      className='update-button'
                                      onClick={recordReading}
                                      color='dark'
                                      shape='round'
                                      size='small'
                                      fill='clear'
                                    >
                                      <IonIcon icon={refreshOutline} />
                                    </IonButton>
                                  )}
                                </div>
                              </>
                            ) : true ? (
                              <>
                                <span className='record-pending'>Pending</span>
                              </>
                            ) : (
                              <></>
                            )}
                          </>
                        )}
                      </div>
                      {(weightDraft() || record.weights[1]) && (
                        <div className='weight-entry net-weight'>
                          <h3>Net Weight</h3>
                          <span className='capture-date'>
                            {record?.weights[0] &&
                              moment(
                                +record.weights[1]?.createdAt ||
                                  new Date().getTime()
                              ).from(+record.weights[0]?.createdAt)}
                          </span>
                          <div className='weight-measure'>{getNetWeight()}</div>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}

              {weightDraft() ? (
                <div
                  className={classNames({
                    'bottom-button': true,
                    'danger-button': !isLoaded() || !isSynced(),
                    'warn-button': moment(
                      +record.weights[0].createdAt
                    ).isBefore(moment().subtract(2, 'days')),
                  })}
                >
                  {!record?.weights[1] &&
                    moment(+record?.weights[0].createdAt).isBefore(
                      moment().subtract(2, 'days')
                    ) && (
                      <>
                        <IonButton
                          color='warning'
                          disabled
                          className='time-warning'
                        >
                          <IonIcon icon={alertCircleOutline} />
                          <IonLabel>
                            {moment(+record?.weights[0].createdAt).fromNow()}
                          </IonLabel>
                        </IonButton>
                      </>
                    )}
                  <IonButton
                    onClick={onSaveSecondWeight}
                    size='large'
                    expand='block'
                  >
                    Use Second Weight
                    <IonIcon icon={chevronForward} />
                  </IonButton>
                </div>
              ) : (
                <>
                  {props.type === 'result' &&
                    !record?.weights[1] &&
                    (record.weights[1] ||
                      props.type !== 'result' ||
                      paymentConfirmed) && (
                      <div className='right-button'>
                        {record.seller || record.buyer ? (
                          <IonButton onClick={() => onSendSms()}>
                            <IonIcon icon={send} />
                            Send SMS
                          </IonButton>
                        ) : (
                          <></>
                        )}
                        <IonButton onClick={onPrint}>
                          <IonIcon icon={print} />
                          Print
                        </IonButton>
                      </div>
                    )}
                  {record.isUnpaid && (
                    <IonCard color='warning'>
                      <IonCardContent>UNPAID</IonCardContent>
                    </IonCard>
                  )}
                    <div className='right-button'>
                      <IonButton
                        size='large'
                        onClick={(e) =>
                          presentPopover({
                            event: e.nativeEvent,
                          })
                        }
                      >
                        <IonIcon icon={menuOutline} />
                      </IonButton>
                    </div>
                </>
              )}
            </div>
          </IonCard>

          {props.ui.addCustomerForm &&
            props.ui.addCustomerForm.recordId === record.id && (
              <IonCard className='add-customer-card'>
                <IonButton
                  shape='round'
                  fill='clear'
                  color='danger'
                  onClick={resetCustomerForm}
                >
                  <IonIcon icon={closeOutline} />
                  Cancel
                </IonButton>
                <CustomerForm
                  noTitle
                  party={props.ui.addCustomerForm.party}
                  type='card-form'
                  onSelectCustomer={onAddCustomer}
                />
              </IonCard>
            )}
          <IonToast
            color='success'
            cssClass='printing-toast'
            isOpen={showPrintingToast}
            onDidDismiss={() => setPrinting(false)}
            message='PRINTING...'
            duration={2000}
          />
        </>
      )}
    </>
  )
}

const mapStateToProps = (state: any) => {
  return {
    reading: state.scoreboard.reading,
    draft: state.record.recordDraft,
    ui: state.ui,
  }
}

export default connect(mapStateToProps, {
  updateRecordResult,
  updateRecordDraft,
  deleteRecordDraft,
  updateUIState,
})(RecordItem)
