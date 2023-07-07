import React, {FunctionComponent, useMemo} from 'react';
import {Flex, Group, useMantineTheme} from "@mantine/core";
import {ColumnResizeMode, flexRender, Table} from "@tanstack/react-table";
import {SortAscending, SortDescending} from "tabler-icons-react";
import FCBSMantineTanstackTableHeaderMenu
    from "./FCBSMantineTanstackTableHeaderMenu";
import {FCBSMantineTanstackTableStyles} from "../styles/FCBSMantineTanstackTableStyles";

import "./../styles/FCBSMantineTanstackTableStyles.css";

export const SelectColumnId: string = 'fcbs-mantine-tanstack-table-select';

interface OwnProps {
    table: Table<unknown>
    columnResizeMode: ColumnResizeMode
}

type Props = OwnProps;

const FCBSMantineTanstackTableBody: FunctionComponent<Props> = (props) => {
    const {table, columnResizeMode} = props

    const {classes} = FCBSMantineTanstackTableStyles()
    const theme = useMantineTheme()

    const leftPinnedColumnsOffsets: Record<string, number> = useMemo(() => {
        const leftPinnedColumnsOffsets: Record<string, number> = {};
        const headerGroups = table.getLeftHeaderGroups();
        for (let a = 0; a < headerGroups.length; a++) {
            let leftOffset: number = -1
            const headerGroup = headerGroups[a]
            const headerGroupHeaders = headerGroup.headers
            for (let b = 0; b < headerGroupHeaders.length; b++) {
                const headerGroupHeader = headerGroupHeaders[b];
                leftPinnedColumnsOffsets[headerGroupHeader.column.id] = leftOffset
                leftOffset += headerGroupHeader.column.getSize()
            }
        }
        // console.log(`Table.leftPinnedColumnsOffsets : `, leftPinnedColumnsOffsets)
        return leftPinnedColumnsOffsets;
    }, [table.getLeftHeaderGroups(), table.getTotalSize()])
    const rightPinnedColumnsOffsets: Record<string, number> = useMemo(() => {
        const rightPinnedColumnsOffsets: Record<string, number> = {};
        const headerGroups = table.getRightHeaderGroups();
        for (let a = 0; a < headerGroups.length; a++) {
            let rightOffset: number = -1
            const headerGroup = headerGroups[a]
            const headerGroupHeaders = Array.from(headerGroup.headers).reverse()
            for (let b = headerGroupHeaders.length - 1; b >= 0; b--) {
                const headerGroupHeader = headerGroupHeaders[b];
                rightPinnedColumnsOffsets[headerGroupHeader.column.id] = rightOffset
                rightOffset += headerGroupHeader.column.getSize()
            }
        }
        // console.log(`Table.rightPinnedColumnsOffsets : `, rightPinnedColumnsOffsets)
        return rightPinnedColumnsOffsets;
    }, [table.getRightHeaderGroups(), table.getTotalSize()])

    return (
        <table className={classes.table}
               style={{
                   width: table.getCenterTotalSize()
               }}
        >
            <thead>
            {table.getHeaderGroups().map((headerGroup, a) => (
                <tr key={headerGroup.id}>
                    {[
                        ...table.getLeftHeaderGroups()[a].headers,
                        ...table.getCenterHeaderGroups()[a].headers,
                        ...table.getRightHeaderGroups()[a].headers.reverse(),
                    ].map(header => (
                        <th key={header.id}
                            className={classes.th}
                            colSpan={header.colSpan}
                            style={{
                                width: header.getSize(),
                                ...(header.column.getIsPinned() === "left" ? {
                                    position: "sticky",
                                    left: leftPinnedColumnsOffsets[header.column.id],
                                    background: `${theme.colors.gray[1]}`,
                                    zIndex: 2,
                                    borderRight: `solid 1px ${theme.colors.gray[3]}`,
                                } : {}),
                                ...(header.column.getIsPinned() === "right" ? {
                                    position: "sticky",
                                    right: rightPinnedColumnsOffsets[header.column.id],
                                    background: `${theme.colors.gray[1]}`,
                                    zIndex: 2
                                } : {})
                            }}
                        >
                            <Flex
                                gap="xs"
                                justify="space-between"
                                align="flex-start"
                                direction="row"
                                wrap="nowrap"
                            >
                                <Group spacing={4}
                                       sx={{
                                           flexWrap: 'nowrap'
                                       }}>
                                            <span style={
                                                header.column.getCanSort() ? {
                                                    cursor: 'pointer',
                                                    userSelect: 'none'
                                                } : {}
                                            }
                                                  onClick={header.column.getToggleSortingHandler()}
                                            >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </span>
                                    {{
                                        asc: <SortAscending size={theme.fontSizes.md}/>,
                                        desc: <SortDescending size={theme.fontSizes.md}/>,
                                    }[header.column.getIsSorted() as string] ?? null}
                                </Group>

                                {header.column.id !== SelectColumnId &&
                                    <FCBSMantineTanstackTableHeaderMenu header={header}/>
                                }
                            </Flex>
                            <div
                                {...{
                                    onMouseDown: header.getResizeHandler(),
                                    onTouchStart: header.getResizeHandler(),
                                    className: `resizer ${
                                        header.column.getIsResizing() ? 'isResizing' : ''
                                    }`,
                                    style: {
                                        transform:
                                            columnResizeMode === 'onEnd' &&
                                            header.column.getIsResizing()
                                                ? `translateX(${
                                                    table.getState().columnSizingInfo.deltaOffset
                                                }px)`
                                                : '',
                                    },
                                }}
                            />
                        </th>
                    ))}
                </tr>
            ))}
            </thead>
            <tbody>
            {table.getRowModel().rows.map(row => (
                <tr
                    key={row.id}
                    className={classes.tr}
                >
                    {[
                        ...row.getLeftVisibleCells(),
                        ...row.getCenterVisibleCells(),
                        ...row.getRightVisibleCells().reverse()
                    ].map(cell => (
                        <td key={cell.id}
                            className={classes.td}
                            // data-selected-row={row.getIsSelected() ? 'YES': 'NO'}
                            style={{
                                width: cell.column.getSize(),
                                ...(cell.column.getIsPinned() === "left" ? {
                                    position: "sticky",
                                    left: leftPinnedColumnsOffsets[cell.column.id],
                                    background: 'inherit',
                                    zIndex: 1,
                                    borderRight: `solid 1px ${theme.colors.gray[3]}`,
                                } : {}),
                                ...(cell.column.getIsPinned() === "right" ? {
                                    position: "sticky",
                                    right: rightPinnedColumnsOffsets[cell.column.id],
                                    background: 'inherit',
                                    zIndex: 1
                                } : {}),
                                ...(table.options?.meta?.editing?.isCurrentEditRow(row) ? {
                                    overflow: 'visible',
                                    background: theme.colors.grape[0],
                                } : {}),
                                ...(row.getIsSelected() ? {
                                    background: theme.colors.primary[0],
                                } : {})

                            }}
                        >
                            {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                            )}
                        </td>
                    ))}
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default FCBSMantineTanstackTableBody;
