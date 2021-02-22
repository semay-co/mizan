import { connect } from 'react-redux'
import './Scoreboard.scss'
import { updateReading } from '../../state/actions/scoreboard.action'
import { deleteRecordDraft } from '../../state/actions/record.action'
import { SUBSCRIBE_READING } from '../../gql/queries'
import { useEffect } from 'react'
import { useSubscription } from '@apollo/client'
import classNames from 'classnames'

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

  return (
    <div
      className={classNames({
        scoreboard: true,
        error: isNaN(+props.reading?.weight),
      })}
    >
      {!isNaN(+props.reading?.weight) ? (
        <>
          <span className="reading">{props.reading?.weight}</span>
          <span className="unit">KG</span>
        </>
      ) : (
        <span className="reading">{props.reading || 'no signal'}</span>
      )}
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
