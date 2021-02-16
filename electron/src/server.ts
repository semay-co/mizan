import resolvers from './gql/resolvers'
import typeDefs from './gql/typeDefs'
import { ApolloServer, PubSub } from 'apollo-server'

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

  server.listen(8989, () => console.info(`Mizan is running`))
}

server()

export default server
