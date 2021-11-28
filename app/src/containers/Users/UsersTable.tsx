import { FaTrash, FaKey, FaPencilAlt } from 'react-icons/fa'
import { useLazyQuery, useMutation } from '@apollo/client'
import { useToast, Table, Thead, Tr, Th, Tbody, Td, IconButton, Stack, Skeleton } from '@chakra-ui/react'
import React, { useEffect, useCallback, MouseEvent } from 'react'

import { CHANGE_USER_ROLES, DELETE_USER, GET_USERS, RESET_USER_PASSWORD } from 'utils/graphql/gql'
import { ChangeRolesModal } from './ChangeRolesModal'
import { handleCommonErr } from 'utils/graphql/handleError'
import { MutationsChangeUserRolesArgs, MutationsDeleteUserArgs, MutationsResetPasswordArgs, User } from 'types/graphql'
import ConfirmDialog from 'components/ConfirmDialog'
import PasswordModal from 'components/PasswordModal'

type Action = 'delete' | 'resetPassword' | 'showPassword' | 'changeRoles'

export const UsersTable: React.FC = () => {
    const toast = useToast()
    // get users
    const [getUsers, { data, loading }] = useLazyQuery<{ users: User[] }>(GET_USERS, {
        onError: (error) => handleCommonErr({ error, toast }),
    })
    useEffect(() => {
        getUsers()
    }, [getUsers])
    // alert dialog to confirm user deletion
    const [actionMeta, setActionMeta] = React.useState<{
        username: string
        password?: string
        roles?: string[]
        action: Action
    } | null>(null)
    const onSelectForAction = (action: Action) => (e: MouseEvent<HTMLButtonElement>) => {
        const username = e.currentTarget.getAttribute('data-username')
        const roles = e.currentTarget.getAttribute('data-user-roles')?.split(',') || []
        if (username) {
            setActionMeta({ username, roles, action })
        }
    }
    const onClose = () => setActionMeta(null)
    const [deleteUser, { loading: delLoading }] = useMutation<{ deleteRole: boolean }, MutationsDeleteUserArgs>(
        DELETE_USER,
        {
            onCompleted: () => {
                setActionMeta(null)
            },
            onError: (error) => handleCommonErr({ error, toast }),
            refetchQueries: [{ query: GET_USERS }],
        },
    )
    // rest password
    const [resetPass, { loading: rpLoading }] = useMutation<{ resetPassword: string }, MutationsResetPasswordArgs>(
        RESET_USER_PASSWORD,
        {
            onCompleted: (data) => {
                if (actionMeta) {
                    toast({ description: `${actionMeta.username}' password has been reset` })
                    setActionMeta({
                        action: 'showPassword',
                        username: actionMeta?.username,
                        password: data.resetPassword,
                    })
                }
            },
            onError: (error) => handleCommonErr({ error, toast }),
        },
    )
    // change roles
    const [changeUserRoles, { loading: chRolesLoading }] = useMutation<
        { changeUserRoles: boolean },
        MutationsChangeUserRolesArgs
    >(CHANGE_USER_ROLES, {
        onCompleted: () => {
            if (actionMeta) {
                toast({ description: `${actionMeta.username}' roles has been updated` })
            }
            setActionMeta(null)
        },
        refetchQueries: [{ query: GET_USERS }],
        onError: (error) => handleCommonErr({ error, toast }),
    })
    const onConfirm = useCallback(
        (payload?: { roles?: string[] }) => {
            const username = actionMeta?.username
            if (!username) {
                return
            }
            if (actionMeta.action == 'delete') {
                deleteUser({ variables: { username } })
                return
            }
            if (actionMeta.action == 'resetPassword') {
                resetPass({ variables: { username } })
                return
            }
            if (actionMeta.action == 'changeRoles') {
                changeUserRoles({ variables: { username, roles: payload?.roles || [] } })
                return
            }
        },
        [actionMeta, deleteUser],
    )
    if (loading || !data?.users) {
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
                        <Th>UserName</Th>
                        <Th>Roles</Th>
                        <Th textAlign="center">Rest Password</Th>
                        <Th textAlign="center">Delete</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {data.users.map((u) => (
                        <Tr key={u.username}>
                            <Td>{u.username}</Td>
                            <Td>
                                {u.roles.join(' ,')}
                                <IconButton
                                    data-username={u.username}
                                    data-user-roles={u.roles.join(',')}
                                    variant="ghost"
                                    color="orange.400"
                                    aria-label="Edit Roles"
                                    icon={<FaPencilAlt />}
                                    onClick={onSelectForAction('changeRoles')}
                                />
                            </Td>
                            <Td textAlign="center">
                                <IconButton
                                    data-username={u.username}
                                    data-user-roles={u.roles.join(',')}
                                    variant="ghost"
                                    color="green.400"
                                    aria-label="Reset User Password"
                                    icon={<FaKey />}
                                    onClick={onSelectForAction('resetPassword')}
                                />
                            </Td>
                            <Td textAlign="center">
                                <IconButton
                                    data-username={u.username}
                                    data-user-roles={u.roles.join(',')}
                                    variant="ghost"
                                    color="red.400"
                                    aria-label="Delete User"
                                    icon={<FaTrash />}
                                    onClick={onSelectForAction('delete')}
                                />
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
            <ConfirmDialog
                header="Delete User"
                isOpen={actionMeta?.action === 'delete'}
                confirming={delLoading}
                onClose={onClose}
                onConfirm={onConfirm}
            />
            <ConfirmDialog
                header="Reset User Password"
                isOpen={actionMeta?.action === 'resetPassword'}
                confirming={rpLoading}
                onClose={onClose}
                onConfirm={onConfirm}
                actionText="Rest Password"
            />
            <PasswordModal password={actionMeta?.password} title={`${actionMeta?.username}'s New Password`} />
            <ChangeRolesModal
                shouldOpen={actionMeta?.action === 'changeRoles'}
                initialRoles={actionMeta?.roles}
                confirming={chRolesLoading}
                onConfirm={onConfirm}
                onClose={onClose}
            />
        </>
    )
}
