import { Link } from 'react-router-dom'
import { Select } from 'chakra-react-select'
import { Stack, Heading, VStack, Divider, Button, useToast, FormLabel, FormControl } from '@chakra-ui/react'
import { useLazyQuery } from '@apollo/react-hooks'
import React, { useCallback, useEffect, useState } from 'react'

import { GET_ROLES } from 'utils/graphql/gql'
import { handleCommonErr } from 'utils/graphql/handleError'
import { RoleOption } from 'types/ui'
import PermissionsTable from './PermissionsTable'

export const Permissions: React.FC = () => {
    const toast = useToast()
    // get roles to fill the select
    const [getRoles, { data: dataRoles }] = useLazyQuery<{ roles: string[] }>(GET_ROLES, {
        onError: (error) => handleCommonErr({ error, toast }),
    })
    useEffect(() => {
        getRoles()
    }, [getRoles])

    const [selectedRole, setSelectedRole] = useState<string | undefined>(undefined)
    const handleOnRoleSelect = useCallback(
        ({ value }: RoleOption) => {
            setSelectedRole(value)
        },
        [setSelectedRole],
    )

    return (
        <Stack w="full" spacing="25px">
            <Heading as="h4" mb="4">
                Permissions
            </Heading>
            <VStack spacing="30px" divider={<Divider />}>
                <Link to="/permissions/grant" style={{ alignSelf: 'start' }}>
                    <Button variant="outline">Grant New Permission</Button>
                </Link>
            </VStack>
            <VStack w={{ base: 'full', md: '400px' }}>
                <FormControl id="role" isRequired>
                    <FormLabel>Permissions Per Roles</FormLabel>
                    <Select
                        onChange={handleOnRoleSelect}
                        options={dataRoles?.roles.map((r) => ({ label: r, value: r }))}
                    />
                </FormControl>
            </VStack>
            {selectedRole && <PermissionsTable selectedRole={selectedRole} />}
        </Stack>
    )
}
