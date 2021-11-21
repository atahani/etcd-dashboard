import { FaTrash } from 'react-icons/fa'
import { Stack, useToast, Table, Thead, Tbody, Tr, Th, Td, IconButton, Skeleton } from '@chakra-ui/react'
import { useLazyQuery, useMutation } from '@apollo/client'
import React, { MouseEvent, useCallback, useEffect } from 'react'

import { DELETE_ROLE, GET_ROLES } from 'utils/graphql/gql'
import { handleCommonErr } from 'utils/graphql/handleError'
import { MutationsDeleteRoleArgs } from 'types/graphql'
import ConfirmDialog from 'components/ConfirmDialog'

export const RolesTable: React.FC = () => {
    const toast = useToast()
    const [getRoles, { data, loading }] = useLazyQuery<{ roles: string[] }>(GET_ROLES, {
        onError: (error) => handleCommonErr({ error, toast }),
    })
    useEffect(() => {
        getRoles()
    }, [getRoles])

    // alert dialog to confirm role deletion
    const [roleToDelete, setRoleToDelete] = React.useState<string | null>(null)
    const onSelectToDelete = (e: MouseEvent<HTMLButtonElement>) => {
        setRoleToDelete(e.currentTarget.getAttribute('data-value'))
    }
    const onClose = () => setRoleToDelete(null)
    const [deleteRole, { loading: delLoading }] = useMutation<{ deleteRole: boolean }, MutationsDeleteRoleArgs>(
        DELETE_ROLE,
        {
            onCompleted: () => {
                setRoleToDelete(null)
            },
            onError: (error) => handleCommonErr({ error, toast }),
            refetchQueries: [{ query: GET_ROLES }],
        },
    )
    const onConfirm = useCallback(() => {
        if (roleToDelete) {
            deleteRole({ variables: { name: roleToDelete } })
        }
    }, [roleToDelete, deleteRole])

    if (loading || !data?.roles) {
        return (
            <Stack w="full">
                <Skeleton height="30px" />
                <Skeleton height="30px" />
                <Skeleton height="30px" />
                <Skeleton height="30px" />
                <Skeleton height="30px" />
            </Stack>
        )
    }
    return (
        <>
            <Table>
                <Thead>
                    <Tr>
                        <Th>Name</Th>
                        <Th>Action</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {data.roles.map((r) => (
                        <Tr key={r}>
                            <Td>{r}</Td>
                            <Td textAlign="center">
                                <IconButton
                                    data-value={r}
                                    variant="ghost"
                                    color="red.400"
                                    aria-label="Delete Role"
                                    icon={<FaTrash />}
                                    onClick={onSelectToDelete}
                                />
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
            <ConfirmDialog
                header="Delete Role"
                isOpen={!!roleToDelete}
                confirming={delLoading}
                onClose={onClose}
                onConfirm={onConfirm}
            />
        </>
    )
}
