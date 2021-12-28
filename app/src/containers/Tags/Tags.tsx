import { Button, Divider, Heading, Radio, RadioGroup, Stack, VStack } from '@chakra-ui/react'
import React, { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import TagsTable from './TagsTable'

export const Tags: React.FC = () => {
    const [typePreference, setTypePreference] = useState<string>('PREFIX')
    const onPrefChange = useCallback(
        (value: string) => {
            if (value) {
                setTypePreference(value)
            }
        },
        [typePreference],
    )
    return (
        <Stack w="full" alignItems="start">
            <Heading as="h4" mb="4">
                Tags
            </Heading>
            <VStack w="full" alignItems="start" spacing="30px" divider={<Divider />}>
                <Link to="/tags/add" style={{ alignSelf: 'start' }}>
                    <Button variant="outline">Add Tag</Button>
                </Link>
                <RadioGroup value={typePreference} onChange={onPrefChange}>
                    <Stack spacing={5} direction="row">
                        <Radio colorScheme="red" value="PREFIX">
                            Prefix
                        </Radio>
                        <Radio colorScheme="green" value="POSTFIX">
                            Postfix
                        </Radio>
                    </Stack>
                </RadioGroup>
                <TagsTable type={typePreference} />
            </VStack>
        </Stack>
    )
}
