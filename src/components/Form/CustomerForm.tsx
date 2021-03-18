import {
  IonButton,
  IonCard,
  IonCardHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonText,
} from '@ionic/react'
import { connect } from 'react-redux'
import React, { useEffect } from 'react'
import {
  updateRecordDraft,
  deleteRecordDraft,
} from '../../state/actions/record.action'
import CustomerSuggestions from './CustomerSuggestions'
import { useQuery } from '@apollo/client'
import { FETCH_CUSTOMERS } from '../../gql/queries/customer.queries'
import NewCustomerForm from './NewCustomerForm'
import './CustomerForm.scss'
import { chevronForward } from 'ionicons/icons'

const CustomerForm = (props: any) => {
  const customers = useQuery(FETCH_CUSTOMERS, {
    variables: {
      query: props.draft?.buyer?.phoneNumber,
      limit: 5,
    },
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    return () => customers.data
  }, [customers.data])

  const onPhoneNumberChange = (ev: any) => {
    const number = ev.detail?.value
      .split(/[^0-9]/)
      .join('')
      .trim()

    ev.target.value = number

    const draft =
      props.party === 'seller'
        ? {
            seller: {
              ...props.draft.seller,
              phoneNumber: number,
            },
          }
        : {
            buyer: {
              ...props.draft.buyer,
              phoneNumber: number,
            },
          }

    props.updateRecordDraft({
      ...props.draft,
      ...draft,
    })

    customers.refetch()
  }

  const onSkip = () => {
    const skip =
      props.party === 'seller'
        ? {
            skipSeller: true,
          }
        : {
            skipBuyer: true,
          }

    props.updateRecordDraft({
      ...props.draft,
      ...skip,
    })
  }

  const draft =
    props.party === 'seller' ? props.draft?.seller : props.draft?.buyer

  return (
    <>
      <IonCard className='customer-form entity-card'>
        <IonCardHeader className='form-title'>
          Add {props.party || 'Customer'}
          <IonButton fill='clear' onClick={onSkip} className='justify-right'>
            Skip
            <IonIcon icon={chevronForward} />
          </IonButton>
        </IonCardHeader>
        <IonItem>
          <IonLabel className='uppercase'>
            {props.party || 'Customer'}'s Phone:
          </IonLabel>
          <div className='phone-input'>
            <IonText>09</IonText>
            <IonInput
              onIonChange={onPhoneNumberChange}
              type='tel'
              debounce={500}
              maxlength={8}
              size={8}
              required
              autofocus
              placeholder='12345678'
              // clearInput
            />
          </div>
        </IonItem>

        <div className='card-footer'></div>
      </IonCard>

      {draft?.phoneNumber && (
        <>
          {customers.data?.customers?.length > 0 && (
            <CustomerSuggestions party={props.party} />
          )}
          {customers.data?.customers?.filter((customer: any) => {
            const suggestion = customer.phoneNumber
            const phoneNumber = draft?.phoneNumber

            return suggestion.number === '09' + phoneNumber
          }).length === 0 && <NewCustomerForm party={props.party} />}
        </>
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
})(CustomerForm)
