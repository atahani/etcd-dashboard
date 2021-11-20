import { ApolloError } from '@apollo/client'
import { IToast } from '@chakra-ui/toast'

import { clearLocalStorage } from 'utils/persistData'

import messages from './messages'

type HandleCommonErr = {
    error: ApolloError
    toast: (options?: IToast) => void
    handleMore?: () => void
}

export const handleCommonErr = ({ error, toast, handleMore }: HandleCommonErr): void => {
    if (error.graphQLErrors) {
        if (
            error.graphQLErrors.some((err) => err.extensions?.code === 'NOT_FOUND_RESOURCE') ||
            error.graphQLErrors.some((err) => err.extensions?.exception.response.statusCode === 404)
        ) {
            // it's better to redirect to /404 notfound page with appropriate image
            window.location.href = '/'
        }
        // handle forbidden error mean's user can't be able to do this action, so should login
        if (error.graphQLErrors.some((err) => err.extensions?.exception.response.statusCode === 403)) {
            // clear the loadStorage and redirect to home
            clearLocalStorage()
            window.location.href = '/'
        }
        if (error.graphQLErrors.some((err) => err.extensions?.exception.response.statusCode === 500)) {
            toast({ description: messages.internalServer, status: 'error', isClosable: true })
        }
    }
    if (error?.message === 'access denied') {
        // the token has been expired, needs to re authenticate
        clearLocalStorage()
        window.location.href = '/login'
        return
    }
    if (error.networkError && error.networkError?.message === 'Failed to fetch') {
        // check is user online
        const isOnline = typeof navigator.onLine === 'boolean' ? navigator.onLine : true
        if (!isOnline) {
            toast({ description: messages.noInternetConnection, status: 'warning', isClosable: true })
            return
        }
        toast({ description: messages.connectionRefused, status: 'error', isClosable: true })
        return
    }
    if (handleMore) {
        return handleMore()
    }
    if (error.message) {
        toast({ description: error.message, status: 'error', isClosable: true })
        return
    }
    toast({ description: messages.unhandledErrorHappened, status: 'error', isClosable: true })
}
