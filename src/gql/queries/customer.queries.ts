import { gql } from '@apollo/client'

export const FETCH_CUSTOMERS = gql`
  query FetchCustomers($phoneNumber: String, $name: String, $limit: Int) {
    customers(phoneNumber: $phoneNumber, name: $name, limit: $limit) {
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

export const FETCH_CUSTOMER = gql`
  query FetchCustomer($id: String) {
    customer(id: $id) {
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
