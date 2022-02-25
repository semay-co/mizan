import { connect } from 'react-redux'
import './Scoreboard.scss'
import { updateReading } from '../../state/actions/scoreboard.action'
import { updateUIState } from '../../state/actions/ui.action'
import { deleteRecordDraft } from '../../state/actions/record.action'
import React, { useEffect, useRef } from 'react'
import { useSubscription } from '@apollo/client'
import classNames from 'classnames'
import { SUBSCRIBE_READING } from '../../gql/subscriptions'
import { IonFabButton, IonIcon, IonInput } from '@ionic/react'
import { create, speedometer } from 'ionicons/icons'
import $ from 'jquery'
import { STATUS_CODES } from '../../model/scoreboard.model'
import io from 'socket.io-client'

const endpoint =
  process.env.REACT_APP_INDICATOR_ENDPOINT || 'http://192.168.8.100:6969'

const Scoreboard = (props: any) => {
  const sub = useSubscription(SUBSCRIBE_READING)

  const now = useRef(0)
  // props.updateReading({
  //   receivedAt: new Date().getTime(),
  //   weight: 0,
  //   status: STATUS_CODES.ok,
  // })

  useEffect(() => {
    const socket = io(endpoint)

    if (!props.ui.manualInput) {
      socket.on('reading', (data) => {
        const now = new Date().getTime()

        console.log('data', { data, now })
        props.updateReading({
          receivedAt: now,
          weight: +data || 0,
          manual: false,
          status: STATUS_CODES.ok,
        })
      })
    } else if (sub.error) {
      props.updateReading({
        receivedAt: new Date().getTime(),
        weight: 0,
        manual: false,
        status: STATUS_CODES.error,
      })
    } else if (sub.loading && !props.ui.manualInput) {
      props.updateReading({
        receivedAt: new Date().getTime(),
        weight: 0,
        manual: false,
        status: STATUS_CODES.loading,
      })
    } else if (sub.data && !props.ui.manualInput) {
      // +sub.data.reading?.weight !== +props.reading?.weight &&
      //   props.updateReading({
      //     receivedAt: new Date().getTime(),
      //     weight: +sub.data.reading,
      //     status: STATUS_CODES.ok,
      //   })
    }

    setInterval(() => {
      now.current = new Date().getTime()
    }, 1000)

    return () => {
      socket.off('reading')
    }
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

    setTimeout(() => {
      $('#scoreboard-input').focus()
    }, 300)
  }

  const isManualInput = props.ui?.manualInput //|| props.reading?.status !== STATUS_CODES.ok

  return (
    <>
      <div
        className={classNames({
          scoreboard: true,
          error:
            props.reading?.status === STATUS_CODES.error ||
            Math.abs(now.current - props.reading?.receivedAt) > 2000,
          warn: props.reading?.status === STATUS_CODES.loading,
        })}
      >
        <div className='scoreboard-wrap'>
          <IonFabButton
            onClick={() => toggleManualInput()}
            color={isManualInput ? 'secondary' : 'success'}
            // fill="clear"
            // size="large"
            // shape="round"
            className='manual-input-button'
          >
            <IonIcon icon={isManualInput ? create : speedometer} />
          </IonFabButton>

          <div className='scoreboard-text'>
            {isManualInput ? (
              <>
                <IonInput
                  id='scoreboard-input'
                  color='secondary'
                  autofocus={true}
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

      <div
        className={classNames({
          'status-bar': true,
          error: props.reading?.status === STATUS_CODES.error,
          warn: props.reading?.status === STATUS_CODES.loading,
        })}
      ></div>
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
