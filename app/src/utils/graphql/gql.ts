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

export const CHANGE_PASSWORD = gql`
    mutation ChangePassword($data: ChangePasswordInput!) {
        changePassword(data: $data)
    }
`

export const ADD_ROLE = gql`
    mutation AddRole($name: String!) {
        addRole(name: $name)
    }
`

export const GET_ROLES = gql`
    query Roles {
        roles
    }
`

export const DELETE_ROLE = gql`
    mutation DeleteRole($name: String!) {
        deleteRole(name: $name)
    }
`

export const ADD_USER = gql`
    mutation AddUser($data: AddUserInput!) {
        addUser(data: $data) {
            password
        }
    }
`

export const GET_USERS = gql`
    query Users {
        users
    }
`

export const DELETE_USER = gql`
    mutation DeleteUser($username: String!) {
        deleteUser(username: $username)
    }
`
