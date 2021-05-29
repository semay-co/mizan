import {
  IonButton,
  IonCard,
  IonCardContent,
  IonIcon,
  IonInput,
  IonItemDivider,
  IonItemGroup,
  IonLabel,
  IonList,
} from '@ionic/react'
import { connect } from 'react-redux'
import React from 'react'
import {
  updateRecordDraft,
  deleteRecordDraft,
} from '../../state/actions/record.action'
import { addOutline } from 'ionicons/icons'
import { useMutation } from '@apollo/client'
import { CREATE_CUSTOMER } from '../../gql/mutations/customer.mutations'
import './NewCustomerForm.scss'

const NewCustomerForm = (props: any) => {
  const [runCreateCustomer] = useMutation(CREATE_CUSTOMER)

  const createCustomer = () => {
    if (customer && customer.phoneNumber && customer.name) {
      runCreateCustomer({
        variables: {
          name: customer.name,
          phoneNumber: '09' + customer.phoneNumber,
        },
      })
        .then((plate) => {
          const customerId = plate.data.createCustomer.id

          props.onSelectCustomer(customerId, props.party)
        })
        .catch(console.error)
    } else {
      alert('Customer information incomplete')
    }
  }

  const onNameChange = (ev: any) => {
    const name = ev.detail?.value
    console.log('change', name)

    const draft =
      props.party === 'seller'
        ? {
            seller: {
              ...props.draft.seller,
              name,
            },
          }
        : {
            buyer: {
              ...props.draft.buyer,
              name,
            },
          }

    props.updateRecordDraft({
      ...props.draft,
      ...draft,
    })
  }

  const customer =
    props.party === 'seller' ? props.draft?.seller : props.draft?.buyer

  return (
    <IonCard className='entity-card'>
      <IonList lines='full' className='vehicle-suggestions'>
        <IonItemGroup>
          <IonItemDivider>
            <IonLabel>Add New Customer</IonLabel>
          </IonItemDivider>
        </IonItemGroup>
      </IonList>

      <IonCardContent className='customer-form'>
        <div className='name-wrap'>
          <IonLabel>{props.party}'s Name:</IonLabel>
          <IonInput
            onIonChange={onNameChange}
            type='text'
            placeholder='Enter Customer Name'
          />
        </div>
        <div className='phone-number-wrap'>
          <IonLabel>Phone Number: </IonLabel>
          <div className='phone-number'>09{customer?.phoneNumber}</div>
        </div>
      </IonCardContent>

      <IonButton
        expand='full'
        onClick={createCustomer}
        disabled={
          !customer ||
          !customer.name ||
          customer.name.length < 3 ||
          !customer.phoneNumber ||
          customer.phoneNumber.length < 8
        }
      >
        <IonIcon icon={addOutline} />
        Create New Customer
      </IonButton>
    </IonCard>
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
})(NewCustomerForm)
