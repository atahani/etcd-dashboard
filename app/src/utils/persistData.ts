const IS_LOGGED_IN = 'is_logged_in'

export const isLoggedIn = (): boolean => localStorage.getItem(IS_LOGGED_IN) === 'true'

export const clearLocalStorage = (): void => {
    localStorage.clear()
}
