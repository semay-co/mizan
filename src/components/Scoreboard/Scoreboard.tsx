import { connect } from 'react-redux'
import './Scoreboard.scss'
import { updateReading } from '../../state/actions/scoreboard.action'
import { updateUIState } from '../../state/actions/ui.action'
import { deleteRecordDraft } from '../../state/actions/record.action'
import { useEffect } from 'react'
import classNames from 'classnames'
import { IonFabButton, IonIcon, IonInput } from '@ionic/react'
import { create, speedometer } from 'ionicons/icons'
import $ from 'jquery'
import { STATUS_CODES } from '../../model/scoreboard.model'
import io from 'socket.io-client'

const endpoint = process.env.REACT_APP_INDICATOR_ENDPOINT || 'http://mizan:6969'

const Scoreboard = (props: any) => {
  // const now = useRef(0)

  // useCallback(() => {
  //   const interval = setInterval(() => {
  //     now.current = new Date().getTime()
  //   }, 1000)

  //   return () => {
  //     clearInterval(interval)
  //   }
  // }, [])

  useEffect(() => {
    console.log('scoreboard useEffect')
    const socket = io(endpoint)

    const beep = new Audio('/assets/audio/beep-1.wav')

    const weight = props.reading?.weight 

    const interval = setInterval(() => {
      const c = weight < 50 ? '🟥' : '🟨'
      const odd = ''
      const even = new Array(10).fill(c).join('')
      const now = new Date()

      const color = 
        (weight !== 0 && weight < 100) ? 
          now.getSeconds() % 2 === 0
          ? odd : even
          : ''

      document.title = `${color}${weight} KG`
    }, 1000)



    if (!props.ui.manualInput) {
      socket.on('reading', (data) => {
        const now = new Date()
        const weight = +data || 0

        const update = {
          receivedAt: now.getTime(),
          weight,
          manual: false,
          status: STATUS_CODES.ok,
        }

        if (props.reading?.weight !== weight) {
          props.updateReading(update)
        }
      })
    }

    return () => {
      socket.off('reading')
      clearInterval(interval)
    }
  }, [props.ui.manualInput, props.reading?.weight])

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
            (props.reading?.weight !== 0 &&
              (props.reading?.weight < 0 || props.reading?.weight <= 40)),
          // ||Math.abs(now.current - props.reading?.receivedAt) > 2000,
          warn:
            props.reading?.status === STATUS_CODES.loading ||
            (props.reading?.weight > 40 && props.reading?.weight < 100),
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
                <span className='reading'>{props.reading?.weight}</span>
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
