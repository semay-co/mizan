import {
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonList,
  IonPage,
  IonSplitPane,
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
        <IonSplitPane contentId='main'>
          <div className='sidebar'>
            <IonList>
              <IonItem button={true} color='primary'>
                <IonIcon icon={home} />
              </IonItem>

              <IonItem button={true}>
                <IonIcon icon={statsChartOutline} />
              </IonItem>

              <IonItem button={true}>
                <IonIcon icon={carOutline} />
              </IonItem>

              <IonItem button={true}>
                <IonIcon icon={peopleOutline} />
              </IonItem>
            </IonList>

            <IonList>
              <IonItem button={true}>
                <IonIcon icon={settingsOutline} />
              </IonItem>
            </IonList>
          </div>
        </IonSplitPane>
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
