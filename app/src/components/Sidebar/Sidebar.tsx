import { Box, Drawer, DrawerContent, useColorModeValue, BoxProps } from '@chakra-ui/react'
import React from 'react'

import { SidebarContent } from './sidebarContent'

interface SideBarProps extends BoxProps {
    isOpen: boolean
    onClose: () => void
}

export const Sidebar: React.FC<SideBarProps> = ({ isOpen, onClose, ...rest }: SideBarProps) => {
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
