import { IonCard, IonCardHeader, IonCardTitle } from '@ionic/react'
import { Table } from 'react-bootstrap'

const RecordList = (props: any) => {
  return (
    <>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>RECORDS</IonCardTitle>
        </IonCardHeader>

        <Table variant="dark">
          <thead>
            <tr>
              <th>abc</th>
              <th>def</th>
              <th>ghi</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>hey</td>
              <td>hey</td>
              <td>hey</td>
            </tr>
          </tbody>
        </Table>
      </IonCard>
    </>
  )
}
export default RecordList
