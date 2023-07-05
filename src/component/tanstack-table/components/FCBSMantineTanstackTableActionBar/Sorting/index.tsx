import React, {FunctionComponent, useEffect, useMemo, useState} from 'react';
import {Column, Table} from "@tanstack/react-table";
import {ActionIcon, Button, Divider, Group, Popover, Text, TextInput, useMantineTheme} from "@mantine/core";
import {IconArrowsSort} from "@tabler/icons-react";
import {Search, X} from "tabler-icons-react";
import FCBSMantineTanstackTableActionBarSortingSelect
    , {
    FCBSMantineTanstackTableActionBarSortingSelectColumn, getSortingColumns
} from "./Select";

export interface FCBSMantineTanstackTableActionBarSortingProps {
    table: Table<unknown>
    enableMultiSort: boolean
}

const FCBSMantineTanstackTableActionBarSorting: FunctionComponent<FCBSMantineTanstackTableActionBarSortingProps> = (props) => {
    const {table, enableMultiSort} = props

    const [opened, setOpened] = useState<boolean>(false)
    const theme = useMantineTheme()

    const [searchFilter, setSearchFilter] = useState<string>('')

    const columns: Array<FCBSMantineTanstackTableActionBarSortingSelectColumn> = useMemo(() => {
        return getSortingColumns(table)
    }, [table.getState()])

    const [changeColumns, setChangeColumns] = useState<Array<FCBSMantineTanstackTableActionBarSortingSelectColumn>>(columns);

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
                    leftIcon={<IconArrowsSort size={theme.fontSizes.md}
                                              color={theme.colors.yellow[theme.fn.primaryShade()]}/>}
                    size={'xs'}
                    onClick={() => {
                        setOpened(!opened)
                    }}
                >Sort</Button>
            </Popover.Target>
            <Popover.Dropdown sx={(theme) => ({
                minWidth: 400,
                maxWidth: 500,
                [theme.fn.smallerThan('sm')]: {
                    maxWidth: '100%',
                }
            })}>
                <Group position={"apart"}>
                    <Group spacing={4}>
                        <IconArrowsSort size={theme.fontSizes.sm}
                                        color={theme.colors.yellow[theme.fn.primaryShade()]}/>
                        <Text color={'primary'}>Sort Columns</Text>
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

                <FCBSMantineTanstackTableActionBarSortingSelect
                    searchFilter={searchFilter}
                    columns={changeColumns}
                    onChange={(columns) => {
                        setChangeColumns(columns)
                    }}
                    enableMultiple={enableMultiSort}
                />

                <Group mt={'xs'} position={"right"} spacing={'xs'}>
                    <Button size={'xs'}
                            variant={'default'}
                            onClick={() => {
                                table.resetSorting()
                            }}
                    >Reset</Button>
                    <Button size={'xs'}
                            onClick={() => {
                                // {id: 'company', desc: false}
                                table.setSorting(
                                    changeColumns
                                        .filter((a) => a.selected && a.sort)
                                        .map(a => ({
                                            id: a.name,
                                            desc: a.sort === "DESC"
                                        }))
                                )
                            }}
                    >Apply</Button>
                </Group>
            </Popover.Dropdown>
        </Popover>
    );
};

export default FCBSMantineTanstackTableActionBarSorting;
