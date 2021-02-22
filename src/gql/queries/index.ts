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

export const CREATE_RECORD = gql`
  mutation CreateRecord($weight: Int!, $vehicleId: String!) {
    createRecord(weight: $weight, vehicleId: $vehicleId)
  }
`

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

export const SUBSCRIBE_READING = gql`
  subscription {
    reading
  }
`
