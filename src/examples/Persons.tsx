import React, {useRef} from 'react'
import {ColumnDef, Table,} from '@tanstack/react-table'
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {makeData, Person} from "../makeData.ts";
import {EditableTable} from "../component/EditableTable.tsx";

const PersonSchema = z.object({
    personId: z.any(),
    firstName: z.string().trim().min(1, 'Required'),
    lastName: z.string().trim().min(1, 'Required'),
    age: z.number(),
    visits: z.number(),
    progress: z.number(),
    status: z.union([
        z.literal("relationship"),
        z.literal("complicated"),
        z.literal("single")
    ]),
});

type FormValues = z.infer<typeof PersonSchema>;


const initialFormState: Partial<FormValues> = {};

export function Persons() {
    const formInstance = useForm<FormValues>({
        defaultValues: {...initialFormState},
        resolver: zodResolver(PersonSchema)
    });

    const [data, setData] = React.useState(() => makeData())

    const {handleSubmit} = formInstance;

    const reactTableRef = useRef<Table<any>>();

    const insertRow = async (formData: any) => {
        try {

            console.log('@insertRow', formData)

            /*setData([
                formData,
                ...data
            ])*/

            reactTableRef.current?.options?.meta?.editing?.setEditRowKey(undefined)
        } catch (e) {
            console.error('@form submit Error ', e);
        }
    }

    const updateRow = async (formData: any) => {
        try {
            console.log('@updateRow', formData)
            const newData = [...data];
            /*const findIndex = newData.findIndex((item) => item.personId === editRowKey);

            if (findIndex > -1) {
                newData.splice(findIndex, 1, formData);
                setData(newData);
            }*/

            reactTableRef.current?.options?.meta?.editing?.setEditRowKey(undefined)
        } catch (e) {
            console.error('@form submit Error ', e);
        }

    }

    const columns = React.useMemo<ColumnDef<Person>[]>(
        () => [
            {
                id: 'firstName',
                accessorKey: 'firstName',
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row.lastName,
                id: 'lastName',
                header: () => <span>Last Name</span>,
                footer: props => props.column.id,
            },
            {
                id: 'age',
                accessorKey: 'age',
                header: () => 'Age',
                footer: props => props.column.id,
                meta: {
                    editing: {
                        type: 'number'
                    }
                }
            },
            {
                id: 'visits',
                accessorKey: 'visits',
                header: () => <span>Visits</span>,
                footer: props => props.column.id,
                meta: {
                    editing: {
                        type: 'number'
                    }
                }
            },
            {
                id: 'status',
                accessorKey: 'status',
                header: 'Status',
                footer: props => props.column.id,
                meta: {
                    editing: {
                        type: 'select',
                        lookup: {
                            dataSource: [
                                {item: 'single', itemLabel: 'Single'},
                                {item: 'relationship', itemLabel: 'Relationship'},
                                {item: 'complicated', itemLabel: 'Complicated'},
                            ],
                            valueExpr: 'item',
                            displayExpr: 'itemLabel'
                        }
                    }
                }
            },
            {
                id: 'progress',
                accessorKey: 'progress',
                header: 'Profile Progress',
                footer: props => props.column.id,
                meta: {
                    editing: {
                        type: 'number'
                    }
                }
            },
            {
                id: 'actions',
                header: 'Actions',
                cell: (cellContext) => {

                    const isEditMode = cellContext.table.options?.meta?.editing?.editRowKey && cellContext.row.original.personId === cellContext.table.options?.meta?.editing?.editRowKey;

                    if(cellContext.table.options && cellContext.table.options?.meta && cellContext.table.options?.meta?.editing){
                        return (
                            <div>

                                {
                                    !isEditMode && (
                                        <button
                                            type={'button'}
                                            disabled={isEditMode}
                                            onClick={() => cellContext.table.options?.meta?.editing.initEditRow(cellContext)}
                                        >
                                            Edit
                                        </button>
                                    )
                                }

                                {
                                    isEditMode && (
                                        <button
                                            // onClick={onEditSave}
                                            onClick={(e) => cellContext.table.options?.meta?.editing.onSave(e)}
                                        >
                                            Save
                                        </button>
                                    )
                                }

                                <button
                                    type={'button'}
                                    onClick={() => cellContext.table.options?.meta?.editing.cancelRowEditing(cellContext)}
                                >
                                    Cancel
                                </button>
                            </div>
                        )
                    }

                },
                enablePinning: false,
                enableHiding: false,
                enableResizing: false,
                enableSorting: false,
                enableMultiSort: false,
                enableGrouping: false,
                enableColumnFilter: false,
                enableGlobalFilter: false
            },
        ],
        []
    )


    return (
        <EditableTable
            columns={columns}
            dataSource={data}
            rowKey={'personId'}
            formInstance={formInstance}
            insertRow={handleSubmit(insertRow)}
            updateRow={handleSubmit(updateRow)}
            tableRef={reactTableRef}
        />
    )
}


