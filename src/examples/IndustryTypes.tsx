import React, {useEffect, useRef} from 'react'

import {ColumnDef, Table,} from '@tanstack/react-table'
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Person} from "../makeData.ts";
import {EditableTable} from "../component/EditableTable.tsx";

/*{
    "bank_id" : 28,
    "bank_code" : "035",
    "bank_name" : "African Banking Corporation",
    "country" : "Kenya",
    "status" : "Active",
    "date_created" : "2021-11-01 09:08:39",
    "date_modified" : "2021-11-01 09:08:39"
}*/

const RowSchema = z.object({
    bank_id: z.any(),
    bank_code: z.string().trim().min(1, 'Required'),
    bank_name: z.string().trim().min(1, 'Required'),
    country: z.string().trim().min(1, 'Required'),
    status: z.union([
        z.literal("Active"),
        z.literal("Inactive")
    ])
});

type FormValues = z.infer<typeof RowSchema>;


const initialFormState: Partial<FormValues> = {};


const getAuthHeader = () => {
    return {
        Authorization: 'LTFMOjphNGVhMGE4MWJkNDY4MmEyZmNmMWU3YjNhM2QxYWE3ZmRjMmJiYjg5MjYzMzYzMmIyMDhkMTYyOGEyMDA0ZGE5OjpNQUlOX1BPUlRBTA',
        RequestReference: 'lokknnjjj'
    }
}

const API_URL = `https://demo.bng.africa/api/rest/banks`

export function IndustryTypes() {
    const TABLE_ROW_KEY= 'bank_id';

    const formInstance = useForm<FormValues>({
        defaultValues: {...initialFormState},
        resolver: zodResolver(RowSchema)
    });

    const [data, setData] = React.useState([])

    useEffect(() => {
        fetchIndustryTypes();
    }, []);

    const fetchIndustryTypes = async () => {
        try {
            const response = await fetch(`${API_URL}/?page=-1`, {
                headers: getAuthHeader()
            });
            if (response.ok) {
                const responseData = await response.json();

                console.log('@data ', responseData);
                setData(responseData);
            } else {
                console.error('Error fetching contract types:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching contract types:', error);
        }
    };

    const {handleSubmit} = formInstance;

    const reactTableRef = useRef<Table<any>>();

    const insertRow = async (formData: any) => {
        try {

            console.log('@insertRow', formData)

            const {bank_id, ...restFormData} = formData;

            fetch(`${API_URL}/`, {
                method: 'PUT',
                headers: getAuthHeader(),
                body: JSON.stringify(restFormData),
            })
                .then(response => response.text())
                .then(result => {


                    console.log(result);
                    fetchIndustryTypes();


                })
                .catch(error => console.log('error', error));

            reactTableRef.current?.options?.meta?.editing?.setEditRowKey(undefined)
        } catch (e) {
            console.error('@form submit Error ', e);
        }
    }

    const updateRow = async (formData: any) => {
        try {
            console.log('@updateRow', formData)
            const newData = [...data];
            const oldData = reactTableRef.current?.options?.meta?.editing?.getEditRowData();

            console.log({
                newData,
                oldData
            })


            fetch(`${API_URL}/${oldData[TABLE_ROW_KEY]}`, {
                method: 'PATCH',
                headers: getAuthHeader(),
                body: JSON.stringify(formData),
            })
                .then(response => response.text())
                .then(result => {


                    console.log(result);
                    fetchIndustryTypes();
                })
                .catch(error => console.log('error', error));
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
                id: 'bank_code',
                header: 'Code',
                accessorKey: 'bank_code',
                footer: props => props.column.id,
            },
            {
                id: 'bank_name',
                header: 'Name',
                accessorKey: 'bank_name',
                footer: props => props.column.id,
            },
            {
                id: 'country',
                header: 'Country',
                accessorKey: 'country',
                footer: props => props.column.id,
            },
            {
                id: 'status',
                header: 'Status',
                accessorKey: 'status',
                footer: props => props.column.id,
                meta: {
                    editing:{
                        type: 'select',
                        lookup: {
                            dataSource: [
                                {item: 'Active'},
                                {item: 'Inactive'},
                            ],
                            displayExpr: 'item',
                            valueExpr: 'item'
                        }
                    }
                }
            },
            {
                id: 'actions',
                header: 'Actions',
                cell: (cellContext) => {

                    const isEditMode = cellContext.table.options?.meta?.editing?.editRowKey && cellContext.row.original[TABLE_ROW_KEY] === cellContext.table.options?.meta?.editing?.editRowKey;

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
            rowKey={TABLE_ROW_KEY}
            formInstance={formInstance}
            insertRow={handleSubmit(insertRow)}
            updateRow={handleSubmit(updateRow)}
            tableRef={reactTableRef}
        />
    )
}


