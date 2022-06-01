import './Home.scss'
import Scoreboard from '../components/Scoreboard/Scoreboard'
import Form from '../components/Form/form/form.cmp'
import React from 'react'
import RecordList from '../components/Record/RecordList'

const Home: React.FC = () => {
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
