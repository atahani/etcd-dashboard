import { useToast, Table, Thead, Tr, Th, Tbody, Td, IconButton, Stack, Skeleton, Badge } from '@chakra-ui/react'
import { FaMinusCircle } from 'react-icons/fa'
import { useLazyQuery, useMutation } from '@apollo/react-hooks'
import React, { MouseEvent, useCallback, useEffect, useState } from 'react'

import { GET_PERMISSION_BY_ROLE, REVOKE_PERMISSION } from 'utils/graphql/gql'
import { handleCommonErr } from 'utils/graphql/handleError'
import { RevokePermissionInput, RolePermission } from 'types/graphql'
import ConfirmDialog from 'components/ConfirmDialog'

type Props = {
    selectedRole: string
}

const PermissionsTable: React.FC<Props> = ({ selectedRole }: Props) => {
    const toast = useToast()
    // get Role Permissions by Role
    const [getPermissions, { loading, data }] = useLazyQuery<{ permissions: RolePermission[] }, { role: string }>(
        GET_PERMISSION_BY_ROLE,
        {
            onError: (error) => handleCommonErr({ error, toast }),
            variables: { role: selectedRole },
        },
    )
    useEffect(() => {
        getPermissions({ variables: { role: selectedRole } })
    }, [selectedRole])
    // handle Permission revoke, the state of the input and the action
    const [revokePermission, { loading: rLoading }] = useMutation<
        { revokePermission: boolean },
        { data: RevokePermissionInput }
    >(REVOKE_PERMISSION, {
        onError: (error) => handleCommonErr({ toast, error }),
        onCompleted: () => {
            toast({ description: `Permission has been revoked successfully`, status: 'success' })
            // to close the dialog
            setRevokeInput(null)
        },
        refetchQueries: [{ query: GET_PERMISSION_BY_ROLE, variables: { role: selectedRole } }],
    })
    const [revokeInput, setRevokeInput] = useState<RevokePermissionInput | null>(null)
    const handleRevokeCTA = useCallback(
        (e: MouseEvent<HTMLButtonElement>) => {
            const key = e.currentTarget.getAttribute('data-key')
            const rangeEnd = e.currentTarget.getAttribute('data-range-end')
            if (key && rangeEnd) {
                setRevokeInput({
                    key,
                    rangeEnd,
                    role: selectedRole,
                })
            }
        },
        [selectedRole, setRevokeInput],
    )

    const handleClose = useCallback(() => {
        setRevokeInput(null)
    }, [revokeInput])

    const handleOnConfirm = useCallback(() => {
        if (revokeInput) {
            revokePermission({ variables: { data: revokeInput } })
        }
    }, [revokeInput, revokePermission])

    if (loading || !data?.permissions) {
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
                        <Th textAlign="start">Key</Th>
                        <Th textAlign="center">Permission</Th>
                        <Th textAlign="center">Revoke</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {data.permissions.map((p) => (
                        <Tr key={`${p.key}_${p.rangeEnd}`}>
                            <Td>{`${p.key} ~ ${p.rangeEnd}`}</Td>
                            <Td textAlign="center">
                                {p.read && <Badge mx={1}>Read</Badge>}
                                {p.write && (
                                    <Badge mx={1} colorScheme="green">
                                        Write
                                    </Badge>
                                )}
                            </Td>
                            <Td textAlign="center">
                                <IconButton
                                    data-key={p.key}
                                    data-range-end={p.rangeEnd}
                                    variant="ghost"
                                    color="red.400"
                                    aria-label="Revoke Permission"
                                    icon={<FaMinusCircle />}
                                    onClick={handleRevokeCTA}
                                />
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
            <ConfirmDialog
                header="Revoke Permission"
                isOpen={!!revokeInput}
                actionText="Revoke Permission"
                confirming={rLoading}
                onClose={handleClose}
                onConfirm={handleOnConfirm}
            />
        </>
    )
}

export default PermissionsTable
