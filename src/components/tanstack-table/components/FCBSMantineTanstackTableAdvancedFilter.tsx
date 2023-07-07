import React, {FunctionComponent, useEffect, useMemo, useRef, useState} from 'react';
import {useClipboard} from "@mantine/hooks";
import {ActionIcon, Alert, Box, Group, Text} from "@mantine/core";
import {FilterBuilder} from "devextreme-react";
import {Copy} from "tabler-icons-react";
import {Field} from "devextreme/ui/filter_builder";
import {FilterBuilderValue, filterBuilderValueToGenericSQLFilter} from "./../utils";
import {IconAlertCircle} from "@tabler/icons-react";

export interface FCBSMantineTanstackTableAdvancedFilterProps {
    fields: Array<Field>
    value: FilterBuilderValue
    onChange: (filter: FilterBuilderValue, sqlLikeFilter: string) => void
}

const FCBSMantineTanstackTableAdvancedFilter: FunctionComponent<FCBSMantineTanstackTableAdvancedFilterProps> = (props) => {
    const initialRender = useRef<boolean>(true)
    const clipboard = useClipboard();
    const [filterBuilderValue, setFilterBuilderValue] = useState<FilterBuilderValue>(props.value)
    const strFilterBuilderValue = useMemo(() => filterBuilderValueToGenericSQLFilter(filterBuilderValue, props.fields), [filterBuilderValue, props.fields])

    useEffect(() => {
        setFilterBuilderValue(props.value)

    }, [props.value])

    useEffect(() => {
        if (!initialRender.current) props.onChange(filterBuilderValue, strFilterBuilderValue)

        initialRender.current = false
    }, [filterBuilderValue, strFilterBuilderValue])

    return (
        props.fields.length === 0 ?
            <Alert icon={<IconAlertCircle size="1rem"/>}
                   title="Error"
                   color="red"
                   m={'xs'}>
                At least one 'field' is required for filtering.
            </Alert> :
            <React.Fragment>
                <Box sx={(theme) => ({
                    border: `solid 1px ${theme.other.borders.grey}`
                })} p={'xs'}
                >
                    <FilterBuilder fields={props.fields}
                                   value={filterBuilderValue}
                                   onValueChange={(e) => {
                                       console.log(`FilterBuilder.onValueChange(e) : `, e, JSON.stringify(e))
                                       setFilterBuilderValue(e ?? [])
                                   }}
                                   onValueChanged={(e) => {
                                       console.log(`FilterBuilder.onValueChanged(e) : `, e)
                                   }}
                                   groupOperations={['and', 'or']}
                    />
                </Box>
                <Group mt={'xs'}
                       position={"apart"}
                       sx={(theme) => ({
                           background: theme.other.backgrounds.grey[0],
                           flexWrap: 'nowrap',
                           alignItems: 'start',
                           border: `solid 1px ${theme.other.borders.grey}`
                       })}
                       p={'xs'}
                >
                    <Text size={'sm'}>
                        {strFilterBuilderValue}
                    </Text>
                    <ActionIcon onClick={() => {
                        clipboard.copy(strFilterBuilderValue)
                    }}
                                color={'primary'}
                                title={'Copy'}
                    >
                        <Copy/>
                    </ActionIcon>
                </Group>
            </React.Fragment>
    );
};

export default FCBSMantineTanstackTableAdvancedFilter;
