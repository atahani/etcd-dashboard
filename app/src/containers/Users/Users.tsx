import { Button } from '@chakra-ui/button'
import { Heading, Stack, VStack, Divider } from '@chakra-ui/layout'
import { Link } from 'react-router-dom'
import React from 'react'

import { UsersTable } from './UsersTable'

export const Users: React.FC = () => {
    return (
        <Stack w="full">
            <Heading as="h4" mb="4">
                Users
            </Heading>
            <VStack spacing="30px" divider={<Divider />}>
                <Link to="/users/add" style={{ alignSelf: 'start' }}>
                    <Button variant="outline">Add User</Button>
                </Link>
                <UsersTable />
            </VStack>
        </Stack>
    )
}
