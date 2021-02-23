import { gql } from '@apollo/client'

export const CREATE_VEHICLE = gql`
  mutation CreateVehicle(
    $size: Int!
    $plateNumber: String!
    $plateCode: Int!
    $plateRegion: String!
  ) {
    createVehicle(
      size: $size
      plateNumber: $plateNumber
      plateCode: $plateCode
      plateRegion: $plateRegion
    )
  }
`
