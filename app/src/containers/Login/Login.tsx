import { Box, Center, Heading, Stack, Text } from '@chakra-ui/layout'
import { Button } from '@chakra-ui/button'
import { FormControl, FormLabel } from '@chakra-ui/form-control'
import { Input } from '@chakra-ui/input'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useColorModeValue } from '@chakra-ui/color-mode'
import React from 'react'

type LoginInput = {
    username: string
    password: string
}

const Login: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginInput>()
    const onSubmit: SubmitHandler<LoginInput> = (data) => console.log(data)
    return (
        <Center>
            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                <Stack align={'center'}>
                    <Heading fontSize={'4xl'}>Sign in to Etcd Dashboard</Heading>
                    <Text fontSize={'lg'} color={'gray.600'} />
                </Stack>
                <Box rounded={'lg'} bg={useColorModeValue('white', 'gray.700')} boxShadow={'lg'} p={8}>
                    <Stack spacing={4}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <FormControl id="username">
                                <FormLabel>Username</FormLabel>
                                <Input
                                    type="text"
                                    {...register('username', { required: true })}
                                    isInvalid={!!errors.username}
                                />
                            </FormControl>
                            <FormControl id="password" marginTop="2">
                                <FormLabel>Password</FormLabel>
                                <Input
                                    type="password"
                                    {...register('password', { required: true })}
                                    isInvalid={!!errors.password}
                                />
                            </FormControl>
                            <Button
                                marginTop="5"
                                bg={'blue.400'}
                                color={'white'}
                                _hover={{
                                    bg: 'blue.500',
                                }}
                                type="submit"
                                isFullWidth
                            >
                                Sign in
                            </Button>
                        </form>
                    </Stack>
                </Box>
            </Stack>
        </Center>
    )
}

export default Login
