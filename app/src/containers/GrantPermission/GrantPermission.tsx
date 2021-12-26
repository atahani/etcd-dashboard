import { Input, Button, Heading, Stack, VStack, FormControl, FormLabel, useToast, Switch } from '@chakra-ui/react'
import { Select } from 'chakra-react-select'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { useLazyQuery, useMutation } from '@apollo/client'
import React, { useEffect } from 'react'

import { GET_ROLES, GRANT_PERMISSION } from 'utils/graphql/gql'
import { GrantPermissionInput } from 'types/graphql'
import { handleCommonErr } from 'utils/graphql/handleError'
import { RoleOption } from 'types/ui'

type FormData = Omit<GrantPermissionInput, 'role'> & {
    role?: RoleOption
}

export const GrantPermission: React.FC = () => {
    const toast = useToast()
    // get roles to fill the select
    const [getRoles, { data }] = useLazyQuery<{ roles: string[] }>(GET_ROLES, {
        onError: (error) => handleCommonErr({ error, toast }),
    })
    useEffect(() => {
        getRoles()
    }, [getRoles])
    const defaultValues: FormData = { role: undefined, key: '', rangeEnd: '', read: false, write: false }
    const {
        register,
        handleSubmit,
        control,
        setError,
        getValues,
        reset,
        formState: { errors },
    } = useForm<FormData>({ defaultValues, shouldUnregister: true })
    const [grantPermission, { loading }] = useMutation<{ grantPermission: boolean }, { data: GrantPermissionInput }>(
        GRANT_PERMISSION,
        {
            onCompleted: () => {
                toast({
                    description: `New permission successfully granted for ${getValues('role')?.value} role`,
                    status: 'success',
                })
                reset(defaultValues)
            },
        },
    )
    const onSubmit: SubmitHandler<FormData> = ({ role, ...rest }) => {
        if (!role || !role.value) {
            setError('role', { type: 'required' })
            return
        }
        const data: GrantPermissionInput = { role: role.value, ...rest }
        grantPermission({ variables: { data } })
    }
    return (
        <VStack w="full" alignItems="start">
            <Heading as="h4" mb="5">
                Grant a New Permission
            </Heading>
            <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
                <Stack direction="column" alignItems="start" spacing="10px" w={{ base: 'full', md: '400px' }}>
                    <FormControl id="role" isRequired>
                        <FormLabel>Role</FormLabel>
                        <Controller
                            name="role"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    isInvalid={!!errors.role}
                                    options={data?.roles.map((r) => ({ label: r, value: r }))}
                                />
                            )}
                        />
                    </FormControl>
                    <FormControl id="key" isRequired>
                        <FormLabel>key</FormLabel>
                        <Input
                            type="text"
                            placeholder="Key"
                            {...register('key', { required: true })}
                            isInvalid={!!errors.key}
                        />
                    </FormControl>
                    <FormControl id="rangeEnd" isRequired>
                        <FormLabel>End of Key</FormLabel>
                        <Input
                            type="text"
                            placeholder="End of Range"
                            {...register('rangeEnd', { required: true })}
                            isInvalid={!!errors.rangeEnd}
                        />
                    </FormControl>
                    <FormControl display="flex" alignItems="center" mt="8px">
                        <FormLabel htmlFor="read" mb="0">
                            Read Access
                        </FormLabel>
                        <Switch id="read" size="md" {...register('read')} />
                    </FormControl>
                    <FormControl display="flex" alignItems="center" mt="8px">
                        <FormLabel htmlFor="write" mb="0">
                            Write Access
                        </FormLabel>
                        <Switch id="write" size="md" {...register('write')} />
                    </FormControl>
                    <FormControl>
                        <Button type="submit" isLoading={loading} px="8" w="full" mt="4">
                            Grant Permission
                        </Button>
                    </FormControl>
                </Stack>
            </form>
        </VStack>
    )
}
