import './style.scss'
import Scoreboard from '../../components/Scoreboard/Scoreboard'
import Form from '../../components/Form/Form'
import RecordList from '../../components/Record/RecordList'

const Home = () => {
  return (
    <div>
      <Scoreboard />

      <div className='wrap'>
        <div className='content'>
          <RecordList />
          <Form />
        </div>
      </div>
    </div>
  )
}

export default Home
