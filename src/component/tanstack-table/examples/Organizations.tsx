import React, {FunctionComponent, MutableRefObject, useCallback, useMemo, useRef, useState} from 'react';

/*import SampleOrganizations from "@/lib/mantine/tanstack-table/sample/test-data.json"*/
import {createColumnHelper, PaginationState, Row, SortingState, Table} from "@tanstack/react-table"
import {ActionIcon, Badge, Button, Group, Stack, useMantineTheme} from "@mantine/core";
import {IconBolt, IconEdit, IconEye, IconPower, IconTrash} from "@tabler/icons-react";
import {FCBSMantineTanstackTable} from "../index.tsx";

type Organization = {
    "guid": string
    "isActive": boolean
    "company": string
    "email": string
    "phone": string
    "address": string
    "registered": string
    "latitude": number
    "longitude": number
}

const data: Array<Organization> = [
    {
        "guid": "ab5f4e18-3781-4e8f-b342-5d9828e94b39",
        "isActive": true,
        "company": "ABC Corporation",
        "email": "abc@example.com",
        "phone": "+1 123-456-7890",
        "address": "123 Main Street, Anytown, USA",
        "registered": "2022-03-15",
        "latitude": 37.7749,
        "longitude": -122.4194
    },
    {
        "guid": "c7fde9a3-642e-4c7f-a9b9-8d8a0ae4be22",
        "isActive": false,
        "company": "XYZ Industries",
        "email": "xyz@example.com",
        "phone": "+1 987-654-3210",
        "address": "456 Elm Avenue, Anycity, USA",
        "registered": "2021-09-30",
        "latitude": 40.7128,
        "longitude": -74.0060
    },
    {
        "guid": "e9f6b283-9df8-4e85-8927-7a2d688a2b7a",
        "isActive": true,
        "company": "123 Corporation",
        "email": "123@example.com",
        "phone": "+1 555-123-4567",
        "address": "789 Oak Lane, Anyvillage, USA",
        "registered": "2023-01-20",
        "latitude": 34.0522,
        "longitude": -118.2437
    },
    {
        "guid": "2c6d789c-52d9-4ab9-88a2-6c94f21df26d",
        "isActive": true,
        "company": "XYZ Corp",
        "email": "xyzcorp@example.com",
        "phone": "+1 111-222-3333",
        "address": "555 Pine Street, Anycity, USA",
        "registered": "2022-07-01",
        "latitude": 39.7392,
        "longitude": -104.9903
    },
    {
        "guid": "f853a16b-8a47-4cc9-98e9-3e94f05b5017",
        "isActive": false,
        "company": "Sample Company",
        "email": "sample@example.com",
        "phone": "+1 444-555-6666",
        "address": "999 Maple Avenue, Anytown, USA",
        "registered": "2023-04-10",
        "latitude": 41.8781,
        "longitude": -87.6298
    }
]

const columnHelper = createColumnHelper<Organization>()

interface OwnProps {

}

type Props = OwnProps;

