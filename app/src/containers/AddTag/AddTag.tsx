import { useMutation } from '@apollo/react-hooks'
import {
    Button,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Radio,
    RadioGroup,
    Stack,
    useToast,
    VStack,
} from '@chakra-ui/react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import React from 'react'

import { ADD_TAG, GET_TAGS } from 'utils/graphql/gql'
import { handleCommonErr } from 'utils/graphql/handleError'
import { TagInput, TagType } from 'types/graphql'

const AddTag: React.FC = () => {
    const toast = useToast()
    const {
        register,
        handleSubmit,
        control,
        setValue,
        getValues,
        formState: { errors },
    } = useForm<TagInput>({
        defaultValues: {
            type: 'PREFIX' as TagType,
            name: '',
            key: '',
        },
    })
    const [addTag, { loading }] = useMutation<{ addTag: boolean }, { data: TagInput }>(ADD_TAG, {
        onError: (error) => handleCommonErr({ error, toast }),
        onCompleted: () => {
            toast({ description: 'New Tag has been added successfully', status: 'success' })
            // reset only the name and key fields
            setValue('name', '')
            setValue('key', '')
        },
        refetchQueries: [{ query: GET_TAGS, variables: { type: getValues('type') } }],
    })
    const onAddTag: SubmitHandler<TagInput> = (data) => {
        addTag({ variables: { data } })
    }
    return (
        <Stack w="full" alignItems="start">
            <Heading as="h4" mb="4">
                Tags
            </Heading>
            <VStack alignItems="start" spacing="8px" w="full">
                <form onSubmit={handleSubmit(onAddTag)}>
                    <Stack direction="column" alignItems="start" spacing="8px" w="full">
                        <FormControl id="type">
                            <FormLabel>Type</FormLabel>
                            <Controller
                                name="type"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <RadioGroup {...field}>
                                        <Stack spacing={5} direction="row">
                                            <Radio colorScheme="red" value="PREFIX">
                                                Prefix
                                            </Radio>
                                            <Radio colorScheme="green" value="POSTFIX">
                                                Postfix
                                            </Radio>
                                        </Stack>
                                    </RadioGroup>
                                )}
                            />
                        </FormControl>
                        <FormControl id="key" isRequired w="400px">
                            <FormLabel>Key</FormLabel>
                            <Input
                                type="text"
                                placeholder="Key"
                                {...register('key', { required: true })}
                                isInvalid={!!errors.key}
                            />
                        </FormControl>
                        <FormControl id="name" isRequired>
                            <FormLabel>Name</FormLabel>
                            <Input
                                type="text"
                                placeholder="Name"
                                {...register('name', { required: true })}
                                isInvalid={!!errors.name}
                            />
                        </FormControl>
                        <FormControl pt="2">
                            <Button type="submit" px="8" w="full" isLoading={loading}>
                                Add Tag
                            </Button>
                        </FormControl>
                    </Stack>
                </form>
            </VStack>
        </Stack>
    )
}

export default AddTag
