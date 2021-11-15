import React from 'react'
import { Navigate, useLocation } from 'react-router'

import { isLoggedIn } from 'utils/persistData'

type Props = {
    children: React.ReactElement
}

export const PrivateRoute: React.FC<Props> = ({ children }) => {
    const loggedIn = isLoggedIn()
    const location = useLocation()
    if (!loggedIn) {
        return <Navigate to="/login" state={{ from: location }} />
    }
    return children
}
