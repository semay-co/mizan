import React from 'react'
import './RecordItem.scss'

import {
  IonButton,
  IonCard,
  IonChip,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
} from '@ionic/react'
import {
  addOutline,
  alertCircleOutline,
  chevronForward,
  personAddOutline,
  printOutline,
  refreshOutline,
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
  ADD_SECOND_WEIGHT,
  CREATE_RECORD,
} from '../../gql/mutations/record.mutations'
import { VEHICLE_TYPES } from '../../model/vehicle.model'
import { PRINT_RECORD } from '../../gql/mutations/record.mutations'
import classNames from 'classnames'
import { FETCH_RECORD, FETCH_RECORDS } from '../../gql/queries/record.queries'

const RecordItem = (props: any) => {
  const record = props.record
  const [printRecord] = useMutation(PRINT_RECORD)
  const [runCreateRecord] = useMutation(CREATE_RECORD)

  const [addSecondWeight] = useMutation(ADD_SECOND_WEIGHT)
  const fetchRecord = useQuery(FETCH_RECORD, {
    variables: {
      id: props.record?.id,
    },
    skip: !props.record?.id,
    fetchPolicy: 'network-only',
  })

  const formatDate = (date: number) =>
    moment(date).format('dddd - MMM DD, YYYY - h:mm a')

  const getNetWeight = () => {
    const firstWeight = record.weights[0].weight
    const secondWeight = record.weights[1]?.weight || weightDraft()?.weight

    return secondWeight
      ? Math.abs(firstWeight - secondWeight).toLocaleString() + ' KG'
      : '...'
  }

  const weightDraft = () => {
    return props.draft?.reading || props.secondWeightDraft
  }

  const onSaveSecondWeight = () => {
    addSecondWeight({
      variables: {
        recordId: record.id,
        weight: weightDraft().weight,
        createdAt: weightDraft().receivedAt.toString(),
      },
      update: () => {
        fetchRecord.refetch()
      },
    })

    props.updateRecordResult(record.id)

    props.deleteRecordDraft()
  }

  const onPrint = () => {
    printRecord({
      variables: {
        id: record.id,
      },
    }).catch(console.error)
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
        return 80
      case 1:
        return 100
      case 2:
        return 150
      case 3:
        return 200
      case 4:
        return 250
      default:
        return 0
    }
  }

  const makeNewRecord = (weight: number, weightTime: string) => {
    console.log(record)
    runCreateRecord({
      variables: {
        weight,
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
          data: [...current.records, result],
        })
      },
    }).then((record) => {
      props.updateRecordResult(record.data.createRecord.id)
      props.deleteRecordDraft()

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

  const isSynced = () => props.reading?.weight === props.draft?.reading?.weight

  const isLoaded = () => props.draft?.reading?.weight > 1000

  return (
    <>
      {record && (
        <IonCard className='record-card'>
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
                <LicensePlate
                  code={record?.vehicle?.licensePlate?.code}
                  region={record?.vehicle?.licensePlate?.region}
                  number={record?.vehicle?.licensePlate?.plate}
                />
              </IonItem>
              <IonItem>
                <IonLabel>
                  <h2>Vehicle Type</h2>
                  <IonChip color='secondary'>
                    {VEHICLE_TYPES[record?.vehicle?.type] || 'Unknown'}
                  </IonChip>
                </IonLabel>
              </IonItem>
              {record?.buyer ? (
                <IonItem className='customer-row'>
                  <IonLabel>
                    <h2>Buyer</h2>
                    <div>
                      <div className='name'>{record.buyer.name?.display}</div>
                      <IonChip>{record.buyer.phoneNumber?.number}</IonChip>
                    </div>
                  </IonLabel>
                </IonItem>
              ) : (
                <>
                  <IonItem button>
                    <IonIcon icon={personAddOutline} />
                    <IonLabel>Add Buyer</IonLabel>
                  </IonItem>
                </>
              )}
              {record?.seller ? (
                <IonItem className='customer-row'>
                  <IonLabel>
                    <h2>Seller</h2>
                    <div>
                      <div className='name'>{record.seller.name?.display}</div>
                      <IonChip>{record.seller.phoneNumber?.number}</IonChip>
                    </div>
                  </IonLabel>
                </IonItem>
              ) : (
                <IonItem button>
                  <IonIcon icon={personAddOutline} />
                  <IonLabel>Add Seller</IonLabel>
                </IonItem>
              )}
            </IonList>
          </div>

          <div className='card-right-content'>
            <div className='weight-entry first-weight'>
              <h3>First Weight</h3>
              <span className='record-date'>
                {formatDate(+record?.weights[0]?.createdAt)}
              </span>

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

              <div className='weight-measure'>
                {record?.weights[0]?.weight.toLocaleString()} KG
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
              <IonCard className='price-card' color='success'>
                <h1>{getPrice(record.vehicle.type)} BIRR</h1>
              </IonCard>
            ) : (
              <>
                <div className='weight-entry second-weight'>
                  <h3>Second Weight</h3>
                  {record?.weights[1] ? (
                    <>
                      <span className='record-date'>
                        {formatDate(+record.weights[1]?.createdAt)}
                      </span>
                      <div className='weight-measure'>
                        {record.weights[1].weight.toLocaleString()} KG
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
                          <span className='record-date'>
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
                            {weightDraft().weight.toLocaleString()} KG
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
                  <div className='weight-entry net-weight'>
                    <h3>Net Weight</h3>
                    <span className='record-date'>
                      {record?.weights[0] &&
                        moment(
                          +record.weights[1]?.createdAt || new Date().getTime()
                        ).from(+record.weights[0]?.createdAt)}
                    </span>
                    <div className='weight-measure'>{getNetWeight()}</div>
                  </div>
                )}
              </>
            )}

            {!weightDraft() && (
              <div className='right-button'>
                <IonButton onClick={onPrint}>
                  <IonIcon icon={printOutline} />
                  Print
                </IonButton>
              </div>
            )}
          </div>
        </IonCard>
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
  updateRecordResult,
  updateRecordDraft,
  deleteRecordDraft,
})(RecordItem)
