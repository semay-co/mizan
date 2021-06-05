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
        manual
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

export const FETCH_RECORD = gql`
  query FetchRecord($id: String!) {
    record(id: $id) {
      id
      createdAt
      serial
      weights {
        weight
        manual
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
