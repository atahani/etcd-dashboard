import gql from 'graphql-tag'

export const LOGIN = gql`
    mutation ($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            username
            roles
            permissions {
                key
                rangeEnd
                read
                write
            }
        }
    }
`

export const LOGOUT = gql`
    mutation Logout {
        logout
    }
`
