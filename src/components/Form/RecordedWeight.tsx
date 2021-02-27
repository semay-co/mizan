import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonIcon,
} from '@ionic/react'
import { connect } from 'react-redux'
import { closeCircleOutline, refreshOutline } from 'ionicons/icons'
import React from 'react'
import {
  updateRecordDraft,
  deleteRecordDraft,
} from '../../state/actions/record.action'
import classNames from 'classnames'
import './RecordedWeight.scss'

const RecordedWeight = (props: any) => {
  const onClear = () => {
    props.deleteRecordDraft()
  }

  return (
    <IonCard
      className={classNames(
        'current-weight-card',
        'entity-card',
        props.reading.weight !== props.draft?.reading?.weight ||
          props.draft?.reading?.weight < 100
          ? 'red-card'
          : 'green-card'
      )}
    >
      <IonCardHeader>
        <div>Recorded Weight</div>

        <IonButton
          onClick={onClear}
          shape="round"
          fill="outline"
          color="danger"
        >
          <IonIcon slot="start" icon={closeCircleOutline}></IonIcon>
          Clear
        </IonButton>
      </IonCardHeader>
      <IonCardContent>
        <div className="current-weight-measure">
          {props.draft?.reading?.weight.toLocaleString()} KG
          {(props.draft?.reading?.weight !== props.reading?.weight ||
            props.draft?.reading?.weight < 100) && (
            <IonButton
              onClick={props.onRecord}
              shape="round"
              fill="solid"
              color="success"
            >
              <IonIcon slot="start" icon={refreshOutline}></IonIcon>
              Update
            </IonButton>
          )}
        </div>
      </IonCardContent>
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
})(RecordedWeight)
