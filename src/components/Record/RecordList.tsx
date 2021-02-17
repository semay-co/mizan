import { useQuery } from '@apollo/client'
import {
  IonChip,
  IonList,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonItem,
  IonGrid,
  IonCol,
  IonRow,
  IonTitle,
} from '@ionic/react'
import { connect } from 'react-redux'
import { FETCH_RECORDS } from '../../gql/Queries'
import { updateReading } from '../../state/actions/scoreboard.action'

import './RecordList.scss'

const RecordList = (props: any) => {
  const { loading, error, data } = useQuery(FETCH_RECORDS)

  return (
    <>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>RECORDS</IonCardTitle>
        </IonCardHeader>
        <IonList>
          <IonItem>
            <IonGrid>
              <IonRow className="header-row">
                <IonCol>
                  <IonTitle>License Plate</IonTitle>
                </IonCol>

                <IonCol>
                  <IonTitle>First Weight</IonTitle>
                </IonCol>

                <IonCol>
                  <IonTitle>Second Weight</IonTitle>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonItem>
          <IonItem>
            <IonGrid>{JSON.stringify(data)}</IonGrid>
          </IonItem>
        </IonList>
      </IonCard>
    </>
  )
}

const mapStateToProps = (state: any) => {
  return {}
}

export default connect(mapStateToProps, {
  updateReading,
  // updateRecordDraft,
  // deleteRecordDraft,
})(RecordList)