const OrganizationsListPage: FunctionComponent<Props> = (props) => {
    const tableRef: MutableRefObject<Table<unknown> | null> = useRef(null)

    const [paginationState, setPaginationState] =
        useState<PaginationState>({
            pageIndex: 0,
            pageSize: 25
        })
    const paginatedData = useMemo(() => {
        return data.slice(paginationState.pageIndex * paginationState.pageSize, (paginationState.pageIndex + 1) * paginationState.pageSize)
    }, [paginationState, data])

    const [sorting, setSorting] = React.useState<SortingState>([
        /*{id: 'company', desc: true},
        {id: 'phone', desc: true},*/
    ])

    const [loading, setLoading] = useState(false)
    const simulateLoading = useCallback((seconds: number = 3) => {
        setLoading(true)

        setTimeout(() => {
            setLoading(false)
        }, seconds * 1000)
    }, [])

    const theme = useMantineTheme()
    const columns = useMemo(() => {
        return [
            columnHelper.accessor('guid', {
                header: 'GUID',
            }),
            columnHelper.accessor('company', {
                header: 'Organization Name',
            }),
            columnHelper.accessor('phone', {
                header: 'Organization Phone',
            }),
            columnHelper.accessor('email', {
                header: 'Organization Email Address',
                minSize: 200,
            }),
            columnHelper.accessor('address', {
                header: 'Organization Physical Address',
                minSize: 220
            }),
            columnHelper.accessor('registered', {
                header: 'Onboard Date',
            }),
            columnHelper.accessor('isActive', {
                header: 'Status',
                cell: (props) => {
                    const {getValue} = props;
                    return getValue() ?
                        <Badge color="teal" size="md" radius="xs">ACTIVE</Badge> :
                        <Badge color="red" size="md" radius="xs">INACTIVE</Badge>
                }
            }),
            columnHelper.accessor('latitude', {
                header: 'Latitude',
            }),
            columnHelper.accessor('longitude', {
                header: 'Longitude',
            }),
            columnHelper.display({
                id: 'actions',
                header: (props) => {
                    const {header, table, column} = props
                    return 'Actions'
                },
                cell: (props) => {
                    const {table, getValue, renderValue, cell, column, row} = props
                    return (
                        <Group spacing={'xs'}>
                            <ActionIcon color="teal"
                                        radius={"md"}
                                        variant="light"
                                        title={'View record'}
                            >
                                <IconEye size={theme.fontSizes.sm}/>
                            </ActionIcon>
                            <ActionIcon color="grape"
                                        radius={"md"}
                                        variant="light"
                                        title={'Edit record'}
                            >
                                <IconEdit size={theme.fontSizes.sm}/>
                            </ActionIcon>
                            {row.original.isActive &&
                                <ActionIcon color="red"
                                            radius={"md"}
                                            variant="light"
                                            title={'Inactivate'}
                                >
                                    <IconPower size={theme.fontSizes.sm}/>
                                </ActionIcon>
                            }
                            {!row.original.isActive &&
                                <ActionIcon color="green"
                                            radius={"md"}
                                            variant="light"
                                            title={'Activate'}
                                >
                                    <IconBolt size={theme.fontSizes.sm}/>
                                </ActionIcon>
                            }
                        </Group>
                    )
                },
                enablePinning: false,
                enableHiding: false,
                enableResizing: false,
                enableSorting: false,
                enableMultiSort: false,
                enableGrouping: false,
                enableColumnFilter: false,
                enableGlobalFilter: false,
                size: 125,
            })
        ]
    }, [theme])

    console.log('@columns ', columns);

    return (
        /*<Stack style={{
            height: '100%'
        }}>*/
            <FCBSMantineTanstackTable
                parentId={'organizationId'}
                dataSource={paginatedData}
                columns={columns}
                initialPaginationState={paginationState}
                onPaginationChange={(paginationState) => {
                    simulateLoading(1)
                    setPaginationState(paginationState)
                }}
                totalCount={data.length}

                columnResizeMode={"onChange"}

                rowsSelectable={true}
                rowSelectableFn={(row: Row<Organization>) => row.original.isActive}
                rowSelectionActionRender={(rowSelection) => (
                    <React.Fragment>
                        <Button leftIcon={<IconTrash size={theme.fontSizes.sm}/>}
                                color={'red'}
                                radius={'sm'}
                                size={'xs'}>Delete</Button>
                        <Button leftIcon={<IconEdit size={theme.fontSizes.sm}/>}
                                variant={'default'}
                                radius={'sm'}
                                size={'xs'}>Edit</Button>
                    </React.Fragment>
                )}

                enableSorting={true}
                enableMultiSort={true}
                initialSortingState={sorting}
                onSortingChange={(sortingState) => {
                    simulateLoading()
                    console.log(sortingState)
                }}

                tableRef={tableRef}

                isLoading={loading}
                loaderProps={{
                    overlayBlur: 2
                }}

                initialColumnPinningState={{
                    left: ['guid'],
                    right: ['actions']
                }}

                actionBarConfig={{
                    onAdd: () => {
                        alert('Table.onAdd event!')
                    },
                    onRefresh: () => {
                        alert('Table.onRefresh event!')
                    },
                    /*filter: {
                        fields: [
                            {
                                caption: 'GUID',
                                dataField: 'guid',
                                dataType: 'string',
                            },
                            {
                                caption: 'Company',
                                dataField: 'company',
                                dataType: 'string',
                            },
                            {
                                caption: 'Phone Number',
                                dataField: 'phone',
                                dataType: 'string',
                            },
                            {
                                caption: 'Email Address',
                                dataField: 'email',
                                dataType: 'string',
                            },
                            {
                                caption: 'Address',
                                dataField: 'address',
                                dataType: 'string',
                            },
                            {
                                caption: 'Registered',
                                dataField: 'registered',
                                dataType: 'datetime',
                            },
                            {
                                caption: 'Is Active?',
                                dataField: 'isActive',
                                dataType: 'boolean',
                            },
                            {
                                caption: 'Latitude',
                                dataField: 'latitude',
                                dataType: 'number',
                            },
                            {
                                caption: 'Longitude',
                                dataField: 'longitude',
                                dataType: 'number',
                            }
                        ],
                        onFilter: (filter, sqlLikeFilter) => {
                            console.log(filter)
                            console.log(sqlLikeFilter)
                        }
                    },*/
                    onColumns: (columnOrder, columnVisibility) => {
                        console.log('onColumns : ', columnOrder)
                        console.log('onColumns : ', columnVisibility)
                    },
                    /*report: {
                        listView: {
                            list: [
                                {id: 1, name: 'Report A', type: "XLSX"},
                                {id: 2, name: 'Report B', type: "PDF"},
                            ],
                            isLoading: false,
                            onViewTemplate: (template) => {
                                console.log(`onViewTemplate : `, template)
                            },
                            onDownloadTemplate: (template) => {
                                console.log(`onDownloadTemplate : `, template)
                            },
                            onDeleteTemplate: (template) => {
                                console.log(`onDeleteTemplate : `, template)
                            },
                            onActive: () => {
                                console.log(`Report list view is active`)
                            }
                        },
                        addView: {
                            fields: [
                                {
                                    caption: 'GUID',
                                    dataField: 'guid',
                                    dataType: 'string',
                                },
                                {
                                    caption: 'Company',
                                    dataField: 'company',
                                    dataType: 'string',
                                },
                                {
                                    caption: 'Phone Number',
                                    dataField: 'phone',
                                    dataType: 'string',
                                },
                                {
                                    caption: 'Email Address',
                                    dataField: 'email',
                                    dataType: 'string',
                                },
                                {
                                    caption: 'Address',
                                    dataField: 'address',
                                    dataType: 'string',
                                },
                                {
                                    caption: 'Registered',
                                    dataField: 'registered',
                                    dataType: 'datetime',
                                },
                                {
                                    caption: 'Is Active?',
                                    dataField: 'isActive',
                                    dataType: 'boolean',
                                },
                                {
                                    caption: 'Latitude',
                                    dataField: 'latitude',
                                    dataType: 'number',
                                },
                                {
                                    caption: 'Longitude',
                                    dataField: 'longitude',
                                    dataType: 'number',
                                }
                            ],
                            onRunReport: (values) => {
                                console.log(values)
                            },
                            isLoading: false
                        },
                        updateView: {
                            fields: [
                                {
                                    caption: 'GUID',
                                    dataField: 'guid',
                                    dataType: 'string',
                                },
                                {
                                    caption: 'Company',
                                    dataField: 'company',
                                    dataType: 'string',
                                },
                                {
                                    caption: 'Phone Number',
                                    dataField: 'phone',
                                    dataType: 'string',
                                },
                                {
                                    caption: 'Email Address',
                                    dataField: 'email',
                                    dataType: 'string',
                                },
                                {
                                    caption: 'Address',
                                    dataField: 'address',
                                    dataType: 'string',
                                },
                                {
                                    caption: 'Registered',
                                    dataField: 'registered',
                                    dataType: 'datetime',
                                },
                                {
                                    caption: 'Is Active?',
                                    dataField: 'isActive',
                                    dataType: 'boolean',
                                },
                                {
                                    caption: 'Latitude',
                                    dataField: 'latitude',
                                    dataType: 'number',
                                },
                                {
                                    caption: 'Longitude',
                                    dataField: 'longitude',
                                    dataType: 'number',
                                }
                            ],
                            onUpdateReport: (values) => {
                                console.log(values)
                            },
                            isLoading: false,
                            template: {
                                id: 1,
                                report_name: 'Sample Report - Inactive Companies',
                                report_type: 'XLSX',
                                report_description: 'Sample Report',
                                save_as_template: true,
                                filter: {
                                    value: ["isActive", "=", true],
                                    sqlLike: '(isActive = true)'
                                },
                                sorting: [
                                    {
                                        "label": "GUID",
                                        "name": "guid",
                                        "selected": false,
                                        "sort": ""
                                    },
                                    {
                                        "label": "Organization Name",
                                        "name": "company",
                                        "selected": true,
                                        "sort": "ASC"
                                    },
                                    {
                                        "label": "Organization Phone",
                                        "name": "phone",
                                        "selected": false,
                                        "sort": ""
                                    },
                                    {
                                        "label": "Organization Email Address",
                                        "name": "email",
                                        "selected": false,
                                        "sort": ""
                                    },
                                    {
                                        "label": "Organization Physical Address",
                                        "name": "address",
                                        "selected": false,
                                        "sort": ""
                                    },
                                    {
                                        "label": "Onboard Date",
                                        "name": "registered",
                                        "selected": false,
                                        "sort": ""
                                    },
                                    {
                                        "label": "Status",
                                        "name": "isActive",
                                        "selected": false,
                                        "sort": ""
                                    },
                                    {
                                        "label": "Latitude",
                                        "name": "latitude",
                                        "selected": false,
                                        "sort": ""
                                    },
                                    {
                                        "label": "Longitude",
                                        "name": "longitude",
                                        "selected": false,
                                        "sort": ""
                                    }
                                ],
                                columns: [
                                    {
                                        "label": "GUID",
                                        "name": "guid",
                                        "selected": true,
                                        "canMoveUp": false,
                                        "canMoveDown": false
                                    },
                                    {
                                        "label": "Organization Name",
                                        "name": "company",
                                        "selected": true,
                                        "canMoveUp": false,
                                        "canMoveDown": true
                                    },
                                    {
                                        "label": "Organization Phone",
                                        "name": "phone",
                                        "selected": true,
                                        "canMoveUp": true,
                                        "canMoveDown": true
                                    },
                                    {
                                        "label": "Organization Email Address",
                                        "name": "email",
                                        "selected": true,
                                        "canMoveUp": true,
                                        "canMoveDown": true
                                    },
                                    {
                                        "label": "Organization Physical Address",
                                        "name": "address",
                                        "selected": true,
                                        "canMoveUp": true,
                                        "canMoveDown": true
                                    },
                                    {
                                        "label": "Onboard Date",
                                        "name": "registered",
                                        "selected": true,
                                        "canMoveUp": true,
                                        "canMoveDown": true
                                    },
                                    {
                                        "label": "Status",
                                        "name": "isActive",
                                        "selected": true,
                                        "canMoveUp": true,
                                        "canMoveDown": true
                                    },
                                    {
                                        "label": "Latitude",
                                        "name": "latitude",
                                        "selected": false,
                                        "canMoveUp": true,
                                        "canMoveDown": true
                                    },
                                    {
                                        "label": "Longitude",
                                        "name": "longitude",
                                        "selected": false,
                                        "canMoveUp": true,
                                        "canMoveDown": false
                                    }
                                ]
                            }
                        }
                    },*/
                    /*views: {
                        listView: {
                            list: [
                                {id: 1, name: 'View A'},
                                {id: 2, name: 'View B'},
                            ],
                            isLoading: false,

                            /!*activeView: 1,*!/
                            onChangeView: (view) => {
                                console.log('onChangeView : ', view)
                            },
                            onManageView: (view) => {
                                console.log(`onManageView : `, view)
                            },
                            onDeleteView: (view) => {
                                console.log(`onDeleteView : `, view)
                            },
                            onActive: () => {
                                console.log(`View list view is active`)
                            }
                        },
                        addView: {
                            fields: [
                                {
                                    caption: 'GUID',
                                    dataField: 'guid',
                                    dataType: 'string',
                                },
                                {
                                    caption: 'Company',
                                    dataField: 'company',
                                    dataType: 'string',
                                },
                                {
                                    caption: 'Phone Number',
                                    dataField: 'phone',
                                    dataType: 'string',
                                },
                                {
                                    caption: 'Email Address',
                                    dataField: 'email',
                                    dataType: 'string',
                                },
                                {
                                    caption: 'Address',
                                    dataField: 'address',
                                    dataType: 'string',
                                },
                                {
                                    caption: 'Registered',
                                    dataField: 'registered',
                                    dataType: 'datetime',
                                },
                                {
                                    caption: 'Is Active?',
                                    dataField: 'isActive',
                                    dataType: 'boolean',
                                },
                                {
                                    caption: 'Latitude',
                                    dataField: 'latitude',
                                    dataType: 'number',
                                },
                                {
                                    caption: 'Longitude',
                                    dataField: 'longitude',
                                    dataType: 'number',
                                }
                            ],
                            onCreateView: (values) => {
                                console.log(values)
                            },
                            isLoading: false
                        },
                        updateView: {
                            fields: [
                                {
                                    caption: 'GUID',
                                    dataField: 'guid',
                                    dataType: 'string',
                                },
                                {
                                    caption: 'Company',
                                    dataField: 'company',
                                    dataType: 'string',
                                },
                                {
                                    caption: 'Phone Number',
                                    dataField: 'phone',
                                    dataType: 'string',
                                },
                                {
                                    caption: 'Email Address',
                                    dataField: 'email',
                                    dataType: 'string',
                                },
                                {
                                    caption: 'Address',
                                    dataField: 'address',
                                    dataType: 'string',
                                },
                                {
                                    caption: 'Registered',
                                    dataField: 'registered',
                                    dataType: 'datetime',
                                },
                                {
                                    caption: 'Is Active?',
                                    dataField: 'isActive',
                                    dataType: 'boolean',
                                },
                                {
                                    caption: 'Latitude',
                                    dataField: 'latitude',
                                    dataType: 'number',
                                },
                                {
                                    caption: 'Longitude',
                                    dataField: 'longitude',
                                    dataType: 'number',
                                }
                            ],
                            onUpdateView: (values) => {
                                console.log(values)
                            },
                            isLoading: false,
                            view: {
                                id: 1,
                                view_name: 'Inactive Companies',
                                filter: {
                                    value: ["isActive", "=", true],
                                    sqlLike: '(isActive = true)'
                                },
                                sorting: [
                                    {
                                        "label": "GUID",
                                        "name": "guid",
                                        "selected": false,
                                        "sort": ""
                                    },
                                    {
                                        "label": "Organization Name",
                                        "name": "company",
                                        "selected": true,
                                        "sort": "ASC"
                                    },
                                    {
                                        "label": "Organization Phone",
                                        "name": "phone",
                                        "selected": false,
                                        "sort": ""
                                    },
                                    {
                                        "label": "Organization Email Address",
                                        "name": "email",
                                        "selected": false,
                                        "sort": ""
                                    },
                                    {
                                        "label": "Organization Physical Address",
                                        "name": "address",
                                        "selected": false,
                                        "sort": ""
                                    },
                                    {
                                        "label": "Onboard Date",
                                        "name": "registered",
                                        "selected": false,
                                        "sort": ""
                                    },
                                    {
                                        "label": "Status",
                                        "name": "isActive",
                                        "selected": false,
                                        "sort": ""
                                    },
                                    {
                                        "label": "Latitude",
                                        "name": "latitude",
                                        "selected": false,
                                        "sort": ""
                                    },
                                    {
                                        "label": "Longitude",
                                        "name": "longitude",
                                        "selected": false,
                                        "sort": ""
                                    }
                                ],
                                columns: [
                                    {
                                        "label": "GUID",
                                        "name": "guid",
                                        "selected": true,
                                        "canMoveUp": false,
                                        "canMoveDown": false
                                    },
                                    {
                                        "label": "Organization Name",
                                        "name": "company",
                                        "selected": true,
                                        "canMoveUp": false,
                                        "canMoveDown": true
                                    },
                                    {
                                        "label": "Organization Phone",
                                        "name": "phone",
                                        "selected": true,
                                        "canMoveUp": true,
                                        "canMoveDown": true
                                    },
                                    {
                                        "label": "Organization Email Address",
                                        "name": "email",
                                        "selected": true,
                                        "canMoveUp": true,
                                        "canMoveDown": true
                                    },
                                    {
                                        "label": "Organization Physical Address",
                                        "name": "address",
                                        "selected": true,
                                        "canMoveUp": true,
                                        "canMoveDown": true
                                    },
                                    {
                                        "label": "Onboard Date",
                                        "name": "registered",
                                        "selected": true,
                                        "canMoveUp": true,
                                        "canMoveDown": true
                                    },
                                    {
                                        "label": "Status",
                                        "name": "isActive",
                                        "selected": true,
                                        "canMoveUp": true,
                                        "canMoveDown": true
                                    },
                                    {
                                        "label": "Latitude",
                                        "name": "latitude",
                                        "selected": false,
                                        "canMoveUp": true,
                                        "canMoveDown": true
                                    },
                                    {
                                        "label": "Longitude",
                                        "name": "longitude",
                                        "selected": false,
                                        "canMoveUp": true,
                                        "canMoveDown": false
                                    }
                                ]
                            },
                        }
                    },*/
                    quickFilter: {
                        fields: [
                            {
                                caption: 'GUID',
                                dataField: 'guid',
                                dataType: 'string',
                            },
                            {
                                caption: 'Company',
                                dataField: 'company',
                                dataType: 'string',
                                lookup: {
                                    dataSource: [
                                        {value: 'A', label: 'Company A'},
                                        {value: 'B', label: 'Company B'},
                                        {value: 'C', label: 'Company C'},
                                        {value: 'D', label: 'Company D'},
                                        {value: 'E', label: 'Company E'},
                                    ],
                                    displayExpr: 'label',
                                    valueExpr: 'value'
                                }
                            },
                            {
                                caption: 'Phone Number',
                                dataField: 'phone',
                                dataType: 'string',
                            },
                            {
                                caption: 'Email Address',
                                dataField: 'email',
                                dataType: 'string',
                            },
                            {
                                caption: 'Address',
                                dataField: 'address',
                                dataType: 'string'
                            },
                            {
                                caption: 'Registered',
                                dataField: 'registered',
                                dataType: 'datetime',
                            },
                            {
                                caption: 'Is Active?',
                                dataField: 'isActive',
                                dataType: 'boolean',
                            },
                            {
                                caption: 'Latitude',
                                dataField: 'latitude',
                                dataType: 'number',
                            },
                            {
                                caption: 'Longitude',
                                dataField: 'longitude',
                                dataType: 'number',
                            }
                        ],
                        onChange: (value, sqlLikeFilter) => {
                            console.log(value, sqlLikeFilter)
                        }
                    }
                }}
            />
        /*</Stack>*/
    );
};

export default OrganizationsListPage;
