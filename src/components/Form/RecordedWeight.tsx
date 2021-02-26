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

const RecordedWeight = (props: any) => {
  const onClear = () => {
    props.deleteRecordDraft()
  }

  return (
    <IonCard className="current-weight-card entity-card">
      <IonCardHeader>
        <div>Recorded Weight</div>

        <IonButton onClick={onClear} shape="round" fill="clear" color="danger">
          <IonIcon slot="start" icon={closeCircleOutline}></IonIcon>
          Clear
        </IonButton>
      </IonCardHeader>
      <IonCardContent>
        <div className="current-weight-measure">
          {props.draft?.reading?.weight.toLocaleString()} KG
          <IonButton onClick={props.onRecord} shape="round" fill="clear">
            <IonIcon slot="start" icon={refreshOutline}></IonIcon>
            Update
          </IonButton>
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
