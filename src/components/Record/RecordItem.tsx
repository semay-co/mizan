import React from 'react'
import './RecordItem.scss'

import { IonButton, IonCard, IonIcon } from '@ionic/react'
import { checkmark, speedometerOutline } from 'ionicons/icons'
import moment from 'moment'
import LicensePlate from '../LicensePlate/LicensePlate'
import { connect } from 'react-redux'
import {
  updateRecordDraft,
  deleteRecordDraft,
} from '../../state/actions/record.action'
import { useMutation } from '@apollo/client'
import { ADD_SECOND_WEIGHT } from '../../gql/queries'

const RecordItem = (props: any) => {
  const record = props.record
  const secondWeightDraft = props.secondWeightDraft

  const [addSecondWeight] = useMutation(ADD_SECOND_WEIGHT)

  const formatDate = (date: number) =>
    moment(date).format('dddd - MMM DD, YYYY - h:mm a')

  const getNetWeight = () => {
    const firstWeight = record.weights[0].weight
    const secondWeight = record.weights[1]?.weight || secondWeightDraft?.weight

    return secondWeight ? Math.abs(firstWeight - secondWeight) + ' KG' : '...'
  }

  const onSaveSecondWeight = () => {
    addSecondWeight({
      variables: {
        recordId: record.id,
        weight: secondWeightDraft.weight,
        createdAt: secondWeightDraft.receivedAt.toString(),
      },
    })
  }

  return (
    <>
      <IonCard className="record-card">
        <div className="card-left-content">
          <LicensePlate
            code={record.vehicle?.licensePlate?.code}
            region={record.vehicle?.licensePlate?.region}
            number={record.vehicle?.licensePlate?.plate}
          />
        </div>

        <div className="card-right-content">
          <div className="weight-entry first-weight">
            <h3>First Weight</h3>
            <span className="record-date">
              {formatDate(+record.weights[0]?.createdAt)}
            </span>

            <div className="weight-measure">{record.weights[0]?.weight} KG</div>
          </div>
          <div className="weight-entry second-weight">
            {record.weights[1] ? (
              <>
                <span className="record-date">
                  {formatDate(+record.weights[1]?.createdAt)}
                </span>
                <div className="weight-measure">
                  {record.weights[1].weight} KG
                </div>
              </>
            ) : (
              <>
                <h3>Second Weight</h3>
                {secondWeightDraft ? (
                  <>
                    <span className="record-date">
                      {formatDate(+secondWeightDraft.receivedAt)}
                    </span>
                    <div className="weight-measure">
                      {secondWeightDraft.weight} KG
                    </div>
                  </>
                ) : (
                  <>
                    <span className="record-pending">Pending</span>
                    <IonButton className="record-pending-button">
                      <IonIcon icon={speedometerOutline}></IonIcon>
                      {props.draft?.reading ? 'Use Current Record' : 'Record'}
                    </IonButton>
                  </>
                )}
              </>
            )}
          </div>
          <div className="weight-entry net-weight">
            <h3>Net Weight</h3>
            <div className="weight-measure">{getNetWeight()}</div>
          </div>

          {secondWeightDraft && (
            <div className="bottom-button">
              <IonButton onClick={onSaveSecondWeight}>
                <IonIcon icon={checkmark} />
                Use This Record
              </IonButton>
            </div>
          )}
        </div>
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
  updateRecordDraft,
  deleteRecordDraft,
})(RecordItem)
