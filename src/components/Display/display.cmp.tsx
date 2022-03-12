import { connect } from 'react-redux'
import './display.scss'
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

const endpoint =
  process.env.REACT_APP_INDICATOR_ENDPOINT || 'http://192.168.8.101:6969'

const Display = (props: any) => {
  useEffect(() => {
    const socket = io(endpoint)

    if (!props.ui.manualInput) {
      socket.on('reading', (data) => {
        const now = new Date().getTime()
        const weight = +data || 0

        const update = {
          receivedAt: now,
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
    }
  }, [props])

  return (
    <>
      <div
        className={classNames({
          scoreboard: true,
        })}
      >
        <div className='wrap'>
					<div className='text'>
              <>
                <span className='reading'>
                  {props.reading?.weight?.split('0').join('O')}
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
          </div>
        </div>
      </div>
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
})(Display)
