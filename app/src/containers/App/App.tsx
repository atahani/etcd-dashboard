import { ChakraProvider, Grid, theme, Box } from '@chakra-ui/react'
import { Routes, Route } from 'react-router-dom'
import * as React from 'react'

import ColorModeSwitcher from '../../components/ColorModeSwitcher'
import Home from '../Home'
import Login from '../Login'

export const App: React.FC = () => (
    <ChakraProvider theme={theme}>
        <Box fontSize="xl">
            <Grid minH="100vh" p={3}>
                <ColorModeSwitcher justifySelf="flex-end" />
                <Grid minH="100vh">
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/" element={<Home />} />
                    </Routes>
                </Grid>
            </Grid>
        </Box>
    </ChakraProvider>
)
