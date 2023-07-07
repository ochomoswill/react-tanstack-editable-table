import React, {FunctionComponent} from 'react';
import {Table} from "@tanstack/react-table";
import {Divider, Group, Pagination, Select, Text} from "@mantine/core";

interface OwnProps {
    table: Table<unknown>
    totalCount: number
}

type Props = OwnProps;

const FCBSMantineTanstackTablePagination: FunctionComponent<Props> = (props) => {
    const {table, totalCount} = props;

    return (
        <React.Fragment>
            <Group sx={(theme) => ({
                flexWrap: 'nowrap'
            })}>
                <Text>Show</Text>
                <Select
                    placeholder="Count"
                    data={[
                        {value: '25', label: '25'},
                        {value: '50', label: '50'},
                        {value: '100', label: '100'},
                        {value: '500', label: '500'},
                        {value: '1000', label: '1000'},
                    ]}
                    size={'xs'}
                    sx={(theme) => ({
                        maxWidth: 80
                    })}
                    value={`${table.getState().pagination.pageSize}`}
                    onChange={e => {
                        table.setPageSize(Number(e))
                    }}
                />
                <Text>of <b>{totalCount}</b> record{totalCount > 1 ? 's' : ''}</Text>
            </Group>
            <Divider orientation="vertical"/>
            <Pagination.Root total={table.getPageCount()}
                             size={'xs'}
                             value={table.getState().pagination.pageIndex + 1}
                             onChange={(page) => {
                                 table.setPageIndex(page - 1)
                             }}
            >
                <Group spacing={5} position="center">
                    <Pagination.First
                        onClick={() => {
                            table.setPageIndex(0)
                        }}
                        disabled={!table.getCanPreviousPage()}
                    />
                    <Pagination.Previous
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    />
                    <Pagination.Items/>
                    <Pagination.Next
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    />
                    <Pagination.Last
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                    />
                </Group>
            </Pagination.Root>
        </React.Fragment>
    );
};

export default FCBSMantineTanstackTablePagination;
