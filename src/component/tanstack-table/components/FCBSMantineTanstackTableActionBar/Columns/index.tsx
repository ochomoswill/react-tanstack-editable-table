import React, {FunctionComponent, useEffect, useMemo, useState} from 'react';
import {ActionIcon, Button, Divider, Group, Popover, Text, TextInput, useMantineTheme} from "@mantine/core";
import {IconListCheck} from "@tabler/icons-react";
import {ListCheck, Search, X} from "tabler-icons-react";
import FCBSMantineTanstackTableActionBarColumnsSelect
    , {
    FCBSMantineTanstackTableActionBarColumnsSelectColumn, getSelectableColumns
} from "./Select";
import {Table, VisibilityState} from "@tanstack/react-table";

export interface FCBSMantineTanstackTableActionBarColumnsProps {
    table: Table<unknown>
}

const FCBSMantineTanstackTableActionBarColumns: FunctionComponent<FCBSMantineTanstackTableActionBarColumnsProps> = (props) => {
    const {table} = props

    const [opened, setOpened] = useState<boolean>(false)
    const theme = useMantineTheme()

    const [searchFilter, setSearchFilter] = useState<string>('')

    const columns: Array<FCBSMantineTanstackTableActionBarColumnsSelectColumn> = useMemo(() => {
        return getSelectableColumns(table)
    }, [table.getAllLeafColumns(), table.getVisibleLeafColumns(), table.getState().columnPinning])

    const [changeColumns, setChangeColumns] = useState<Array<FCBSMantineTanstackTableActionBarColumnsSelectColumn>>(columns)

    useEffect(() => {
        setChangeColumns(columns)
    }, [columns]);

    return (
        <Popover withArrow={true}
                 closeOnClickOutside={false}
                 opened={opened}
        >
            <Popover.Target>
                <Button
                    variant={'subtle'}
                    leftIcon={<IconListCheck size={theme.fontSizes.md}
                                             color={theme.colors.grape[theme.fn.primaryShade()]}/>}
                    size={'xs'}
                    onClick={() => {
                        setOpened(!opened)
                    }}
                >Columns</Button>
            </Popover.Target>
            <Popover.Dropdown sx={(theme) => ({
                minWidth: 300,
                maxWidth: 400,
                [theme.fn.smallerThan('sm')]: {
                    maxWidth: '100%',
                }
            })}>
                <Group position={"apart"}>
                    <Group spacing={4}>
                        <ListCheck size={theme.fontSizes.sm}
                                   color={theme.colors.grape[theme.fn.primaryShade()]}/>
                        <Text color={'primary'}>Columns</Text>
                    </Group>
                    <ActionIcon onClick={() => {
                        setOpened(false)
                    }}>
                        <X size={theme.fontSizes.sm}/>
                    </ActionIcon>
                </Group>
                <Divider my={'xs'}/>

                <TextInput
                    placeholder={'Find Column'}
                    rightSection={<Search size={theme.fontSizes.sm}/>}
                    size={'xs'}
                    value={searchFilter}
                    onChange={(e) => {
                        setSearchFilter(e.target.value)
                    }}
                    mb={'xs'}
                />

                <FCBSMantineTanstackTableActionBarColumnsSelect
                    searchFilter={searchFilter}
                    columns={changeColumns}
                    onChange={(columns) => {
                        setChangeColumns(columns)
                    }}
                />

                <Group mt={'xs'} position={"right"} spacing={'xs'}>
                    <Button size={'xs'}
                            variant={'default'}
                            onClick={() => {
                                table.resetColumnOrder()
                                table.resetColumnVisibility()
                            }}
                    >Reset</Button>
                    <Button size={'xs'}
                            onClick={() => {
                                table.setColumnOrder(
                                    changeColumns.map(a => a.name)
                                )

                                const visibilityState: VisibilityState = {}
                                changeColumns.forEach((a) => {
                                    visibilityState[a.name] = !!a.selected;
                                })
                                table.setColumnVisibility(visibilityState)
                            }}
                    >Apply</Button>
                </Group>
            </Popover.Dropdown>
        </Popover>
    );
};

export default FCBSMantineTanstackTableActionBarColumns;
