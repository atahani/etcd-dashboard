import { FaBars } from 'react-icons/fa'
import { HStack, Flex, Spacer, IconButton, useDisclosure } from '@chakra-ui/react'
import { Route, Routes } from 'react-router'
import React from 'react'

import { getUserRoles } from 'utils/persistData'
import AddTag from 'containers/AddTag'
import AddUser from 'containers/AddUser'
import ChangePassword from 'containers/ChangePassword'
import ColorModeSwitcher from 'components/ColorModeSwitcher'
import GrantPermission from 'containers/GrantPermission'
import Home from 'containers/Home'
import Logo from 'components/Logo'
import NotFound from 'containers/NotFound'
import Permissions from 'containers/Permissions'
import Roles from 'containers/Roles'
import Sidebar from 'components/Sidebar'
import Tags from 'containers/Tags'
import UserMenu from 'components/UserMenu'
import Users from 'containers/Users'

export const Dashboard: React.FC = () => {
    const { isOpen, onClose, onOpen } = useDisclosure()
    const hasRootRole = getUserRoles().includes('root')
    return (
        <Flex>
            <Flex p={3} pos="fixed" w="full" justifyContent="space-between">
                {hasRootRole && (
                    <IconButton
                        display={{ base: 'flex', md: 'none' }}
                        onClick={onOpen}
                        variant="ghost"
                        aria-label="open menu"
                        icon={<FaBars />}
                    />
                )}
                <Logo display={{ base: 'flex', md: hasRootRole ? 'none' : 'flex' }} />
                <Spacer display={{ base: 'none', md: 'flex' }} />
                <HStack justifySelf="flex-end" direction="column" spacing="2">
                    <UserMenu />
                    <ColorModeSwitcher />
                </HStack>
            </Flex>
            {hasRootRole && <Sidebar isOpen={isOpen} onClose={onClose} />}
            <Flex marginTop="58px" p={3} w="full" ml={hasRootRole ? { base: 0, md: 60 } : {}}>
                <Routes>
                    <Route path="" element={<Home />} />
                    <Route path="password" element={<ChangePassword />} />
                    {hasRootRole && <Route path="roles" element={<Roles />} />}
                    {hasRootRole && <Route path="users/add" element={<AddUser />} />}
                    {hasRootRole && <Route path="users" element={<Users />} />}
                    {hasRootRole && <Route path="permissions/grant" element={<GrantPermission />} />}
                    {hasRootRole && <Route path="permissions" element={<Permissions />} />}
                    {hasRootRole && <Route path="tags/add" element={<AddTag />} />}
                    {hasRootRole && <Route path="tags" element={<Tags />} />}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Flex>
        </Flex>
    )
}
