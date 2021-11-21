import React from 'react'
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    Button,
} from '@chakra-ui/react'

type Props = {
    header: string
    isOpen: boolean
    confirming: boolean
    actionText?: string
    onClose: () => void
    onConfirm: () => void
}

export const ConfirmDialog: React.FC<Props> = ({
    header,
    isOpen,
    onClose,
    onConfirm,
    confirming,
    actionText = 'Delete',
}: Props) => {
    const cancelRef = React.useRef(null)
    return (
        <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                        {header}
                    </AlertDialogHeader>

                    <AlertDialogBody>Are you sure? You can&apos;t undo this action afterwards.</AlertDialogBody>

                    <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button colorScheme="red" onClick={onConfirm} ml={3} isLoading={confirming}>
                            {actionText}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    )
}
