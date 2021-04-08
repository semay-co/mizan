import resolvers from './gql/resolvers'
import typeDefs from './gql/typeDefs'
import { ApolloServer, PubSub } from 'apollo-server'
import env from 'dotenv-flow'
import { sms } from './sms/sms'

env.config()

const pubsub = new PubSub()

sms()

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

  server.listen(process.env.SERVER_PORT || 8989, () =>
    console.info(`Mizan server is running`)
  )
}

server()

export default server
