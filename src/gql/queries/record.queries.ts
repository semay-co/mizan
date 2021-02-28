import { gql } from '@apollo/client'

export const FETCH_RECORDS = gql`
  query FetchRecords(
    $query: String
    $limit: Int
    $vehicleId: String
    $recordNumber: Int
    $filters: [String]
  ) {
    records(
      query: $query
      limit: $limit
      vehicleId: $vehicleId
      recordNumber: $recordNumber
      filters: $filters
    ) {
      id
      createdAt
      recordNumber
      weights {
        weight
        createdAt
      }
      vehicle {
        id
        size
        licensePlate {
          code
          region {
            code
          }
          plate
        }
      }
    }
  }
`

export const FETCH_RECORD = gql`
  query FetchRecord($id: String!) {
    record(id: $id) {
      id
      createdAt
      weights {
        weight
        createdAt
      }
      vehicle {
        id
        size
        licensePlate {
          code
          region {
            code
          }
          plate
        }
      }
    }
  }
`
