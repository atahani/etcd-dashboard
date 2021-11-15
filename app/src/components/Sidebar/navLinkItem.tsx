import { Flex, FlexProps, Icon } from '@chakra-ui/react'
import { IconType } from 'react-icons'
import { NavLink } from 'react-router-dom'
import React, { ReactText } from 'react'

interface NavLinkItemProps extends FlexProps {
    to: string
    icon: IconType
    children: ReactText
}

export const NavLinkItem: React.FC<NavLinkItemProps> = ({ to, icon, children, ...rest }: NavLinkItemProps) => (
    <NavLink to={to} className="chakra-link">
        <Flex
            align="center"
            p="4"
            mx="4"
            borderRadius="lg"
            role="group"
            cursor="pointer"
            _hover={{
                bg: 'cyan.400',
                color: 'white',
            }}
            {...rest}
        >
            {icon && (
                <Icon
                    mr="4"
                    fontSize="16"
                    _groupHover={{
                        color: 'white',
                    }}
                    as={icon}
                />
            )}
            {children}
        </Flex>
    </NavLink>
)
