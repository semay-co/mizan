import { IonIcon, IonItem, IonList, IonText, useIonRouter } from '@ionic/react'
import { home, carOutline, peopleOutline, statsChartOutline, settingsOutline } from 'ionicons/icons'

        const Sidebar = () => {

          const router = useIonRouter()


        return <div className='sidebar'>
          <IonList>
            <IonItem button={true} color='primary'>
              <IonIcon icon={home} />
              <IonText>Home</IonText>
            </IonItem>

            <IonItem button={true} onClick={() => {
              router.push('/vehicles')
            }}>
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
        }

        export default Sidebar