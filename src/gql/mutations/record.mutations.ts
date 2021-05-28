import { gql } from '@apollo/client'

export const CREATE_RECORD = gql`
  mutation CreateRecord(
    $weight: Int!
    $weightTime: String
    $vehicleId: String!
    $sellerId: String
    $buyerId: String
  ) {
    createRecord(
      weight: $weight
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
    $createdAt: String!
  ) {
    addSecondWeight(
      recordId: $recordId
      weight: $weight
      createdAt: $createdAt
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
