import React, {FunctionComponent, useEffect, useMemo, useState} from 'react';
import {IconFilter} from "@tabler/icons-react";
import {ActionIcon, Button, Group, Popover, Text, useMantineTheme} from "@mantine/core";
import {Filter, X} from "tabler-icons-react";
import {FilterBuilderValue, filterBuilderValueToGenericSQLFilter} from "./../../utils";
import {Field} from "devextreme/ui/filter_builder";
import FCBSMantineTanstackTableAdvancedFilter
    from "./../FCBSMantineTanstackTableAdvancedFilter";
import {
    useFCBSMantineTanstackTableFilterStoreSetValue,
    useFCBSMantineTanstackTableFilterStoreValue
} from "./../../stores/filter";

export interface FCBSMantineTanstackTableActionBarFilterProps {
    fields: Array<Field>
    onFilter: (filter: FilterBuilderValue, sqlLikeFilter: string) => void
}

const FCBSMantineTanstackTableActionBarFilter: FunctionComponent<FCBSMantineTanstackTableActionBarFilterProps> = (props) => {
    const {fields, onFilter} = props

    // Zustand
    const storeValue = useFCBSMantineTanstackTableFilterStoreValue();
    const setStoreValue = useFCBSMantineTanstackTableFilterStoreSetValue();

    const theme = useMantineTheme()

    const [opened, setOpened] = useState<boolean>(false)
    const [filterBuilderValue, setFilterBuilderValue] = useState<FilterBuilderValue>(storeValue.filterBuilder)

    const strFilterBuilderValue: string = useMemo(() => filterBuilderValueToGenericSQLFilter(filterBuilderValue, fields), [filterBuilderValue, fields])

    useEffect(() => {
        setFilterBuilderValue(storeValue.filterBuilder)
    }, [storeValue.filterBuilder]);

    return (
        <Popover withArrow={true}
                 closeOnClickOutside={false}
                 opened={opened}
        >
            <Popover.Target>
                <Button
                    variant={'subtle'}
                    leftIcon={<IconFilter size={theme.fontSizes.md} color={'brown'}/>}
                    size={'xs'}
                    onClick={() => {
                        setOpened(!opened)
                    }}
                >Filter</Button>
            </Popover.Target>
            <Popover.Dropdown sx={(theme) => ({
                minWidth: 400,
                maxWidth: 600,
                [theme.fn.smallerThan('sm')]: {
                    minWidth: '100%',
                    maxWidth: '100%',
                }
            })}>
                <Group position={"apart"}>
                    <Group spacing={4}>
                        <Filter size={theme.fontSizes.sm} color={'brown'}/>
                        <Text color={'primary'}>Advanced Filter</Text>
                    </Group>
                    <ActionIcon onClick={() => {
                        setOpened(false)
                    }}>
                        <X size={theme.fontSizes.sm}/>
                    </ActionIcon>
                </Group>

                <FCBSMantineTanstackTableAdvancedFilter fields={fields}
                                                        onChange={(value) => {
                                                            setFilterBuilderValue(value)
                                                            console.log(value)
                                                        }}
                                                        value={filterBuilderValue}/>

                <Group mt={'xs'} position={"right"} spacing={'xs'}>
                    <Button size={'xs'}
                            onClick={() => {
                                /*setFilterBuilderValue([])*/
                                onFilter([], '')

                                setStoreValue({
                                    filterBuilder: [],
                                    sqlLike: ''
                                })
                            }}
                            variant={'default'}>Reset</Button>
                    <Button size={'xs'}
                            onClick={() => {
                                onFilter(filterBuilderValue, strFilterBuilderValue)

                                setStoreValue({
                                    filterBuilder: filterBuilderValue,
                                    sqlLike: strFilterBuilderValue
                                })
                            }}>Search</Button>
                </Group>
            </Popover.Dropdown>
        </Popover>
    );
};

export default FCBSMantineTanstackTableActionBarFilter;
