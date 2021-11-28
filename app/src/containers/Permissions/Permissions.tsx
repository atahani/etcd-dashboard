import { Link } from 'react-router-dom'
import { Stack, Heading, VStack, Divider, Button } from '@chakra-ui/react'
import React from 'react'

export const Permissions: React.FC = () => {
    return (
        <Stack w="full">
            <Heading as="h4" mb="4">
                Permissions
            </Heading>
            <VStack spacing="30px" divider={<Divider />}>
                <Link to="/permissions/grant" style={{ alignSelf: 'start' }}>
                    <Button variant="outline">Grant New Permission</Button>
                </Link>
            </VStack>
        </Stack>
    )
}
