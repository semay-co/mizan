import { gql } from '@apollo/client'

export const FETCH_CUSTOMERS = gql`
  query FetchCustomers($query: String, $limit: Int) {
    customers(query: $query, limit: $limit) {
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
