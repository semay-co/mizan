import { connect } from 'react-redux'
import './Scoreboard.scss'
import { updateReading } from '../../state/actions/scoreboard.action'
import { updateUIState } from '../../state/actions/ui.action'
import { deleteRecordDraft } from '../../state/actions/record.action'
import React, { useEffect } from 'react'
import { useSubscription } from '@apollo/client'
import classNames from 'classnames'
import { SUBSCRIBE_READING } from '../../gql/subscriptions'
import { IonButton, IonFabButton, IonIcon, IonInput } from '@ionic/react'
import { createOutline, speedometerOutline } from 'ionicons/icons'

const Scoreboard = (props: any) => {
  const { error, loading, data } = useSubscription(SUBSCRIBE_READING)

  useEffect(() => {
    if (data && !props.ui.manualInput)
      props.updateReading({
        receivedAt: new Date().getTime(),
        weight: data.reading,
      })
    // if (error)
    //   props.updateReading({
    //     receivedAt: new Date().getTime(),
    //     error,
    //   })
    if (loading) props.deleteRecordDraft()
  }, [data, error, loading, props])

  const manualInput = (ev: any) => {
    props.updateReading({
      receivedAt: new Date().getTime(),
      weight: +ev.detail.value,
    })
  }

  const toggleManualInput = () => {
    !props.ui.manualInput &&
      props.updateReading({
        receivedAt: new Date().getTime(),
        weight: 0,
      })

    props.updateUIState({
      manualInput: !props.ui.manualInput,
    })
  }

  return (
    <div
      className={classNames({
        scoreboard: true,
        error: isNaN(+props.reading?.weight),
      })}
    >
      <div className="scoreboard-wrap">
        <IonFabButton
          onClick={() => toggleManualInput()}
          color={props.ui.manualInput ? 'success' : 'light'}
          // fill="clear"
          // size="large"
          // shape="round"
          className="manual-input-button"
        >
          <IonIcon
            icon={props.ui.manualInput ? speedometerOutline : createOutline}
          />
        </IonFabButton>
        <div className="scoreboard-text">
          {!isNaN(+props.reading?.weight) ? (
            <>
              {props.ui.manualInput ? (
                <IonInput
                  clearInput={true}
                  onIonChange={manualInput}
                  className="reading"
                  placeholder="0"
                  type="number"
                ></IonInput>
              ) : (
                <span className="reading">
                  {props.reading?.weight.toLocaleString()}
                </span>
              )}
              <span
                className={classNames(
                  'unit',
                  props.ui.manualInput && 'manual-input-unit'
                )}
              >
                KG
              </span>
            </>
          ) : (
            <span className="reading">no signal</span>
          )}
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state: any) => {
  return {
    reading: state.scoreboard.reading,
    ui: state.ui,
  }
}

export default connect(mapStateToProps, {
  updateReading,
  updateUIState,
  deleteRecordDraft,
})(Scoreboard)
