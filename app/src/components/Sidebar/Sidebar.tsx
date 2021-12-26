import { Box, Drawer, DrawerContent, useColorModeValue, BoxProps } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { SidebarContent } from './sidebarContent'

interface SideBarProps extends BoxProps {
    isOpen: boolean
    onClose: () => void
}

export const Sidebar: React.FC<SideBarProps> = ({ isOpen, onClose, ...rest }: SideBarProps) => {
    const location = useLocation()
    useEffect(() => {
        // means the user had selected a navLink, so should be closed as well
        onClose()
    }, [location])
    return (
        <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')} {...rest}>
            <SidebarContent onClose={() => onClose} display={{ base: 'none', md: 'block' }} />
            <Drawer
                autoFocus={false}
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
                returnFocusOnClose={false}
                onOverlayClick={onClose}
                size="full"
            >
                <DrawerContent>
                    <SidebarContent onClose={onClose} />
                </DrawerContent>
            </Drawer>
        </Box>
    )
}
