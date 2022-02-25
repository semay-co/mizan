import { gql } from '@apollo/client'

export const CREATE_VEHICLE = gql`
  mutation CreateVehicle(
    $type: Int!
    $plateNumber: String!
    $plateCode: Int!
    $plateRegion: String!
  ) {
    createVehicle(
      type: $type
      plateNumber: $plateNumber
      plateCode: $plateCode
      plateRegion: $plateRegion
    ) {
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
  }
`
export const UPDATE_VEHICLE = gql`
  mutation UpdateVehicle(
    $id: String!
    $type: Int
    $plateNumber: String
    $plateCode: Int
    $plateRegion: String
  ) {
    updateVehicle(
      id: $id
      type: $type
      plateNumber: $plateNumber
      plateCode: $plateCode
      plateRegion: $plateRegion
    ) {
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
  }
`
