import { ChakraProvider, Grid, theme, Box } from '@chakra-ui/react'
import { Routes, Route } from 'react-router-dom'
import * as React from 'react'

import Dashboard from 'containers/Dashboard'
import Login from 'containers/Login'
import PrivateRoute from 'components/PrivateRoute'

export const App: React.FC = () => (
    <ChakraProvider theme={theme}>
        <Box>
            <Grid minH="100vh">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route
                        path="/"
                        element={
                            <PrivateRoute>
                                <Dashboard />
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </Grid>
        </Box>
    </ChakraProvider>
)
