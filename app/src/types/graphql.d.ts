export type Maybe<T> = T | null
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
    ID: string
    String: string
    Boolean: boolean
    Int: number
    Float: number
}

export type AddUserInput = {
    password?: Maybe<Scalars['String']>
    roles: Array<Maybe<Scalars['String']>>
    username: Scalars['String']
}

export type AddUserResult = {
    __typename?: 'AddUserResult'
    password: Scalars['String']
}

export type ChangePasswordInput = {
    oldPassword: Scalars['String']
    password: Scalars['String']
}

export type GrantPermissionInput = {
    key: Scalars['String']
    rangeEnd: Scalars['String']
    read: Scalars['Boolean']
    role: Scalars['String']
    write: Scalars['Boolean']
}

export type InitializeResult = {
    __typename?: 'InitializeResult'
    adminPassword: Scalars['String']
    rootPassword: Scalars['String']
}

export type KeyValue = {
    __typename?: 'KeyValue'
    key: Scalars['String']
    value: Scalars['String']
}

export type LoginResult = {
    __typename?: 'LoginResult'
    permissions: Array<RolePermission>
    roles: Array<Scalars['String']>
    username: Scalars['String']
}

export type Mutations = {
    __typename?: 'Mutations'
    addRole: Scalars['Boolean']
    addUser: AddUserResult
    assignRoleToUser: Scalars['Boolean']
    changePassword: Scalars['Boolean']
    deleteRole: Scalars['Boolean']
    deleteUser: Scalars['Boolean']
    grantPermission: Scalars['Boolean']
    initialize: InitializeResult
    login: LoginResult
    logout: Scalars['Boolean']
    put: PutResult
    revokePermission: Scalars['Boolean']
    revokeRoleFromUser: Scalars['Boolean']
}

export type MutationsAddRoleArgs = {
    name: Scalars['String']
}

export type MutationsAddUserArgs = {
    data: AddUserInput
}

export type MutationsAssignRoleToUserArgs = {
    role: Scalars['String']
    username: Scalars['String']
}

export type MutationsChangePasswordArgs = {
    data: ChangePasswordInput
}

export type MutationsDeleteRoleArgs = {
    name: Scalars['String']
}

export type MutationsDeleteUserArgs = {
    username: Scalars['String']
}

export type MutationsGrantPermissionArgs = {
    data: GrantPermissionInput
}

export type MutationsLoginArgs = {
    password: Scalars['String']
    username: Scalars['String']
}

export type MutationsPutArgs = {
    data: PutInput
}

export type MutationsRevokePermissionArgs = {
    data: RevokePermissionInput
}

export type MutationsRevokeRoleFromUserArgs = {
    role: Scalars['String']
    username: Scalars['String']
}

export type PutInput = {
    key: Scalars['String']
    ttl?: Maybe<Scalars['Int']>
    value: Scalars['String']
}

export type PutResult = {
    __typename?: 'PutResult'
    leaseId?: Maybe<Scalars['Int']>
    revision: Scalars['Int']
}

export type Queries = {
    __typename?: 'Queries'
    get: Array<KeyValue>
    permissions: Array<RolePermission>
    roles: Array<Scalars['String']>
    users: Array<Scalars['String']>
}

export type QueriesGetArgs = {
    key: Scalars['String']
}

export type QueriesPermissionsArgs = {
    role?: Maybe<Scalars['String']>
    username?: Maybe<Scalars['String']>
}

export type QueriesRolesArgs = {
    username?: Maybe<Scalars['String']>
}

export type RevokePermissionInput = {
    key: Scalars['String']
    rangeEnd: Scalars['String']
    role: Scalars['String']
}

export enum Role {
    Root = 'ROOT',
}

export type RolePermission = {
    __typename?: 'RolePermission'
    key: Scalars['String']
    rangeEnd: Scalars['String']
    read: Scalars['Boolean']
    write: Scalars['Boolean']
}
