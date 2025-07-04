import { gql } from '@apollo/client'

export const CREATE_RECORD = gql`
  mutation CreateRecord(
    $weight: Int!
    $manual: Boolean!
    $weightTime: String
    $vehicleId: String!
    $sellerId: String
    $buyerId: String
  ) {
    createRecord(
      weight: $weight
      manual: $manual
      weightTime: $weightTime
      vehicleId: $vehicleId
      sellerId: $sellerId
      buyerId: $buyerId
    ) {
      id
      serial
      createdAt
      updatedAt
      vehicle {
        id
        type
        licensePlate {
          code
          plate
          region {
            code
          }
        }
      }
      buyer {
        id
        name {
          display
        }
        phoneNumber {
          number
        }
      }
      seller {
        id
        name {
          display
        }
        phoneNumber {
          number
        }
      }
    }
  }
`
export const ADD_SECOND_WEIGHT = gql`
  mutation AddSecondWeight(
    $recordId: String!
    $weight: Int!
    $manual: Boolean!
    $createdAt: String!
  ) {
    addSecondWeight(
      recordId: $recordId
      weight: $weight
      manual: $manual
      createdAt: $createdAt
    ) {
      id
    }
  }
`

export const ADD_CUSTOMER = gql`
  mutation AddCustomer(
    $recordId: String!
    $customerId: String!
    $customerType: String!
  ) {
    addCustomer(
      recordId: $recordId
      customerId: $customerId
      customerType: $customerType
    ) {
      id
    }
  }
`

export const PRINT_RECORD = gql`
  mutation PrintRecord($id: String!) {
    printRecord(id: $id)
  }
`

export const SEND_CONFIRMATION_SMS = gql`
  mutation SendConfirmationSms($recordId: String!) {
    sendConfirmationSms(recordId: $recordId)
  }
`
