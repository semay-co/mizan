import { gql } from '@apollo/client'

export const SUBSCRIBE_READING = gql`
  subscription {
    reading
  }
`
