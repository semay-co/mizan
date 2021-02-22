import { gql } from '@apollo/client'

export const FETCH_VEHICLES = gql`
  query FetchVehicles($query: String, $limit: Int) {
    vehicles(query: $query, limit: $limit) {
      id
      licensePlate {
        plate
        code
        region {
          code
        }
      }
    }
  }
`

export const FETCH_VEHICLE = gql`
  query FetchVehicle($id: String) {
    vehicle(id: $id) {
      id
      size
      licensePlate {
        plate
        code
        region {
          code
        }
      }
    }
  }
`
