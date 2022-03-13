import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  from,
  HttpLink,
  split,
} from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { WebSocketLink } from '@apollo/client/link/ws'
import { getMainDefinition } from '@apollo/client/utilities'
import { ThemeProvider } from 'styled-components'
import GlobalStyle from './style/global.style'
import { dark } from './style/themes/dark/dark.theme'
import { Dashboard } from './components/dashboard/dashboard.cmp'

const errorLink = onError(({ graphQLErrors }) => {
  graphQLErrors?.map(console.error)
})

const serverHost = process.env.REACT_APP_SERVER_HOST || '192.168.8.101'
const serverPort = process.env.REACT_APP_SERVER_PORT || 8998

const httpLink = from([
  errorLink,
  new HttpLink({
    uri: `http://${serverHost}:${serverPort}/`,
  }),
])

const wsLink = new WebSocketLink({
  uri: `ws://${serverHost}:${serverPort}/graphql`,
  options: {
    reconnect: true,
  },
})

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

const App = () => (
  <ApolloProvider client={client}>
    <ThemeProvider theme={dark}>
      <GlobalStyle />
      <Dashboard />
    </ThemeProvider>
  </ApolloProvider>
)

export default App
