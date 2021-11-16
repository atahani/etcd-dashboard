import { FaRegUserCircle, FaUserCircle } from 'react-icons/fa'
import { HStack, Text, IconButton, useColorModeValue, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react'
import React from 'react'

import { getUsername } from 'utils/persistData'
import { Link } from 'react-router-dom'

export const UserMenu: React.FC = () => {
    const UserCircleIcon = useColorModeValue(FaUserCircle, FaRegUserCircle)
    return (
        <HStack spacing="8px">
            <Text>{getUsername()}</Text>
            <Menu>
                <MenuButton
                    size="md"
                    as={IconButton}
                    fontSize="lg"
                    variant="ghost"
                    aria-label="user account"
                    icon={<UserCircleIcon />}
                />
                <MenuList>
                    <MenuItem>Change Password</MenuItem>
                    <Link to="/logout">
                        <MenuItem>Log Out</MenuItem>
                    </Link>
                </MenuList>
            </Menu>
        </HStack>
    )
}
