import { gql } from '@apollo/client'

export const LOAD_USERS = gql`
  query {
    users {
      id
      name {
        first
        last
        display
      }
    }
  }
`

export const CREATE_RECORD = gql`
  mutation CreateRecord(
    $weight: Int!
    $createdAt: String!
    $plateNumber: String!
    $plateCode: Int!
    $plateRegion: String!
  ) {
    createRecord(
      weight: $weight
      createdAt: $createdAt
      plateNumber: $plateNumber
      plateCode: $plateCode
      plateRegion: $plateRegion
    )
  }
`

export const FETCH_RECORDS = gql`
  query FetchRecords {
    records {
      id
      createdAt
    }
  }
`

export const SUBSCRIBE_READING = gql`
  subscription {
    reading
  }
`
