import { gql } from '@apollo/client'

export const CREATE_CUSTOMER = gql`
  mutation CreateCustomer($phoneNumber: String!, $name: String!) {
    createCustomer(phoneNumber: $phoneNumber, name: $name) {
      id
      createdAt
      name {
        display
      }
      phoneNumber {
        number
      }
    }
  }
`
