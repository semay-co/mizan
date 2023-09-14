import { connect } from 'react-redux'
import './display.scss'
import { updateReading } from '../../state/actions/scoreboard.action'
import { updateUIState } from '../../state/actions/ui.action'
import { deleteRecordDraft } from '../../state/actions/record.action'
import { useCallback, useEffect, useRef, useState } from 'react'
import { STATUS_CODES } from '../../model/scoreboard.model'
import io from 'socket.io-client'
import LicensePlate from '../LicensePlate/LicensePlate'
import DotMatrix from 'components/common/dot-matrix'

const endpoint = process.env.REACT_APP_INDICATOR_ENDPOINT || 'http://mizan:6969'

const tolorance = 15 

const Display = (props: any) => {
  const [displayValue, setDisplayValue] = useState('')
  const [displayVehicle, setDisplayVehicle] = useState({} as any)
  const [displayFirstWeight, setDisplayFirstWeight] = useState(0)
  const [now, setNow] = useState(new Date())
  const [hasCaptureChanged, setHasCaptureChanged] = useState(false)

  const displayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    console.log('display useEffect')
    const socket = io(endpoint)

    const interval = setInterval(() => {
      const val = localStorage.getItem('displayValue') || ''
      setDisplayValue(val)

      const vehicle = localStorage.getItem('displayVehicle') || '{}'

      setDisplayVehicle(JSON.parse(vehicle) as any)

      const firstWeight = localStorage.getItem('displayFirstWeight') || '0'
      setDisplayFirstWeight(+firstWeight)

      if (
        (+props.reading?.weight ?? 0) < 500 
        // || Math.abs(+displayValue - +props.reading?.weight) >= 500 
      ) {
        localStorage.setItem('displayValue', '')
        localStorage.setItem('displayFirstWeight', '')
        localStorage.setItem('displayVehicle', '{}')
        localStorage.setItem('displayPayment', '')
      }

      

      setNow(new Date())
    }, 500)


    socket.on('reading', (data) => {
      const now = new Date().getTime()
      const weight = +data || 0

      

      if (props.reading?.weight !== weight) {
        const update = {
          receivedAt: now,
          weight,
          manual: false,
          status: STATUS_CODES.ok,
        }

        props.updateReading(update)
      }
    })

    return () => {
      socket.off('reading')
      clearInterval(interval)
    }
  }, [props.reading?.weight])

  const fullscreen = () => {

    displayRef.current?.requestFullscreen().catch(console.error)
  }

  const displayMainText = () => {
            
          const res = (isNaN(+displayValue) ? 
            props.reading?.weight
            : Math.abs(+displayValue - +props.reading?.weight) >= tolorance ? props.reading?.weight : displayValue || props.reading?.weight || '0').toString()

            return new Array(5 - res.length).fill(' ').join('') + res

  }

  const quintalFormat = (s: string) => {
    const l = s.length
    return [s.substring(0,l-2), s.substring(l-2)]
  }

  const pad = (n: number) => {
    return n < 10 ? `0${n}` : `${n}`
  }

  useEffect(() => {
              setHasCaptureChanged(+(+displayValue && Math.abs(+displayValue - +props.reading?.weight) ||
              (+props.reading?.weight !== 0 && +props.reading?.weight <= tolorance)
            ) >= tolorance)
  }, [displayValue, props.reading?.weight])

  return (
    <div  
      className='display-wrap' 
      ref={displayRef} 
      onClick={fullscreen} >
        {
          !document.fullscreenElement ? <h1>

            Move to Screen <br></br>
            & <br></br>
            Click Here
          </h1> : <>
        
      <div className='time'>
        {pad(now.getHours())}:{pad(now.getMinutes())}:{pad(now.getSeconds())}
      </div>
      <div>
        <div className='display-first-weight'>
          {
            displayFirstWeight ? <><b>◁ </b> {
              quintalFormat(displayFirstWeight.toString()).map((s, i) => <span className={`quintal-${i}`}>{s}</span>)
            }
            <span className='display-unit'>KG</span>
            </>: ''
          }

        </div>
        <div style={{
          display: 'grid',
          gridAutoFlow: 'column',
          justifyContent: 'end',
          alignItems: 'end'
        }} className={`display`}>
          <>{
          quintalFormat(displayMainText()).map((s, i) => <span className={`quintal-${i}`}>
              {
                <span style={{
                  display: 'grid',
                  gridAutoFlow: 'column',
                  justifyContent: 'start',
                  gap: '20px'
                }}>
                <DotMatrix color={ `#33ff99` } size={i ? 150 : 200} text={s} /> 
                </span>
              }
            </span>)
          }<span style={{marginTop: 150}} className='display-unit'>

            <span style={{display: 'grid', gridAutoFlow: 'column', justifyContent: 'start'}}>

            <DotMatrix backgroundFill='green' color={ `#33ff99` } size={150} text='kg' />
            </span>

          </span>

          </>
        </div>
          {
            displayFirstWeight && displayValue ? 
            <div className='display-result'>
              <span className='blink'>▶</span> {quintalFormat(Math.abs(+displayFirstWeight - +displayValue).toString()).map((s, i) => <span className={`quintal-${i}`}>{s}</span>)  }<span className='display-unit'>KG</span>

 
            </div>
          : ''
          }
        </div>

      {displayVehicle?.licensePlate ?
      	<div
          className='display-license-plate'>

        <LicensePlate
          number={displayVehicle.licensePlate.plate}
          region={displayVehicle.licensePlate.region}
          code={displayVehicle.licensePlate.code}
        />
        </div>
        : ''
      }
      <div className='bottom-msg'>
        <div>
          የሚዛኑ ውጤት <b>TEXT</b> እንዲደርሳቹ 
        </div>
        <div>
          ስልክ ቁጥር ይፃፉ።
        </div>
      </div>
   </>
        }
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
})(Display)
