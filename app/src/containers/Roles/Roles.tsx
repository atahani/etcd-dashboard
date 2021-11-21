import { Stack, Heading, VStack } from '@chakra-ui/react'
import React from 'react'

import { AddRole } from './AddRole'
import { RolesTable } from './RolesTable'

export const Roles: React.FC = () => {
    return (
        <Stack>
            <Heading as="h4" mb="4">
                Roles
            </Heading>
            <VStack spacing="30px">
                <AddRole />
                <RolesTable />
            </VStack>
        </Stack>
    )
}
