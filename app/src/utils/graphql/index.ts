import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/react-hooks'

import { httpServerGraphqlUri } from '../env'

const cache = new InMemoryCache({})

const httpLink = new HttpLink({ uri: httpServerGraphqlUri, credentials: 'include' })

export const apolloClient = new ApolloClient({
    link: httpLink,
    cache,
})
