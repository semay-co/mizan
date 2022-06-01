import { gql } from 'apollo-server'
import fs from 'fs'
import path from 'path'
import schema from './schema'

const typeDefs = gql(schema)

export default typeDefs
