import { connect } from 'react-redux'
import './Scoreboard.scss'
import { updateReading } from '../../state/actions/scoreboard.action'
import { deleteRecordDraft } from '../../state/actions/record.action'
import { useEffect } from 'react'
import { useSubscription } from '@apollo/client'
import classNames from 'classnames'
import { SUBSCRIBE_READING } from '../../gql/subscriptions'
import { IonButton, IonInput } from '@ionic/react'

const Scoreboard = (props: any) => {
  const { error, loading, data } = useSubscription(SUBSCRIBE_READING)

  useEffect(() => {
    if (data)
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
    console.log(ev.detail.value)
    props.updateReading({
      receivedAt: new Date().getTime(),
      weight: +ev.detail.value,
    })
  }

  return (
    <div
      className={classNames({
        scoreboard: true,
        error: isNaN(+props.reading?.weight),
      })}
    >
      {/* {!isNaN(+props.reading?.weight) ? (
        <>
          <span className="reading">{props.reading?.weight.toLocaleString()}</span>
          <span className="unit">KG</span>
        </>
      ) : ( */}
      <IonInput
        onIonChange={manualInput}
        className="reading"
        placeholder="0"
        type="number"
      ></IonInput>
      <span className="unit">KG</span>
      {/* // <span className="reading">{props.reading || 'no signal'}</span> */}
      {/* )} */}
    </div>
  )
}

const mapStateToProps = (state: any) => {
  return {
    reading: state.scoreboard.reading,
  }
}

export default connect(mapStateToProps, {
  updateReading,
  deleteRecordDraft,
})(Scoreboard)
