import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Text,
    Stack,
    FormControl,
    FormLabel,
    useToast,
} from '@chakra-ui/react'
import { Select } from 'chakra-react-select'
import { SubmitHandler, useForm, Controller } from 'react-hook-form'
import { useLazyQuery } from '@apollo/client'
import React, { useEffect } from 'react'

import { GET_ROLES } from 'utils/graphql/gql'
import { handleCommonErr } from 'utils/graphql/handleError'

type RoleOption = {
    label: string
    value: string
}

type FormData = {
    roles: RoleOption[]
}

type ConfirmPayload = {
    roles: string[]
}

type Props = {
    shouldOpen: boolean
    initialRoles?: string[]
    confirming: boolean
    onConfirm: (payload: ConfirmPayload) => void
    onClose: () => void
}

export const ChangeRolesModal: React.FC<Props> = ({
    shouldOpen,
    onConfirm,
    confirming,
    onClose,
    initialRoles = [],
}: Props) => {
    const finalRef = React.useRef(null)
    // get roles
    const toast = useToast()
    const [getRoles, { data }] = useLazyQuery<{ roles: string[] }>(GET_ROLES, {
        onError: (error) => handleCommonErr({ error, toast }),
    })
    const {
        handleSubmit,
        control,
        setError,
        setValue,
        formState: { errors },
    } = useForm<FormData>()
    const onSubmit: SubmitHandler<FormData> = (data) => {
        const roles = data.roles?.map((r) => r.value) || []
        if (roles.length == 0) {
            setError('roles', { type: 'required' })
            return
        }
        onConfirm({ roles })
    }
    useEffect(() => {
        if (shouldOpen) {
            getRoles()
            setValue(
                'roles',
                initialRoles.map((r) => ({ label: r, value: r })),
                { shouldTouch: true },
            )
        }
    }, [getRoles, initialRoles, shouldOpen])
    return (
        <Modal finalFocusRef={finalRef} isOpen={shouldOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Change User Roles</ModalHeader>
                <ModalCloseButton />
                <ModalBody display="flex" flexDirection="column">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Stack direction="column" w="full">
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
                            <Button type="submit" isLoading={confirming} ml={2}>
                                Edit
                            </Button>
                        </Stack>
                    </form>
                </ModalBody>

                <ModalFooter justifyContent="center">
                    <Text color="orange.400" fontWeight="bold">
                        The user should logout/login to take changes
                    </Text>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
