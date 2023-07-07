import React, {FunctionComponent, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Box, Checkbox, Group, Select, Stack, Text, useMantineTheme} from "@mantine/core";
import {ChevronDown, ChevronUp} from "tabler-icons-react";
import {Column, Table} from "@tanstack/react-table";

export const getSortingColumns = (table: Table<unknown>): Array<FCBSMantineTanstackTableActionBarSortingSelectColumn> => {
    const viableColumns = [
        ...table.getLeftLeafColumns(),
        ...table.getCenterLeafColumns(),
        ...table.getRightLeafColumns().reverse()
    ].filter((a) => a.accessorFn && a.getCanSort())

    return [
        ...table.getState().sorting
            .map((a) => viableColumns.find(b => b.id === a.id)),
        ...viableColumns.filter((a) => !a.getIsSorted())
    ].map((a) => {
        const col: Column<unknown> = a as Column<unknown>;
        return {
            label: typeof col.columnDef.header === "string" ? col.columnDef.header : col.id,
            name: col.id,
            selected: !!col.getIsSorted(),
            sort: col.getIsSorted() === 'asc' ? 'ASC' : col.getIsSorted() === 'desc' ? 'DESC' : ''
        }
    })
}

export type FCBSMantineTanstackTableActionBarSortingSelectSort = 'ASC' | 'DESC' | ''

export type FCBSMantineTanstackTableActionBarSortingSelectColumn = {
    label: string
    name: string
    selected?: boolean
    sort?: FCBSMantineTanstackTableActionBarSortingSelectSort
}

export interface FCBSMantineTanstackTableActionBarSortingSelectProps {
    columns: Array<FCBSMantineTanstackTableActionBarSortingSelectColumn>
    onChange: (columns: Array<FCBSMantineTanstackTableActionBarSortingSelectColumn>) => void

    searchFilter?: string
    enableMultiple?: boolean
}

