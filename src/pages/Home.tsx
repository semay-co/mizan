import { IonContent, IonHeader, IonPage, IonToolbar } from '@ionic/react'
import './Home.scss'
import Scoreboard from '../components/Scoreboard/Scoreboard'
import Form from '../components/Form/Form'

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <Scoreboard />
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <Form />
      </IonContent>
    </IonPage>
  )
}

export default Home
