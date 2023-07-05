import React, { MutableRefObject, useEffect, useMemo, useRef, useState} from 'react';
import {
    Anchor,
    Box,
    Checkbox,
    Group, Loader, LoadingOverlay, LoadingOverlayProps,
    Stack,
    Text
} from "@mantine/core";
import {
    CellContext,
    ColumnDef, ColumnOrderState, ColumnPinningState,
    ColumnResizeMode,
    getCoreRowModel, InitialTableState,
    PaginationState, Row, RowData, RowSelectionState, SortingState, Table,
    useReactTable, VisibilityState
} from "@tanstack/react-table";
import FCBSMantineTanstackTablePagination
    from "./components/FCBSMantineTanstackTablePagination";
import FCBSMantineTanstackTableBody, {
    SelectColumnId
} from "./components/FCBSMantineTanstackTableBody";
import FCBSMantineTanstackTableActionBar
    , {
    FCBSMantineTanstackTableActionBarConfig
} from "./components/FCBSMantineTanstackTableActionBar";
import {UseFormReturn} from "react-hook-form";
import {defaultColumn} from "@/component/tanstack-table/FCBSMantineTanstackTableEditing.tsx";

declare module '@tanstack/react-table' {
    interface TableMeta<TData extends RowData> {
        editing?: {
            editRowKey: any,
            setEditRowKey: (editRowKey?: string) => void
            getEditRowData: () => any
            initAddRow: () => void
            initEditRow: (cellContext: CellContext<any, any>) => void
            cancelRowEditing: (cellContext: CellContext<any, any>) => void
            onSave: (e: any) => void
        },
        formInstance?: UseFormReturn<any>
        rowKey: string
    }

    interface ColumnMeta {
        enableEditing?: boolean
        dataType?: 'text' | 'number' | 'select' | 'radio' | 'checkbox',
        lookup?: {
            dataSource: any
            displayExpr: string
            valueExpr: string
        }
    }
}

export interface FCBSMantineTanstackTableProps {
    parentId: string
    rowKey: string
    dataSource: Array<unknown>
    columns: Array<ColumnDef<any, any>>
    initialPaginationState: PaginationState
    onPaginationChange: (paginationState: PaginationState) => void
    totalCount: number

    columnResizeMode?: ColumnResizeMode

    rowsSelectable?: boolean
    rowSelectableFn?: (row: Row<any>) => boolean
    rowSelectionActionRender?: (rowSelection: RowSelectionState) => any

    enableSorting?: boolean
    enableMultiSort?: boolean
    initialSortingState?: SortingState
    onSortingChange?: (sortingState: SortingState) => void

    tableRef?: MutableRefObject<Table<unknown> | null>

    isLoading?: boolean
    loaderProps?: Partial<LoadingOverlayProps>

    initialColumnPinningState?: ColumnPinningState

    actionBarConfig?: FCBSMantineTanstackTableActionBarConfig
    editing: {
        formInstance: UseFormReturn<any>
        enableAdd?: boolean
        enableEdit?: boolean
        initAddRow?: () => void
        insertRow?: () => void
        updateRow?: () => void
        cancelRowEditing?: () => void
    }
}

