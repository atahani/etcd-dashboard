import { FaTrash } from 'react-icons/fa'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { useToast, Table, Thead, Tr, Th, Tbody, Td, IconButton, Stack, Skeleton } from '@chakra-ui/react'
import React, { MouseEvent, useCallback, useState } from 'react'

import { DELETE_TAG, GET_TAGS } from 'utils/graphql/gql'
import { handleCommonErr } from 'utils/graphql/handleError'
import { Tag, TagType } from 'types/graphql'
import ConfirmDialog from 'components/ConfirmDialog'

type Props = {
    type: string
}

const TagsTable: React.FC<Props> = ({ type }: Props) => {
    const toast = useToast()
    // get tags based on type
    const { loading, data } = useQuery<{ tags: Tag[] }, { type: TagType }>(GET_TAGS, {
        onError: (error) => handleCommonErr({ error, toast }),
        variables: { type: type as TagType },
    })
    // handle delete tag
    const [selectToDelete, setSelectToDelete] = useState<{ type: string; key: string } | null>(null)
    const [deleteTag, { loading: delLoading }] = useMutation<{ deleteTag: boolean }, { key: string; type: string }>(
        DELETE_TAG,
        {
            onError: (error) => handleCommonErr({ error, toast }),
            onCompleted: () => {
                toast({ description: `Tag has been deleted successfully`, status: 'success' })
                // to close the confirm dialog
                setSelectToDelete(null)
            },
            refetchQueries: [{ query: GET_TAGS, variables: { type } }],
        },
    )
    const handleDelete = useCallback(
        (e: MouseEvent<HTMLButtonElement>) => {
            const key = e.currentTarget.getAttribute('data-key')
            if (key) {
                setSelectToDelete({ type, key })
            }
        },
        [type],
    )
    const onConfirm = () => {
        if (selectToDelete) {
            deleteTag({ variables: { ...selectToDelete } })
        }
    }
    const onClose = () => {
        setSelectToDelete(null)
    }
    if (loading || !data?.tags) {
        return (
            <Stack w="full">
                <Skeleton height="30px" />
                <Skeleton height="30px" />
                <Skeleton height="30px" />
                <Skeleton height="30px" />
                <Skeleton height="30px" />
            </Stack>
        )
    }
    return (
        <>
            <Table>
                <Thead>
                    <Tr>
                        <Th>Key</Th>
                        <Th>Name</Th>
                        <Th textAlign="center">Delete</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {data.tags.map((t) => (
                        <Tr key={t.key}>
                            <Td>{t.key}</Td>
                            <Td>{t.name}</Td>
                            <Td textAlign="center">
                                <IconButton
                                    data-key={t.key}
                                    variant="ghost"
                                    color="red.400"
                                    aria-label="Delete Tag"
                                    icon={<FaTrash />}
                                    onClick={handleDelete}
                                />
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
            <ConfirmDialog
                header="Delete Tag"
                isOpen={!!selectToDelete}
                confirming={delLoading}
                onClose={onClose}
                onConfirm={onConfirm}
            />
        </>
    )
}

export default TagsTable
