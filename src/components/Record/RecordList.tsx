import { useQuery } from '@apollo/client'
import { connect } from 'react-redux'
import { updateReading } from '../../state/actions/scoreboard.action'
import {
  updateRecordQuery,
  updateRecordList,
} from '../../state/actions/record.action'
import { updateUIState } from '../../state/actions/ui.action'
import './RecordList.scss'
import RecordItem from './RecordItem'
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonIcon,
  IonSearchbar,
} from '@ionic/react'
import { hourglassOutline } from 'ionicons/icons'
import { FETCH_RECORDS } from '../../gql/queries/record.queries'
import * as _ from 'ramda'

const RecordList = (props: any) => {
  // TODO: use ramda or redux
  const recordsQuery = useQuery(FETCH_RECORDS, {
    variables: {
      query: props.recordQuery,
      licensePlate: props.recordQueryLicensePlate,
      filters: _.concat(
        props.ui.recordFilters || [],
        props.draft?.reading ? ['pending'] : []
      ),
      limit: 10,
    },
    fetchPolicy: 'network-only',
  })

  const onQueryChange = (ev: any) => {
    props.updateRecordQuery(ev.detail?.value)
    // recordsQuery.refetch({
    //   query: props.recordQuery,
    //   filters: props.ui.recordFilters,
    // })
  }

  const toggleFilter = (filter: string) => {
    const recordFilters = props.ui.recordFilters?.includes(filter)
      ? _.difference([filter])(props.ui.recordFilters)
      : _.append(filter)(props.ui.recordFilters)

    props.updateUIState({
      recordFilters,
    })

    // recordsQuery.refetch()
  }

  return (
    <div>
      <IonCard className='search-card'>
        <IonSearchbar
          debounce={1000}
          placeholder='Find Record'
          onIonChange={onQueryChange}
        />
        <IonCardContent>
          <IonButton
            onClick={() => toggleFilter('pending')}
            size='small'
            color='primary'
            shape='round'
            fill={
              props.ui.recordFilters?.includes('pending') ? 'solid' : 'outline'
            }
          >
            <IonIcon icon={hourglassOutline} />
            Pending
          </IonButton>
        </IonCardContent>
      </IonCard>

      {recordsQuery.loading && (
        <IonCard className='info-card'>
          <h3>LOADING...</h3>
        </IonCard>
      )}

      {recordsQuery.data?.length === 0 && (
        <IonCard className='info-card'>
          <h3>NO RECORDS FOUND</h3>
        </IonCard>
      )}

      <div className='records-wrap'>
        {recordsQuery.data?.records?.map((record: any) => (
          <RecordItem key={record.id} record={record} />
        ))}
      </div>
    </div>
  )
}

const mapStateToProps = (state: any) => {
  return {
    recordQuery: state.record.recordQuery,
    ui: state.ui,
    draft: state.record.recordDraft,
  }
}

export default connect(mapStateToProps, {
  updateReading,
  updateRecordQuery,
  updateRecordList,
  updateUIState,
})(RecordList)
