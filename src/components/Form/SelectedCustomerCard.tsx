import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonIcon,
} from '@ionic/react'
import { connect } from 'react-redux'
import React from 'react'
import {
  updateRecordDraft,
  deleteRecordDraft,
} from '../../state/actions/record.action'
import { closeCircleOutline } from 'ionicons/icons'
import { useQuery } from '@apollo/client'
import { FETCH_CUSTOMER } from '../../gql/queries/customer.queries'
import './SelectedCustomerCard.scss'

const SelectedCustomerCard = (props: any) => {
  const selectedCustomer = useQuery(FETCH_CUSTOMER, {
    variables: {
      id:
        props.party === 'seller' ? props.draft?.sellerId : props.draft.buyerId,
    },
  })

  const customer = selectedCustomer.data?.customer

  return (
    <>
      {customer && (
        <IonCard className='selected-customer-wrap entity-card'>
          <IonCardHeader>
            <div>Selected {props.party}</div>
            <IonButton
              onClick={props.onClear}
              fill='clear'
              shape='round'
              color='danger'
            >
              <IonIcon icon={closeCircleOutline} />
              Clear
            </IonButton>
          </IonCardHeader>
          <IonCardContent className='content-row'>
            <div className='name'>
              {props.party}'s Name: {customer.name?.display}
            </div>
            <div className='phone-number'>
              Phone Number: {customer.phoneNumber.number}
            </div>
          </IonCardContent>
        </IonCard>
      )}
    </>
  )
}

const mapStateToProps = (state: any) => {
  return {
    draft: state.record.recordDraft,
  }
}

export default connect(mapStateToProps, {
  updateRecordDraft,
  deleteRecordDraft,
})(SelectedCustomerCard)
