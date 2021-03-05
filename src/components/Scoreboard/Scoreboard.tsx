import { connect } from 'react-redux'
import './Scoreboard.scss'
import { updateReading } from '../../state/actions/scoreboard.action'
import { updateUIState } from '../../state/actions/ui.action'
import { deleteRecordDraft } from '../../state/actions/record.action'
import React, { useEffect } from 'react'
import { useSubscription } from '@apollo/client'
import classNames from 'classnames'
import { SUBSCRIBE_READING } from '../../gql/subscriptions'
import { IonFabButton, IonIcon, IonInput } from '@ionic/react'
import { createOutline, speedometerOutline } from 'ionicons/icons'
import $ from 'jquery'

const Scoreboard = (props: any) => {
  const sub = useSubscription(SUBSCRIBE_READING);

  useEffect(() => {
    if (sub.data && !props.ui.manualInput)
      +sub.data.reading?.weight !== +props.reading?.weight &&
        props.updateReading({
          receivedAt: new Date().getTime(),
          weight: +sub.data.reading,
        });
    if (sub.error)
      props.updateReading({
        receivedAt: new Date().getTime(),
        weight: sub.error.message,
      })
    if (sub.loading && !props.ui.manualInput) props.updateReading({
      receivedAt: new Date().getTime(),
      weight: 'connecting...'
    })
  }, [sub.data, sub.error, sub.loading, props])

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
        weight: props.reading?.weight || 0,
      })

    props.updateUIState({
      manualInput: !props.ui.manualInput,
    })

    $('#manual-input').trigger('focus').trigger('select')
  };

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
          {props.ui.manualInput ? 
            <IonInput
              clearInput={true}
              onIonChange={manualInput}
              className="reading"
              placeholder="0"
              type="number"
            ></IonInput>

            : 
          !isNaN(+props.reading?.weight) ? (
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
                  "unit",
                  props.ui.manualInput && "manual-input-unit"
                )}
              >
                KG
              </span>
            </>
          ) : (
            <span className="reading">{props.reading?.weight || 'no signal'}</span>
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
