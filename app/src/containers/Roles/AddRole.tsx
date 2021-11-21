import { Button } from '@chakra-ui/button'
import { FormControl } from '@chakra-ui/form-control'
import { Input } from '@chakra-ui/input'
import { Spacer, VStack } from '@chakra-ui/layout'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useMutation } from '@apollo/client'
import { useToast } from '@chakra-ui/toast'
import React from 'react'

import { ADD_ROLE, GET_ROLES } from 'utils/graphql/gql'
import { handleCommonErr } from 'utils/graphql/handleError'
import { MutationsAddRoleArgs } from 'types/graphql'

export const AddRole: React.FC = () => {
    const toast = useToast()
    const { register, handleSubmit, setValue } = useForm<MutationsAddRoleArgs>()
    const [addRole, { loading }] = useMutation<{ addRole: boolean }, MutationsAddRoleArgs>(ADD_ROLE, {
        onCompleted: () => {
            toast({ description: 'New role has been added', status: 'success', isClosable: true })
            setValue('name', '')
        },
        onError: (error) => handleCommonErr({ error, toast }),
        refetchQueries: [{ query: GET_ROLES }],
    })
    const onSubmit: SubmitHandler<MutationsAddRoleArgs> = (data) => {
        addRole({ variables: data })
    }
    return (
        <VStack w="full" alignItems="start">
            <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl id="name" isRequired display="flex">
                    <Input type="text" placeholder="Role Name" {...register('name', { required: true })} />
                    <Spacer />
                    <Button type="submit" isLoading={loading} ml="3" px="8">
                        Add Role
                    </Button>
                </FormControl>
            </form>
        </VStack>
    )
}
