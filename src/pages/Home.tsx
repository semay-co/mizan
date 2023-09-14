import {
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonList,
  IonPage,
  IonText,
  IonToolbar,
} from '@ionic/react'
import './Home.scss'
import Scoreboard from '../components/Scoreboard/Scoreboard'
import Form from '../components/Form/Form'
import React from 'react'
import RecordList from '../components/Record/RecordList'
import {
  carOutline,
  home,
  peopleOutline,
  settingsOutline,
  statsChartOutline,
} from 'ionicons/icons'
import Sidebar from 'components/common/sidebar'

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <Scoreboard />
        </IonToolbar>
      </IonHeader>
      <IonContent>

        <Sidebar />

       <div className='wrap'>
          <div className='content'>
            <RecordList />
            <Form />
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default Home
