import { Button } from '@chakra-ui/button'
import { FormControl, FormLabel } from '@chakra-ui/form-control'
import { Heading, Stack } from '@chakra-ui/layout'
import { Input } from '@chakra-ui/input'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useMutation } from '@apollo/client'
import { useNavigate } from 'react-router'
import { useToast } from '@chakra-ui/toast'
import React from 'react'

import { CHANGE_PASSWORD } from 'utils/graphql/gql'
import { ChangePasswordInput } from 'types/graphql'
import { handleCommonErr } from 'utils/graphql/handleError'

export const ChangePassword: React.FC = () => {
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<{ oldPassword: string; password: string }>()
    const toast = useToast()
    const navigate = useNavigate()
    const [changePassword, { loading }] = useMutation<{ changePassword: boolean }, { data: ChangePasswordInput }>(
        CHANGE_PASSWORD,
        {
            onCompleted: () => {
                toast({ description: 'Password has been changed successfully', status: 'success', isClosable: true })
                navigate('/')
            },
            onError: (error) =>
                handleCommonErr({
                    error,
                    toast,
                    handleMore: () => {
                        if (error.message == 'old password is incorrect') {
                            toast({ description: error.message, status: 'error', isClosable: true })
                            setError('oldPassword', { message: error.message, type: 'value' })
                        }
                    },
                }),
        },
    )
    const onSubmit: SubmitHandler<ChangePasswordInput> = (data) => {
        changePassword({ variables: { data } })
    }
    return (
        <Stack>
            <Heading as="h4" mb="3">
                Change Password
            </Heading>
            <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl id="oldPassword" isRequired>
                    <FormLabel>Old Password</FormLabel>
                    <Input
                        type="password"
                        {...register('oldPassword', { required: true })}
                        isInvalid={!!errors.oldPassword}
                    />
                </FormControl>
                <FormControl id="confirmPassword" isRequired mt="2">
                    <FormLabel>New Password</FormLabel>
                    <Input
                        type="password"
                        {...register('password', { required: true })}
                        isInvalid={!!errors.password}
                    />
                </FormControl>
                <Button marginTop="5" type="submit" isLoading={loading} isFullWidth>
                    Update Password
                </Button>
            </form>
        </Stack>
    )
}
