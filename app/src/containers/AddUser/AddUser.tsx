import { Select } from 'chakra-react-select'
import { SubmitHandler, useForm, Controller } from 'react-hook-form'
import { useLazyQuery, useMutation } from '@apollo/client'
import { VStack, FormControl, Input, FormLabel, Button, Stack, useToast, Heading } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'

import { ADD_USER, GET_ROLES, GET_USERS } from 'utils/graphql/gql'
import { AddUserInput, AddUserResult } from 'types/graphql'
import { handleCommonErr } from 'utils/graphql/handleError'
import { RoleOption } from 'types/ui'
import PasswordModal from 'components/PasswordModal'

type FormData = {
    username: string
    roles: RoleOption[]
}

export const AddUser: React.FC = () => {
    // get roles
    const toast = useToast()
    const [getRoles, { data }] = useLazyQuery<{ roles: string[] }>(GET_ROLES, {
        onError: (error) => handleCommonErr({ error, toast }),
    })
    useEffect(() => {
        getRoles()
    }, [getRoles])
    const [modalState, setModalState] = useState<{ password?: string; title: string }>({
        password: undefined,
        title: '',
    })
    const {
        register,
        handleSubmit,
        control,
        setError,
        setValue,
        getValues,
        formState: { errors },
    } = useForm<FormData>()
    const [addUser, { loading }] = useMutation<{ addUser: AddUserResult }, { data: AddUserInput }>(ADD_USER, {
        onError: (error) => handleCommonErr({ error, toast }),
        onCompleted: (data) => {
            // trigger the complete to show the password modal
            setModalState({ password: data.addUser.password, title: `Password of New User: ${getValues('username')}` })
            toast({ description: 'New user has been added successfully', status: 'success' })
            setValue('username', '')
            setValue('roles', [])
        },
        refetchQueries: [{ query: GET_USERS }],
    })
    const onSubmit: SubmitHandler<FormData> = (data) => {
        const roles = data.roles?.map((r) => r.value) || []
        if (roles.length == 0) {
            setError('roles', { type: 'required' })
            return
        }
        addUser({ variables: { data: { username: data.username, roles } } })
    }
    return (
        <VStack w="full" alignItems="start">
            <Heading as="h4" mb="5">
                Add a New User
            </Heading>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack direction="column" alignItems="start" spacing="8px" w="full">
                    <FormControl id="username" isRequired w="400px">
                        <FormLabel>Username</FormLabel>
                        <Input
                            type="text"
                            placeholder="Username"
                            {...register('username', { required: true })}
                            isInvalid={!!errors.username}
                        />
                    </FormControl>
                    <FormControl id="roles" isRequired>
                        <FormLabel mb="16px">Roles</FormLabel>
                        <Controller
                            name="roles"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    isMulti
                                    isInvalid={!!errors.roles}
                                    options={data?.roles.map((r) => ({ label: r, value: r }))}
                                />
                            )}
                        />
                    </FormControl>
                    <FormControl>
                        <Button type="submit" isLoading={loading} px="8" w="full">
                            Add User
                        </Button>
                    </FormControl>
                </Stack>
            </form>
            <PasswordModal {...modalState} />
        </VStack>
    )
}
