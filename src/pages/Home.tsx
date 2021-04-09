import {
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonList,
  IonPage,
  IonSplitPane,
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

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <Scoreboard />
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className='sidebar'>
          <IonList>
            <IonItem button={true} color='primary'>
              <IonIcon icon={home} />
              <IonText>Home</IonText>
            </IonItem>

            <IonItem button={true} onClick={() => {}}>
              <IonIcon icon={carOutline} />
              <IonText>Vehicles</IonText>
            </IonItem>

            <IonItem button={true}>
              <IonIcon icon={peopleOutline} />
              <IonText>Customers</IonText>
            </IonItem>

            <IonItem button={true}>
              <IonIcon icon={statsChartOutline} />
              <IonText>Reporting</IonText>
            </IonItem>
          </IonList>

          <IonList>
            <IonItem button={true}>
              <IonIcon icon={settingsOutline} />
              <IonText>Settings</IonText>
            </IonItem>
          </IonList>
        </div>
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
