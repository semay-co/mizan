import { gql } from '@apollo/client'

export const FETCH_RECORDS = gql`
  query FetchRecords($query: String, $limit: Int, $vehicleId: String) {
    records(query: $query, limit: $limit, vehicleId: $vehicleId) {
      id
      createdAt
      weights {
        weight
        createdAt
      }
      vehicle {
        id
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
