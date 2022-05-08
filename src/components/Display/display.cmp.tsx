import { connect } from 'react-redux'
import './display.scss'
import { updateReading } from '../../state/actions/scoreboard.action'
import { updateUIState } from '../../state/actions/ui.action'
import { deleteRecordDraft } from '../../state/actions/record.action'
import { useEffect, useRef, useState } from 'react'
import { STATUS_CODES } from '../../model/scoreboard.model'
import io from 'socket.io-client'
import LicensePlate from '../LicensePlate/LicensePlate'

const endpoint = process.env.REACT_APP_INDICATOR_ENDPOINT || 'http://mizan:6969'

const Display = (props: any) => {
  const [displayValue, setDisplayValue] = useState('')
  const [displayVehicle, setDisplayVehicle] = useState({} as any)
  const [displayFirstWeight, setDisplayFirstWeight] = useState(0)
  const [now, setNow] = useState(new Date())

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

    return () => {
      socket.off('reading')
      clearInterval(interval)
    }
  }, [props.reading?.weight])

  const fullscreen = () => {

    displayRef.current?.requestFullscreen().catch(console.error)
  }

  const pad = (n: number) => {
    return n < 10 ? `0${n}` : `${n}`
  }

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
            displayFirstWeight ? <><b>◁ </b> { displayFirstWeight } KG</>: ''
          }
        </div>
        <div className='display'>{
        
          (isNaN(+displayValue) ? 
            props.reading?.weight
            : Math.abs(+displayValue - +props.reading?.weight) >= 50 ? props.reading?.weight : displayValue || props.reading?.weight || '0').toString().split('0').join('O')
          } KG
        </div>
          {
            displayFirstWeight && displayValue ? 
            <div className='display-result'>
              ▶ {Math.abs(+displayFirstWeight - +displayValue) + ' KG' } 
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