export const FCBSMantineTanstackTable = (props: FCBSMantineTanstackTableProps) => {

    const {parentId, rowKey, dataSource, columns, totalCount, onPaginationChange} = props;
    const isInitialRender = useRef<{
        pagination: boolean
        sorting: boolean
        columns: boolean
    }>({
        pagination: true,
        sorting: true,
        columns: true
    })
    const LOCAL_STORAGE_KEY: string = `${FCBSMantineTanstackTable.name}.${parentId}.state`
    let initialTableState: InitialTableState = {}
    if (parentId) {
        const LOCAL_STORAGE_VALUE = localStorage.getItem(LOCAL_STORAGE_KEY)
        initialTableState = LOCAL_STORAGE_VALUE ? JSON.parse(LOCAL_STORAGE_VALUE) : {}
    }

    const columnResizeMode: ColumnResizeMode = useMemo(() => (props.columnResizeMode ?? 'onChange'), [props.columnResizeMode])

    const [data, setData] = React.useState(dataSource)

    React.useEffect(() => {
        setData(dataSource)
    }, [dataSource])

    const [{pageIndex, pageSize}, setPagination] = React.useState<PaginationState>({
        pageIndex: 0,
        pageSize: initialTableState.pagination && initialTableState.pagination.pageSize ?
            initialTableState.pagination.pageSize : props.initialPaginationState.pageSize
    })
    const pagination = React.useMemo(() => ({pageIndex, pageSize,}), [pageIndex, pageSize])
    const pageCount = useMemo(() => {
        return Math.ceil((totalCount / pageSize))
    }, [pageSize, totalCount])

    const finalColumns: Array<ColumnDef<any, any>> = useMemo(() => {
        if (props.rowsSelectable) {
            return [
                {
                    id: SelectColumnId,
                    header: ({table}) => (
                        <Checkbox
                            checked={table.getIsAllRowsSelected()}
                            indeterminate={table.getIsSomeRowsSelected()}
                            onChange={table.getToggleAllRowsSelectedHandler()}
                            size={'xs'}
                        />
                    ),
                    cell: ({row}) => (
                        <Checkbox
                            checked={row.getIsSelected()}
                            indeterminate={row.getIsSomeSelected()}
                            onChange={row.getToggleSelectedHandler()}
                            disabled={!row.getCanSelect()}
                            size={'xs'}
                        />
                    ),
                    size: 40,
                    enableResizing: false,
                    enableSorting: false,
                    enableMultiSort: false
                },
                ...columns
            ]
        } else {
            return columns
        }
    }, [columns, props.rowsSelectable])
    const initialColumnPinning: ColumnPinningState = useMemo(() => {
        let columnPinningState: ColumnPinningState = props.initialColumnPinningState ?? {}

        if (props.rowsSelectable) {
            columnPinningState = {
                ...columnPinningState,
                left: [
                    SelectColumnId,
                    ...(columnPinningState.left ?? [])
                ]
            }
        }

        return columnPinningState
    }, [props.rowsSelectable, props.initialColumnPinningState])

    const [rowSelection, setRowSelection] = React.useState<RowSelectionState>(initialTableState.rowSelection ?? {})
    const rowSelectionCount: number = useMemo(() => Object.keys(rowSelection).length, [rowSelection])

    const [sorting, setSorting] = React.useState<SortingState>(initialTableState.sorting ? initialTableState.sorting : (props.initialSortingState ?? []))

    const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(initialTableState.columnOrder ?? [])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(initialTableState.columnVisibility ?? {})

    // EDITING
    const [editRowKey, setEditRowKey] = useState<any>();


    const tableMode = useMemo(() => {
        if(!!editRowKey){
            switch (editRowKey){
                case 'add-new':
                    return 'add';
                default:
                    return 'edit';
            }
        }
        return 'view'
    }, [editRowKey])


    const onSave = (e) => {
        console.log('@onSave ', tableMode);
        e.preventDefault();
        switch (tableMode) {
            case 'add':
                props?.editing?.insertRow && props?.editing?.insertRow()
                break;
            case 'edit':
                props?.editing?.updateRow && props?.editing?.updateRow()
                break;
        }
    }

    const initAddRow = () => {
        setEditRowKey("add-new");

        setData([
            {
                [rowKey]: 'add-new',
            },
            ...dataSource
        ])

        if (table.options.meta?.formInstance) {
            table.options.meta.formInstance.reset({
                [rowKey]: 'add-new',
            },)
        }

    }

    const initEditRow = (cellContext: CellContext<any, any>) => {
        setEditRowKey(cellContext.row.original[rowKey]);

        if (cellContext.table.options.meta?.formInstance) {
            cellContext.table.options.meta.formInstance.reset({
                ...cellContext.row.original
            })
        }
    }
    const cancelRowEditing = (cellContext: CellContext<any, any>) => {
        if(cellContext.row.original[rowKey] === 'add-new') {
            const oldData = [...cellContext.table.options.data];

            if(cellContext.row.index > -1) {
                oldData.splice(cellContext.row.index, 1);
                setData(oldData);
            }
        }
        setEditRowKey(undefined)
    }

    const getEditRowData = () => {
        const oldData = [...table.options.data];

        const foundRecord = oldData.find((item) => item[rowKey] === editRowKey)

        return foundRecord
    }

    const table = useReactTable({
        data,
        columns: finalColumns as ColumnDef<unknown, any>[],
        defaultColumn,
        meta: {
            editing: {
                editRowKey,
                setEditRowKey,
                getEditRowData,
                initAddRow,
                initEditRow,
                cancelRowEditing,
                onSave
            },
            formInstance: props?.editing?.formInstance,
            rowKey
        },
        getCoreRowModel: getCoreRowModel(),
        debugTable: true,
        debugHeaders: true,
        debugColumns: true,

        columnResizeMode,
        pageCount,
        initialState: {
            columnPinning: initialColumnPinning,
            ...initialTableState
        },
        state: {
            pagination,
            rowSelection,
            sorting,
            columnOrder,
            columnVisibility
        },
        onPaginationChange: setPagination,
        manualPagination: true,

        enableRowSelection: props.rowSelectableFn ?? props.rowsSelectable,
        onRowSelectionChange: setRowSelection,

        enableSorting: !!props.enableSorting,
        enableMultiSort: !!props.enableMultiSort,
        onSortingChange: setSorting,
        manualSorting: true,

        onColumnOrderChange: setColumnOrder,

        onColumnVisibilityChange: setColumnVisibility
    })
    if (props.tableRef && (props.tableRef.current === null)) {
        props.tableRef.current = table
        console.log(`props.tableRef.current is set!`)
    }

    useEffect(() => {
        if (parentId) {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(table.getState()))
        }
    }, [table.getState()]);

    useEffect(() => {
        if (!isInitialRender.current.pagination) {
            onPaginationChange(pagination)
        }
        isInitialRender.current.pagination = false
    }, [pagination]);

    useEffect(() => {
        if (!isInitialRender.current.sorting) {
            if (props.onSortingChange) {
                props.onSortingChange(sorting)
            }
        }
        isInitialRender.current.sorting = false
    }, [sorting]);

    useEffect(() => {
        if (!isInitialRender.current.columns) {
            if (props.actionBarConfig?.onColumns) {
                props.actionBarConfig.onColumns(columnOrder, columnVisibility)
            }
        }
        isInitialRender.current.columns = false
    }, [columnOrder, columnVisibility]);





    return (
        <Stack sx={(theme) => ({
            width: '100%',
            maxWidth: '100%',
            height: '100%',
            maxHeight: '100%',

            position: 'relative'
        })} spacing={0}>
            {props.isLoading &&
                <LoadingOverlay visible={true}
                                overlayBlur={1}
                                loader={
                                    <Stack align={'center'}>
                                        <Loader/>
                                        <Text size={'xs'}>Loading table data...</Text>
                                    </Stack>
                                }
                                {...props.loaderProps}
                />
            }

            <Box sx={(theme) => ({
                borderBottom: `solid 1px ${theme.colors.gray[3]}`,
            })} p={4}>
                <FCBSMantineTanstackTableActionBar
                    table={table}
                    actionBarConfig={props.actionBarConfig}
                    isSortingEnabled={!!props.enableSorting}
                    isMultiSortEnabled={!!props.enableMultiSort}
                    editing={props?.editing}
                    initAddRow={initAddRow}
                />
            </Box>

            {rowSelectionCount > 0 &&
                <Box sx={(theme) => ({
                    borderBottom: `solid 1px ${theme.colors.gray[3]}`,
                    background: theme.white,
                })} p={4}>
                    <Group>
                        <Text>{rowSelectionCount} record{rowSelectionCount > 1 ? 's' : ''} selected</Text>
                        {props.rowSelectionActionRender && props.rowSelectionActionRender(rowSelection)}
                    </Group>
                </Box>
            }

            <Box sx={(theme) => ({
                flexGrow: 1,
                overflowY: "auto",
                background: theme.white,
            })}
            >
                <FCBSMantineTanstackTableBody table={table}
                                              columnResizeMode={columnResizeMode}/>
            </Box>
            <Group sx={(theme) => ({
                borderTop: `solid 1px ${theme.colors.gray[3]}`,
            })} position={"apart"} p={4}
            >
                <Group>
                    <Group sx={(theme) => ({
                        flexWrap: 'nowrap'
                    })} spacing={0}>
                        <Text>Filter : </Text>
                        <Anchor href={"#"}>
                            View
                        </Anchor>
                    </Group>
                    <Group sx={(theme) => ({
                        flexWrap: 'nowrap'
                    })} spacing={0}>
                        <Text>Sorting : </Text>
                        <Anchor href={"#"}>
                            View
                        </Anchor>
                    </Group>
                    <Group sx={(theme) => ({
                        flexWrap: 'nowrap'
                    })} spacing={0}>
                        <Text>Visible Columns : </Text>
                        <Text>{table.getVisibleLeafColumns().length} of {table.getAllLeafColumns().length}</Text>
                    </Group>
                </Group>
                <Group>
                    <FCBSMantineTanstackTablePagination table={table}
                                                        totalCount={totalCount}
                    />
                </Group>
            </Group>
        </Stack>
    );
};