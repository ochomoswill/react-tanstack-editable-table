import React, {FunctionComponent, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Box, Checkbox, Group, Stack, Text, useMantineTheme} from "@mantine/core";
import {ChevronDown, ChevronUp} from "tabler-icons-react";
import {Table} from "@tanstack/react-table";

export const getSelectableColumns = (table: Table<unknown>): Array<FCBSMantineTanstackTableActionBarColumnsSelectColumn> => {
    const viableColumns = [
        ...table.getLeftLeafColumns(),
        ...table.getCenterLeafColumns(),
        ...table.getRightLeafColumns().reverse()
    ].filter((a) => a.accessorFn)

    return viableColumns
        .map((a, i) => {
            return {
                label: typeof a.columnDef.header === "string" ? a.columnDef.header : a.id,
                name: a.id,
                selected: a.getIsVisible(),
                canMoveUp: i !== 0 && !a.getIsPinned() && !viableColumns[i - 1].getIsPinned(),
                canMoveDown: i !== (viableColumns.length - 1) && !a.getIsPinned() && !viableColumns[i + 1].getIsPinned(),
            }
        })
}

export type FCBSMantineTanstackTableActionBarColumnsSelectColumn = {
    label: string
    name: string
    selected?: boolean
    canMoveUp?: boolean
    canMoveDown?: boolean
}

interface FCBSMantineTanstackTableActionBarColumnsSelectProps {
    columns: Array<FCBSMantineTanstackTableActionBarColumnsSelectColumn>
    onChange: (columns: Array<FCBSMantineTanstackTableActionBarColumnsSelectColumn>) => void

    searchFilter?: string
}

const FCBSMantineTanstackTableActionBarColumnsSelect: FunctionComponent<FCBSMantineTanstackTableActionBarColumnsSelectProps> = (props) => {
    const {searchFilter} = props

    const initialRender = useRef<boolean>(true)

    const areAllColumnsSelected = useCallback((columns: Array<FCBSMantineTanstackTableActionBarColumnsSelectColumn>): boolean => {
        for (let a = 0; a < columns.length; a++) {
            if (!columns[a].selected) {
                return false
            }
        }
        return true
    }, [])

    const theme = useMantineTheme()

    const [columns, setColumns] = useState<Array<FCBSMantineTanstackTableActionBarColumnsSelectColumn>>(props.columns)

    const selectAll = useMemo(() => areAllColumnsSelected(columns), [columns])

    const filteredColumns: Array<FCBSMantineTanstackTableActionBarColumnsSelectColumn> = useMemo(() => {
        return columns
            .filter((a) => {
                if (!searchFilter) {
                    return true
                }
                return a.label.toLowerCase().indexOf(searchFilter.toLowerCase()) !== -1
            })
    }, [columns, searchFilter])

    const handleColumnSelection = useCallback((column: FCBSMantineTanstackTableActionBarColumnsSelectColumn, selected: boolean) => {
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
                        selected
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
                              }}/>
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
                            />
                            <Text size={'xs'}>{column.label}</Text>
                        </Group>
                        <Group spacing={0} sx={(theme) => ({
                            flexWrap: 'nowrap',
                            cursor: "pointer"
                        })}>
                            <ChevronUp size={theme.fontSizes.md}
                                       color={(i === 0 || searchFilter || !column.canMoveUp) ? theme.colors.gray[theme.fn.primaryShade()] : theme.fn.primaryColor()}
                                       onClick={() => {
                                           if (!(i === 0 || searchFilter || !column.canMoveUp)) {
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
                                         color={(i === (columns.length - 1) || searchFilter || !column.canMoveDown) ? theme.colors.gray[theme.fn.primaryShade()] : theme.fn.primaryColor()}
                                         onClick={() => {
                                             if (!(i === (columns.length - 1) || searchFilter || !column.canMoveDown)) {
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
        </Stack>);
};

export default FCBSMantineTanstackTableActionBarColumnsSelect;
