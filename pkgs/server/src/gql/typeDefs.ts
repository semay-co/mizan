import { gql } from 'apollo-server'
import fs from 'fs'
import path from 'path'

const schema = path.join(__dirname, './schema.gql')

const typeDefs = gql(
  fs.readFileSync(schema, {
    encoding: 'utf8',
  })
)

export default typeDefs
