import { useQuery } from '@apollo/client'
import { connect } from 'react-redux'
import { FETCH_RECORDS } from '../../gql/queries'
import { updateReading } from '../../state/actions/scoreboard.action'
import { updateRecordQuery } from '../../state/actions/record.action'

import './RecordList.scss'
import RecordItem from './RecordItem'
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonIcon,
  IonSearchbar,
} from '@ionic/react'
import React from 'react'
import { hourglassOutline, receiptOutline } from 'ionicons/icons'

const RecordList = (props: any) => {
  const { data } = useQuery(FETCH_RECORDS, {
    variables: {
      query: props.recordQuery,
    },
  })

  const onQueryChange = (ev: any) => {
    props.updateRecordQuery(ev.detail?.value)
  }

  return (
    <div>
      <IonCard className="search-card">
        <IonSearchbar
          debounce={500}
          placeholder="Find Record"
          onIonChange={onQueryChange}
        />
        <IonCardContent>
          <IonButton size="small" fill="outline" color="primary" shape="round">
            <IonIcon icon={receiptOutline} />
            All Records
          </IonButton>

          <IonButton size="small" fill="solid" color="primary" shape="round">
            <IonIcon icon={hourglassOutline} />
            Pending
          </IonButton>
        </IonCardContent>
      </IonCard>
      <div className="records-wrap">
        {data?.records?.map((record: any) => (
          <RecordItem record={record} />
        ))}
      </div>
    </div>
  )
}

const mapStateToProps = (state: any) => {
  return {
    recordQuery: state.record.recordQuery,
  }
}

export default connect(mapStateToProps, {
  updateReading,
  updateRecordQuery,
})(RecordList)
