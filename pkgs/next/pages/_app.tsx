import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  from,
  HttpLink,
  split,
} from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { getMainDefinition } from '@apollo/client/utilities'

import { ThemeProvider } from 'styled-components'
import GlobalStyle from '../style/global.style'
import { dark } from '../style/themes/dark/dark.theme'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'
import ws from 'ws'
import Scoreboard from '../components/Scoreboard/Scoreboard'
import { Provider } from 'react-redux'
import store from '../state/store'

const errorLink = onError(({ graphQLErrors }) => {
  graphQLErrors?.map(console.error)
})

const serverHost = process.env.REACT_APP_SERVER_HOST || 'mizan'
const serverPort = process.env.REACT_APP_SERVER_PORT || 8998

const httpLink = from([
  errorLink,
  new HttpLink({
    uri: `http://${serverHost}:${serverPort}/`,
  }),
])

const wsLink = new GraphQLWsLink(createClient({
  url: `ws://${serverHost}:${serverPort}/graphql`,
  webSocketImpl: ws
}))

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  httpLink
)

const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Record: {
        fields: {
          serial: {
            read(serial = '000') {
              return serial
            },
          },
        },
      },
    },
  }),
  link,
})

const App = ({ Component, pageProps }) => {
  return (
    <Provider store={store}>
      <ApolloProvider client={client}>
        <GlobalStyle />
        <ThemeProvider theme={dark}>
          <Scoreboard/>
        </ThemeProvider>
      </ApolloProvider>
    </Provider>
  )
}

export default App