const FCBSMantineTanstackTableActionBarSortingSelect: FunctionComponent<FCBSMantineTanstackTableActionBarSortingSelectProps> = (props) => {
    const {searchFilter, enableMultiple} = props

    const initialRender = useRef<boolean>(true)

    const areAllColumnsSelected = useCallback((columns: Array<FCBSMantineTanstackTableActionBarSortingSelectColumn>): boolean => {
        for (let a = 0; a < columns.length; a++) {
            if (!columns[a].selected) {
                return false
            }
        }
        return true
    }, [])

    const theme = useMantineTheme()

    const [columns, setColumns] = useState<Array<FCBSMantineTanstackTableActionBarSortingSelectColumn>>(props.columns)

    const selectAll = useMemo(() => areAllColumnsSelected(columns), [columns])

    const filteredColumns: Array<FCBSMantineTanstackTableActionBarSortingSelectColumn> = useMemo(() => {
        return columns
            .filter((a) => {
                if (!searchFilter) {
                    return true
                }
                return a.label.toLowerCase().indexOf(searchFilter.toLowerCase()) !== -1
            })
    }, [columns, searchFilter])

    const handleColumnSelection = useCallback((column: FCBSMantineTanstackTableActionBarSortingSelectColumn, selected: boolean) => {
        let index = -1

        for (let a = 0; a < columns.length; a++) {
            if (columns[a].name === column.name) {
                index = a
                break
            }
        }

        setColumns(
            columns.map((a, i) => {
                if (i !== index) {
                    return a
                } else {
                    return {
                        ...a,
                        selected,
                        sort: !selected ? '' : a.sort
                    }
                }
            })
        )
    }, [columns])

    const handleColumnSort = useCallback((column: FCBSMantineTanstackTableActionBarSortingSelectColumn, sort: FCBSMantineTanstackTableActionBarSortingSelectSort) => {
        let index = -1

        for (let a = 0; a < columns.length; a++) {
            if (columns[a].name === column.name) {
                index = a
                break
            }
        }

        setColumns(
            columns.map((a, i) => {
                if (i !== index) {
                    return a
                } else {
                    return {
                        ...a,
                        sort
                    }
                }
            })
        )
    }, [columns])

    useEffect(() => {
        setColumns(props.columns)
    }, [props.columns]);

    useEffect(() => {
        if (!initialRender.current) {
            props.onChange(columns)
        }
        initialRender.current = false
    }, [columns])

    return (
        <Stack sx={(theme) => ({
            border: `solid 1px ${theme.other.borders.grey}`,
            flexGrow: 1,
            overflowY: 'auto'
        })} spacing={0} p={0}
        >
            <Group sx={(theme) => ({
                background: theme.other.backgrounds.grey[0],
                borderBottom: `solid 1px ${theme.other.borders.grey}`
            })} position={"apart"} p={4}>
                <Group spacing={8}>
                    <Checkbox size={'xs'}
                              checked={selectAll}
                              onChange={(e) => {
                                  setColumns(
                                      columns.map(a => ({
                                          ...a,
                                          selected: e.currentTarget.checked
                                      }))
                                  )
                              }}
                              disabled={!enableMultiple}
                    />
                    <Text size={'xs'}>Column Name</Text>
                </Group>
                <Text size={'xs'}>Move</Text>
            </Group>
            <Box sx={(theme) => ({
                maxHeight: 300,
                width: '100%',
                flexGrow: 1,
                overflowY: 'auto'
            })}
            >
                {filteredColumns.map((column, i) => (
                    <Group key={column.name}
                           p={4}
                           position={"apart"}
                           sx={(theme) => ({
                               flexWrap: 'nowrap'
                           })}>
                        <Group spacing={8} sx={(theme) => ({
                            color: theme.other.colors.turquoise,
                            flexWrap: 'nowrap'
                        })}>
                            <Checkbox size={'xs'}
                                      checked={!!column.selected}
                                      onChange={(e) => {
                                          handleColumnSelection(column, e.currentTarget.checked)
                                      }}
                                      disabled={
                                          !enableMultiple &&
                                          (columns.filter(a => a.selected).length === 1) &&
                                          (columns.filter(a => a.selected)[0].name !== column.name)
                                      }
                            />
                            <Text size={'xs'}>{column.label}</Text>
                        </Group>
                        <Group spacing={0} sx={(theme) => ({
                            flexWrap: 'nowrap',
                            cursor: "pointer"
                        })}>
                            <Select
                                placeholder="Sort"
                                disabled={!column.selected}
                                data={[
                                    {value: '', label: 'None'},
                                    {value: 'ASC', label: 'Ascending'},
                                    {value: 'DESC', label: 'Descending'}
                                ]}
                                value={column.sort ? column.sort : ''}
                                onChange={(value) => {
                                    handleColumnSort(column, value as FCBSMantineTanstackTableActionBarSortingSelectSort)
                                }}
                                size={'xs'}
                                sx={(theme) => ({
                                    width: 120
                                })}
                                mr={'xs'}
                            />
                            <ChevronUp size={theme.fontSizes.md}
                                       color={(i === 0 || searchFilter) ? theme.colors.gray[theme.fn.primaryShade()] : theme.fn.primaryColor()}
                                       onClick={() => {
                                           if (!(i === 0 || searchFilter)) {
                                               const columnsCopy = Array.from(columns)
                                               const srcColumn = {...columnsCopy[i]}
                                               const destColumn = {...columnsCopy[i - 1]}
                                               columnsCopy[i - 1] = srcColumn
                                               columnsCopy[i] = destColumn
                                               setColumns(columnsCopy)
                                           }
                                       }}
                            />
                            <ChevronDown size={theme.fontSizes.md}
                                         color={(i === (columns.length - 1) || searchFilter) ? theme.colors.gray[theme.fn.primaryShade()] : theme.fn.primaryColor()}
                                         onClick={() => {
                                             if (!(i === (columns.length - 1) || searchFilter)) {
                                                 const columnsCopy = Array.from(columns)
                                                 const srcColumn = {...columnsCopy[i]}
                                                 const destColumn = {...columnsCopy[i + 1]}
                                                 columnsCopy[i + 1] = srcColumn
                                                 columnsCopy[i] = destColumn
                                                 setColumns(columnsCopy)
                                             }
                                         }}
                            />
                        </Group>
                    </Group>
                ))}
            </Box>
        </Stack>
    );
};

export default FCBSMantineTanstackTableActionBarSortingSelect;
