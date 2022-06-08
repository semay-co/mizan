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
import {
  chevronBack,
  chevronForward,
} from 'ionicons/icons'
import { FETCH_RECORDS } from '../../gql/queries/record.queries'
import * as _ from 'ramda'

const RecordList = (props: any) => {
  
  const recordsQuery = useQuery(FETCH_RECORDS, {
    variables: {
      query: props.recordQuery,
      licensePlate: props.recordQueryLicensePlate,
      filters: _.concat(
        props.ui.recordFilters || [],
        props.draft?.reading ? ['pending'] : []
      ),
      limit: props.ui.limit || 20,
      page: props.ui.page || 0,
      fromTime: props.ui.fromTime,
      toTime: props.ui.toTime
    },
    fetchPolicy: 'network-only',
  })

  const onQueryChange = (ev: any) => {
    props.updateRecordQuery(ev.detail?.value)
    props.updateUIState({
      page: 0,
    })
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

  const setRange = (fromTime: '3days' | 'start', toTime: 'now') => {
    props.updateUIState({
      fromTime,
      toTime
    })
  }

  const nextPage = () => {
    const current = +(props.ui.page || 0)

    props.updateUIState({
      page: current + 1,
    })
  }

  const prevPage = () => {
    const current = +(props.ui.page || 0)

    props.updateUIState({
      page: current > 0 ? current - 1 : 0,
    })
  }

  return (
    <div className='left-col'>
      <IonCard className='search-card'>
        <IonSearchbar
          debounce={1000}
          placeholder='Find Record'
          onIonChange={onQueryChange}
        />

        <IonCardContent>
          <IonButton 
            shape='round'
            color='secondary'
            fill={props.ui.fromTime === '3days' || !props.ui.fromTime ? 'solid' : 'outline'}
            onClick={() => setRange('3days', 'now')}>3 Days</IonButton>
          <IonButton 
            shape='round'
            color='secondary'
            fill={props.ui.fromTime === 'start' ? 'solid' : 'outline'}
            onClick={() => setRange('start', 'now')}>All Records</IonButton>
        </IonCardContent>
      </IonCard>

      <div className='results-list'>
        {recordsQuery.loading && (
          <IonCard className='info-card loading-card'>
            <h3>LOADING...</h3>
          </IonCard>
        )}

        {(!recordsQuery.data ||
          !recordsQuery.data?.records?.payload ||
          recordsQuery.data?.records?.payload?.length === 0) && (
          <IonCard className='info-card'>
            <h3>NO RECORDS</h3>
          </IonCard>
        )}

        <div className='records-wrap'>
          {recordsQuery.data?.records.payload?.map((record: any) => (
            <RecordItem key={record.id} record={record} />
          ))}
        </div>
      </div>
      <div className='pagination'>
        <IonButton onClick={prevPage} disabled={props.ui.page < 1}>
          <IonIcon icon={chevronBack}></IonIcon>
        </IonButton>
        {recordsQuery.data?.records?.count ?
        <>
          Page {+(props.ui.page || 0) + 1} of{' '}
          {Math.ceil(recordsQuery.data?.records?.count / (props.ui.limit || 20))}
          <IonButton
            onClick={nextPage}
            disabled={
              props.ui.page >=
              Math.floor(
                recordsQuery.data?.records?.count / (props.ui.limit || 20)
              )
            }
          >
            <IonIcon icon={chevronForward}></IonIcon>
          </IonButton>
        </> : ''}
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
