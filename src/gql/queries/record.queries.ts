import { gql } from '@apollo/client'

export const FETCH_RECORDS = gql`
  query FetchRecords(
    $query: String
    $limit: Int
    $vehicleId: String
    $serial: String
    $filters: [String]
  ) {
    records(
      query: $query
      limit: $limit
      vehicleId: $vehicleId
      serial: $serial
      filters: $filters
    ) {
      id
      createdAt
      serial
      weights {
        weight
        createdAt
      }
      vehicle {
        id
        type
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
        type
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
