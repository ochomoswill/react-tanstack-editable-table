import React, {MutableRefObject, useMemo, useState} from 'react';
import {
    CellContext,
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    RowData, Table,
    useReactTable
} from "@tanstack/react-table";
import {UseFormReturn} from "react-hook-form";

declare module '@tanstack/react-table' {
    interface TableMeta<TData extends RowData> {
        editing: {
            editRowKey: any,
            setEditRowKey: (editRowKey?: string) => void
            getEditRowData: () => any
            initAddRow: () => void
            initEditRow: (cellContext: CellContext<any, any>) => void
            cancelRowEditing: (cellContext: CellContext<any, any>) => void
            onSave: (e: any) => void
        },
        formInstance: UseFormReturn<any>
        rowKey: string
    }

    interface ColumnMeta {
        editing?: {
            type?: 'text' | 'number' | 'select' | 'radio' | 'checkbox',
            lookup?: {
                dataSource: any
                displayExpr: string
                valueExpr: string
            }
        }
    }
}

// Give our default column cell renderer editing superpowers!
const defaultColumn: Partial<ColumnDef<any>> = {
    cell: ({getValue, row, column, table}) => {
        // console.log('editableRowKey ', table.options.meta?.editing?.editRowKey)
        const rowKey = table.options.meta?.rowKey as string;
        const {register, formState} = table.options.meta?.formInstance;

        const hasError = !!formState?.errors?.[column.id]?.message;

        if (row.original[rowKey] === table.options.meta?.editing?.editRowKey) {


            const inputType = column.columnDef.meta?.editing?.type;

            let registerParameters = undefined;

            let component: any;


            switch (inputType) {
                case 'select':
                    const dataSource = column.columnDef.meta?.editing?.lookup?.dataSource ?? [];
                    const valueExpr = column.columnDef.meta?.editing?.lookup?.valueExpr ?? 'value';
                    const dispExpr = column.columnDef.meta?.editing?.lookup?.displayExpr ?? 'label';

                    component = (
                        <React.Fragment>
                            <select
                                {...register(column.id)}
                                style={{
                                    borderColor: hasError ? 'red' : undefined
                                }}
                            >
                                {
                                    dataSource.map((item: any) => (
                                        <option key={item[valueExpr]} value={item[valueExpr]}>{item[dispExpr]}</option>
                                    ))
                                }
                            </select>
                        </React.Fragment>
                    )
                    break;
                default:
                    if (inputType === 'number') {
                        registerParameters = {
                            valueAsNumber: true
                        }
                    }

                    component = (
                        <React.Fragment>
                            <input
                                {...register(column.id, registerParameters)}
                                type={inputType}
                                style={{
                                    borderColor: hasError ? 'red' : undefined
                                }}
                            />
                        </React.Fragment>
                    )
            }

            return (
                <React.Fragment>
                    {component}

                    {
                        formState?.errors?.[column.id]?.message &&
                        <p style={{color: 'red', fontSize: 12}}>{formState?.errors?.[column.id]?.message}</p>
                    }
                </React.Fragment>
            )

        }

        return getValue()
    },
}

export interface EditableProps {
    columns: any[]
    dataSource: any[]
    formInstance: UseFormReturn<any>
    rowKey: string
    onEditingStart?: () => void
    initAddRow?: () => void
    insertRow?: () => void
    updateRow?: () => void
    // removeRow?: () => void
    cancelRowEditing?: () => void
    tableRef?: MutableRefObject<Table<unknown> | null>
}

export const EditableTable = (props: EditableProps) => {
    const { rowKey, columns, dataSource, formInstance} = props;

    const [editRowKey, setEditRowKey] = useState<any>();
    const [data, setData] = React.useState(dataSource)

    React.useEffect(() => {
        setData(dataSource)
    }, [dataSource])

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
                props?.insertRow && props?.insertRow()
                break;
            case 'edit':
                props?.updateRow && props?.updateRow()
                break;
        }
    }

    const initAddRow = () => {
        setEditRowKey("add-new");

        setData([
            {
                [rowKey]: 'add-new',
            },
            ...data
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
        columns,
        defaultColumn,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        // Provide our updateData function to our table meta
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
            formInstance,
            rowKey
        },
        debugTable: true,
    })

    React.useEffect(() => {
        if (table && props.tableRef && (!props.tableRef.current)) {
            props.tableRef.current = table
            console.log(`props.tableRef.current is set!`)
        }
    }, [table])



    return (
        <div className="p-2">
            <button
                onClick={props?.initAddRow ?? initAddRow}
            >
                add new
            </button>

            <div className="h-2"/>
            <form
                // onSubmit={handleSubmit(onSubmit)}
            >
                <table>
                    <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => {
                                return (
                                    <th key={header.id} colSpan={header.colSpan}>
                                        {header.isPlaceholder ? null : (
                                            <div>
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                                {/*{header.column.getCanFilter() ? (
                                                <div>
                                                    <Filter column={header.column} table={table}/>
                                                </div>
                                            ) : null}*/}
                                            </div>
                                        )}
                                    </th>
                                )
                            })}
                        </tr>
                    ))}
                    </thead>
                    <tbody>
                    {table.getRowModel().rows.map(row => {
                        return (
                            <tr key={row.id}>
                                {row.getVisibleCells().map(cell => {
                                    return (
                                        <td key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    )
                                })}
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
            </form>
        </div>
    );
};
