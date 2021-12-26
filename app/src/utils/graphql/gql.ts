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
        users {
            username
            roles
        }
    }
`

export const DELETE_USER = gql`
    mutation DeleteUser($username: String!) {
        deleteUser(username: $username)
    }
`

export const RESET_USER_PASSWORD = gql`
    mutation ResetUserPassword($username: String!) {
        resetPassword(username: $username)
    }
`

export const CHANGE_USER_ROLES = gql`
    mutation ChangeUserRoles($username: String!, $roles: [String!]!) {
        changeUserRoles(username: $username, roles: $roles)
    }
`

export const GRANT_PERMISSION = gql`
    mutation GrantPermission($data: GrantPermissionInput!) {
        grantPermission(data: $data)
    }
`

export const REVOKE_PERMISSION = gql`
    mutation RevokePermission($data: RevokePermissionInput!) {
        revokePermission(data: $data)
    }
`

export const GET_PERMISSION_BY_ROLE = gql`
    query Permissions($role: String!) {
        permissions(role: $role) {
            key
            rangeEnd
            read
            write
        }
    }
`
