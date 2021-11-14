export const httpServerGraphqlUri = process.env['REACT_APP_SERVER_GRAPHQL_URI_HTTP']

if (!httpServerGraphqlUri || httpServerGraphqlUri === '') {
    throw Error('Please set REACT_APP_SERVER_GRAPHQL_URI_HTTP environment variable')
}
