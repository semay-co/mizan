import { IonContent, IonHeader, IonPage, IonToolbar } from '@ionic/react'
import './Home.scss'
import Scoreboard from '../components/Scoreboard/Scoreboard'
import Form from '../components/Form/Form'
import React from 'react'
import RecordList from '../components/Record/RecordList'

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <Scoreboard />
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="wrap">
          <div className="content">
            <RecordList />
            <Form />
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default Home
