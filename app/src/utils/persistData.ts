import { LoginResult, RolePermission } from 'types/graphql'

const IS_LOGGED_IN = 'is_logged_in'
const USERNAME = 'username'
const ROLES = 'roles'
const PERMISSIONS = 'permissions'

export const persistUserDataOnLogin = (result: LoginResult): void => {
    localStorage.setItem(IS_LOGGED_IN, 'true')
    localStorage.setItem(USERNAME, result.username)
    localStorage.setItem(ROLES, JSON.stringify(result.roles))
    localStorage.setItem(PERMISSIONS, JSON.stringify(result.permissions))
}

export const isLoggedIn = (): boolean => localStorage.getItem(IS_LOGGED_IN) === 'true'
export const getUsername = (): string | null => localStorage.getItem(USERNAME) || ''
export const getUserRoles = (): string[] => {
    const data = localStorage.getItem(ROLES)
    return data ? JSON.parse(data) : []
}
export const getUserRolePermissions = (): RolePermission[] => {
    const data = localStorage.getItem(PERMISSIONS)
    return JSON.parse(data || 'null') || []
}

export const clearLocalStorage = (): void => {
    localStorage.clear()
}
