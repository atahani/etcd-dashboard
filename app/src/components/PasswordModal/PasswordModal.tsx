import React, { useEffect } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    Input,
    useClipboard,
    Text,
} from '@chakra-ui/react'

type Props = {
    title: string
    password?: string
}

export const PasswordModal: React.FC<Props> = ({ title, password }: Props) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { hasCopied, onCopy } = useClipboard(password || '')
    const finalRef = React.useRef(null)
    useEffect(() => {
        if (password) {
            onOpen()
        }
    }, [password, onOpen])
    return (
        <Modal finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{title}</ModalHeader>
                <ModalCloseButton />
                <ModalBody display="flex" flexDirection="row">
                    <Input value={password} isReadOnly placeholder="Welcome" />
                    <Button onClick={onCopy} ml={2}>
                        {hasCopied ? 'Copied' : 'Copy'}
                    </Button>
                </ModalBody>

                <ModalFooter justifyContent="center">
                    <Text color="green.400" fontWeight="bold">
                        protect from the password securely!
                    </Text>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
