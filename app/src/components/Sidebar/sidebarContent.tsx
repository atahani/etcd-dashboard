import { Box, BoxProps, CloseButton, Flex, useColorModeValue } from '@chakra-ui/react'
import { FaHome, FaUsers, FaShieldAlt, FaTags } from 'react-icons/fa'
import React from 'react'

import { NavLinkItem } from './navLinkItem'
import Logo from 'components/Logo'

interface ContentProps extends BoxProps {
    onClose: () => void
}

export const SidebarContent: React.FC<ContentProps> = ({ onClose, ...rest }: ContentProps) => {
    return (
        <Box
            transition="2s ease"
            bg={useColorModeValue('white', 'gray.900')}
            borderRight="1px"
            borderRightColor={useColorModeValue('gray.200', 'gray.700')}
            w={{ base: 'full', md: 60 }}
            pos="fixed"
            h="full"
            {...rest}
        >
            <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
                <Logo />
                <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
            </Flex>
            <NavLinkItem to="/" icon={FaHome}>
                Home
            </NavLinkItem>
            <NavLinkItem to="/tags" icon={FaTags}>
                Tags
            </NavLinkItem>
            <NavLinkItem to="/permissions" icon={FaShieldAlt}>
                Permissions
            </NavLinkItem>
            <NavLinkItem to="/users" icon={FaUsers}>
                User Management
            </NavLinkItem>
            <NavLinkItem to="/roles" icon={FaShieldAlt}>
                Role Management
            </NavLinkItem>
        </Box>
    )
}
