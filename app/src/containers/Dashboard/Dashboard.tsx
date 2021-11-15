import { FaBars } from 'react-icons/fa'
import { HStack, Flex, Spacer, IconButton, useDisclosure } from '@chakra-ui/react'
import { Route, Routes } from 'react-router'
import React from 'react'

import ColorModeSwitcher from 'components/ColorModeSwitcher'
import Home from 'containers/Home'
import Logo from 'components/Logo'
import Sidebar from 'components/Sidebar'
import UserMenu from 'components/UserMenu'

export const Dashboard: React.FC = () => {
    const { isOpen, onClose, onOpen } = useDisclosure()
    return (
        <Flex>
            <Flex p={3} pos="fixed" w="full" justifyContent="space-between">
                <IconButton
                    display={{ base: 'flex', md: 'none' }}
                    onClick={onOpen}
                    variant="ghost"
                    aria-label="open menu"
                    icon={<FaBars />}
                />
                <Logo display={{ base: 'flex', md: 'none' }} />
                <Spacer display={{ base: 'none', md: 'flex' }} />
                <HStack justifySelf="flex-end" direction="column" spacing="2">
                    <UserMenu />
                    <ColorModeSwitcher />
                </HStack>
            </Flex>
            <Sidebar isOpen={isOpen} onClose={onClose} />
            <Flex marginTop="58px" p={3} w="full">
                <Routes>
                    <Route path="/" element={<Home />} />
                </Routes>
            </Flex>
        </Flex>
    )
}
