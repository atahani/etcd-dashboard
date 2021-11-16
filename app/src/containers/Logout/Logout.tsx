import { useMutation } from '@apollo/client'
import { useNavigate } from 'react-router'
import { useToast } from '@chakra-ui/toast'
import React, { useEffect } from 'react'

import { clearLocalStorage } from 'utils/persistData'
import { handleCommonErr } from 'utils/graphql/handleError'
import { LOGOUT } from 'utils/graphql/gql'

export const Logout: React.FC = () => {
    const navigate = useNavigate()
    const toast = useToast()
    const [logout] = useMutation(LOGOUT, {
        onCompleted: () => {
            clearLocalStorage()
            navigate('/')
        },
        onError: (error) => handleCommonErr({ error, toast }),
    })
    useEffect(() => {
        logout()
        return () => {
            clearLocalStorage()
        }
    }, [logout])
    return null
}
