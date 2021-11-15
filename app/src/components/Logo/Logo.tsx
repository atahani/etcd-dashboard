import { useColorModeValue } from '@chakra-ui/color-mode'
import { Text, TextProps } from '@chakra-ui/layout'
import React from 'react'

export const Logo: React.FC<TextProps> = ({ ...rest }: TextProps) => (
    <Text
        bg="white"
        bgGradient={useColorModeValue('linear(blue.100 10%, gray.200 25%, blue.600 50%)', undefined)}
        bgClip="text"
        fontSize="3xl"
        fontWeight="extrabold"
        {...rest}
    >
        Etcd
    </Text>
)
