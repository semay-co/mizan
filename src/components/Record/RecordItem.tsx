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
  checkmark,
  printOutline,
  refreshOutline,
  speedometerOutline,
} from 'ionicons/icons'
import moment from 'moment'
import LicensePlate from '../LicensePlate/LicensePlate'
import { connect } from 'react-redux'
import {
  updateRecordResult,
  deleteRecordDraft,
  updateRecordDraft,
} from '../../state/actions/record.action'
import { useMutation } from '@apollo/client'
import { ADD_SECOND_WEIGHT } from '../../gql/mutations/record.mutations'
import { VEHICLE_TYPES } from '../../model/vehicle.model'
import { PRINT_RECORD } from '../../gql/mutations/record.mutations'
import classNames from 'classnames'

const RecordItem = (props: any) => {
  const record = props.record
  const secondWeightDraft = props.secondWeightDraft
  const [printRecord] = useMutation(PRINT_RECORD)

  const [addSecondWeight] = useMutation(ADD_SECOND_WEIGHT)

  const formatDate = (date: number) =>
    moment(date).format('dddd - MMM DD, YYYY - h:mm a')

  const getNetWeight = () => {
    const firstWeight = record.weights[0].weight
    const secondWeight = record.weights[1]?.weight || secondWeightDraft?.weight

    return secondWeight
      ? Math.abs(firstWeight - secondWeight).toLocaleString() + ' KG'
      : '...'
  }

  const onSaveSecondWeight = () => {
    addSecondWeight({
      variables: {
        recordId: record.id,
        weight: secondWeightDraft.weight,
        createdAt: secondWeightDraft.receivedAt.toString(),
      },
    })

    props.updateRecordResult(record.id)
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

  const selectRecord = () => {
    props.updateRecordResult(record.id)
  }

  const isSynced = () => props.reading.weight === props.draft?.reading?.weight

  const isLoaded = () => props.draft?.reading?.weight > 1000

  return (
    <>
      <IonCard className='record-card'>
        <div className='card-left-content'>
          <IonList>
            {record.serial && (
              <IonItem>
                <IonLabel>
                  <h2>Serial: {record.serial}</h2>
                </IonLabel>
              </IonItem>
            )}
            <IonItem>
              <LicensePlate
                code={record.vehicle?.licensePlate?.code}
                region={record.vehicle?.licensePlate?.region}
                number={record.vehicle?.licensePlate?.plate}
              />
            </IonItem>
            <IonItem>
              <IonLabel>
                <h2>Vehicle Type</h2>
                <IonChip color='secondary'>
                  {VEHICLE_TYPES[record.vehicle?.type] || 'Unknown'}
                </IonChip>
              </IonLabel>
            </IonItem>
            {record.buyer && (
              <IonItem className='customer-row'>
                <IonLabel>
                  <h2>Buyer</h2>
                  <div>
                    <div className='name'>{record.buyer.name?.display}</div>
                    <IonChip>{record.buyer.phoneNumber?.number}</IonChip>
                  </div>
                </IonLabel>
              </IonItem>
            )}
            {record.seller && (
              <IonItem className='customer-row'>
                <IonLabel>
                  <h2>Seller</h2>
                  <div>
                    <div className='name'>{record.seller.name?.display}</div>
                    <IonChip>{record.seller.phoneNumber?.number}</IonChip>
                  </div>
                </IonLabel>
              </IonItem>
            )}
          </IonList>
        </div>

        <div className='card-right-content'>
          <div className='weight-entry first-weight'>
            <h3>First Weight</h3>
            <span className='record-date'>
              {formatDate(+record.weights[0]?.createdAt)}
            </span>

            <div className='weight-measure'>
              {record.weights[0]?.weight.toLocaleString()} KG
            </div>
          </div>
          <div className='weight-entry second-weight'>
            <h3>Second Weight</h3>
            {record.weights[1] ? (
              <>
                <span className='record-date'>
                  {formatDate(+record.weights[1]?.createdAt)}
                </span>
                <div className='weight-measure'>
                  {record.weights[1].weight.toLocaleString()} KG
                </div>
              </>
            ) : (
              <>
                {secondWeightDraft ? (
                  <>
                    <span className='record-date'>
                      {formatDate(+secondWeightDraft.receivedAt)}
                    </span>
                    <div
                      className={classNames(
                        'weight-measure',
                        isLoaded() && isSynced() ? 'green-draft' : 'red-draft'
                      )}
                    >
                      {secondWeightDraft.weight.toLocaleString()} KG
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
                ) : (
                  <>
                    <span className='record-pending'>Pending</span>
                    <IonButton
                      onClick={selectRecord}
                      className='record-pending-button'
                      color='success'
                      fill='outline'
                    >
                      <IonIcon icon={speedometerOutline}></IonIcon>
                      {/* {false &&
                      // Use{' '}
                      // {props.draft?.reading
                      //   ? props.draft.reading?.weight
                      //   : 0}{' '}
                      // KG
                      } */}
                    </IonButton>
                  </>
                )}
              </>
            )}
          </div>
          <div className='weight-entry net-weight'>
            <h3>Net Weight</h3>
            <span className='record-date'>
              {record.weights[0] &&
                moment(
                  +record.weights[1]?.createdAt || new Date().getTime()
                ).from(+record.weights[0].createdAt)}
            </span>
            <div className='weight-measure'>{getNetWeight()}</div>
          </div>

          {!secondWeightDraft && (
            <div className='right-button'>
              <IonButton onClick={onPrint}>
                <IonIcon icon={printOutline} />
                Print
              </IonButton>
            </div>
          )}
        </div>
        {secondWeightDraft && (
          <div
            className={classNames({
              'bottom-button': true,
              'danger-button': !isLoaded() || !isSynced(),
            })}
          >
            <IonButton onClick={onSaveSecondWeight} size='large' expand='block'>
              <IonIcon icon={checkmark} />
              Use This Record
            </IonButton>
          </div>
        )}
      </IonCard>
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
