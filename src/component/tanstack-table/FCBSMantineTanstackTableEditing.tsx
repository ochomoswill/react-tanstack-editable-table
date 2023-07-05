import {ColumnDef} from "@tanstack/react-table";
import React from "react";

export const defaultColumn: Partial<ColumnDef<any>> = {
    cell: ({getValue, row, column, table}) => {
        // console.log('editableRowKey ', table.options.meta?.editing?.editRowKey)
        const rowKey = table.options.meta?.rowKey as string;

        const hasError = !!table.options.meta?.formInstance?.formState?.errors?.[column.id]?.message;

        if (row.original[rowKey] === table.options.meta?.editing?.editRowKey && column.columnDef?.meta?.enableEditing) {
            const inputType = column.columnDef.meta?.dataType;

            let registerParameters = undefined;

            let component: any;


            switch (inputType) {
                case 'select':
                    const dataSource = column.columnDef.meta?.lookup?.dataSource ?? [];
                    const valueExpr = column.columnDef.meta?.lookup?.valueExpr ?? 'value';
                    const dispExpr = column.columnDef.meta?.lookup?.displayExpr ?? 'label';

                    component = (
                        <React.Fragment>
                            <select
                                {...table.options.meta?.formInstance?.register(column.id)}
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
                                {...table.options.meta?.formInstance?.register(column.id, registerParameters)}
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
                        table.options.meta?.formInstance?.formState?.errors?.[column.id]?.message &&
                        <p style={{color: 'red', fontSize: 12}}>{table.options.meta.formInstance.formState.errors[column.id].message}</p>
                    }
                </React.Fragment>
            )

        }

        return getValue()
    },
}