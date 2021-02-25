import { gql } from '@apollo/client'

export const CREATE_RECORD = gql`
  mutation CreateRecord($weight: Int!, $vehicleId: String!) {
    createRecord(weight: $weight, vehicleId: $vehicleId)
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
