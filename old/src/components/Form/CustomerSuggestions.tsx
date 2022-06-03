import {
  IonCard,
  IonCardHeader,
  IonChip,
  IonItem,
  IonItemGroup,
  IonList,
} from '@ionic/react'
import { connect } from 'react-redux'
import React from 'react'
import {
  updateRecordDraft,
  deleteRecordDraft,
} from '../../state/actions/record.action'
import { useQuery } from '@apollo/client'
import { FETCH_CUSTOMERS } from '../../gql/queries/customer.queries'
import './CustomerSuggestions.scss'

const CustomerSuggestions = (props: any) => {
  const customers = useQuery(FETCH_CUSTOMERS, {
    variables: {
      phoneNumber:
        props.party === 'seller'
          ? props.draft?.seller?.phoneNumber
          : props.draft?.buyer?.phoneNumber,
      name:
        props.party === 'seller'
          ? props.draft?.seller?.name
          : props.draft?.buyer?.name,
      limit: 5,
    },
    fetchPolicy: 'network-only',
  })

  const suggestions = customers.data?.customers

  return (
    <>
      {suggestions?.length > 0 ? (
        <IonCard>
          <IonList lines='full' className='customer-suggestions entity-card'>
            <IonCardHeader className='form-title'>
              Select Existing Customer
            </IonCardHeader>
            <IonItemGroup>
              {suggestions.map((customer: any) => (
                <IonItem
                  key={customer.id}
                  button
                  onClick={() =>
                    props.onSelectCustomer(customer.id, props.party)
                  }
                >
                  <div className='suggestion'>
                    <div className='phone-number'>
                      <IonChip>{customer.phoneNumber?.number}</IonChip>
                    </div>
                    <div className='name'>{customer.name?.display}</div>
                  </div>
                </IonItem>
              ))}
            </IonItemGroup>
          </IonList>
        </IonCard>
      ) : (
        ''
      )}
    </>
  )
}

const mapStateToProps = (state: any) => {
  return {
    reading: state.scoreboard.reading,
    draft: state.record.recordDraft,
  }
}

export default connect(mapStateToProps, {
  updateRecordDraft,
  deleteRecordDraft,
})(CustomerSuggestions)
