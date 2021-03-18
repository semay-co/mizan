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
import { STATUS_CODES } from '../../model/scoreboard.model'

const Scoreboard = (props: any) => {
  const sub = useSubscription(SUBSCRIBE_READING)

  useEffect(() => {
    if (sub.data && !props.ui.manualInput)
      +sub.data.reading?.weight !== +props.reading?.weight &&
        props.updateReading({
          receivedAt: new Date().getTime(),
          weight: +sub.data.reading,
          status: STATUS_CODES.ok,
        })
    if (sub.error)
      props.updateReading({
        receivedAt: new Date().getTime(),
        weight: sub.error.message,
        status: STATUS_CODES.error,
      })
    if (sub.loading && !props.ui.manualInput)
      props.updateReading({
        receivedAt: new Date().getTime(),
        weight: 0,
        status: STATUS_CODES.loading,
      })
  }, [sub.data, sub.error, sub.loading, props])

  // isNaN(+props.reading?.weight) &&
  //   props.updateUIState({
  //     manualInput: true,
  //   })

  const manualInput = (ev: any) => {
    props.updateReading({
      receivedAt: new Date().getTime(),
      weight: +ev.detail.value,
      manual: true,
    })
  }

  const toggleManualInput = () => {
    !props.ui.manualInput &&
      props.updateReading({
        receivedAt: new Date().getTime(),
        weight: props.reading?.weight || 0,
        manual: true,
      })

    props.updateUIState({
      manualInput: !props.ui.manualInput,
    })
  }

  const isManualInput =
    props.ui?.manualInput || props.reading?.status === STATUS_CODES.error

  return (
    <>
      <div
        className={classNames({
          scoreboard: true,
          error: props.reading?.status === STATUS_CODES.error,
          warn: props.reading?.status === STATUS_CODES.loading,
        })}
      >
        <div className='scoreboard-wrap'>
          <IonFabButton
            onClick={() => toggleManualInput()}
            color={isManualInput ? 'success' : 'light'}
            // fill="clear"
            // size="large"
            // shape="round"
            className='manual-input-button'
          >
            <IonIcon
              icon={isManualInput ? speedometerOutline : createOutline}
            />
          </IonFabButton>

          <div className='scoreboard-text'>
            {isManualInput ? (
              <>
                <IonInput
                  clearInput={true}
                  onIonChange={manualInput}
                  className='reading'
                  placeholder={props.reading?.weight || 0}
                  type='number'
                ></IonInput>

                <span
                  className={classNames(
                    'unit',
                    isManualInput && 'manual-input-unit'
                  )}
                >
                  KG
                </span>
              </>
            ) : props.reading?.status === STATUS_CODES.ok ? (
              <>
                <span className='reading'>
                  {props.reading?.weight.toLocaleString()}
                </span>
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
              <span className='reading reading-status'>
                {props.reading?.status}
              </span>
            )}
          </div>
        </div>
      </div>
      {props.reading?.status !== STATUS_CODES.ok && (
        <div
          className={classNames({
            'status-bar': true,
            error: props.reading?.status === STATUS_CODES.error,
            warn: props.reading?.status === STATUS_CODES.loading,
          })}
        ></div>
      )}
    </>
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
