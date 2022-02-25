import resolvers from './gql/resolvers'
import typeDefs from './gql/typeDefs'
import { ApolloServer, PubSub } from 'apollo-server'
import env from 'dotenv-flow'

env.config()

const pubsub = new PubSub()

const server = () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => ({
      req,
      res,
      pubsub,
    }),
  })

  const port = process.env.SERVER_PORT || 8998
  server.listen(port, () =>
    console.info(`Mizan server is running on port ${port}`)
  )
}

server()

export default server
