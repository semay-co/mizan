import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonIcon,
} from '@ionic/react'
import { connect } from 'react-redux'
import { closeCircleOutline, refreshOutline } from 'ionicons/icons'
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

  const isUpdated = () => props.reading?.weight === props.draft?.reading?.weight

  const isOutdated = () =>
    props.reading?.receivedAt - 1000 < props.draft?.reading?.receivedAt

  const isLoaded = () => props.draft?.reading?.weight >= 1000

  return (
    <IonCard
      className={classNames(
        'current-weight-card',
        'entity-card',
        isLoaded() && isUpdated() ? 'green-card' : 'red-card',
      )}
    >
      <IonCardHeader>
        <div>Recorded Weight</div>

        <IonButton
          onClick={onClear}
          shape='round'
          fill='clear'
          color={isLoaded() && isUpdated() ? 'light' : 'dark'}
        >
          <IonIcon slot='start' icon={closeCircleOutline}></IonIcon>
          Clear
        </IonButton>
      </IonCardHeader>
      <IonCardContent>
        <div className='current-weight-measure'>
          {props.draft?.reading?.weight.toLocaleString()} KG
          {(!isUpdated()) && (
            <IonButton
              onClick={props.onRecord}
              shape='round'
              fill='solid'
              color='dark'
            >
              <IonIcon slot='start' icon={refreshOutline}></IonIcon>
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
