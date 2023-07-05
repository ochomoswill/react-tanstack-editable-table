import React, {FunctionComponent} from 'react';
import {Button, Group, Select, Text, TextInput, useMantineTheme} from "@mantine/core";
import {
    IconPlus,
    IconRefresh,
} from "@tabler/icons-react";
import {ColumnOrderState, Table, VisibilityState} from "@tanstack/react-table";
import FCBSMantineTanstackTableActionBarFilter
    , {
    FCBSMantineTanstackTableActionBarFilterProps
} from "./Filter";
import FCBSMantineTanstackTableActionBarColumns
    from "./Columns";
import FCBSMantineTanstackTableActionBarSorting
    from "./Sorting";
import FCBSMantineTanstackTableActionBarReport
    , {
    FCBSMantineTanstackTableActionBarReportConfig
} from "./Report";
import FCBSMantineTanstackTableActionBarViews
    , {
    FCBSMantineTanstackTableActionBarViewsConfig
} from "./Views";
import FCBSMantineTanstackTableActionBarQuickFilter
    , {
    FCBSMantineTanstackTableActionBarQuickFilterConfig
} from "./QuickFilter";
import {FCBSMantineTanstackTableProps} from "@/component/tanstack-table";

export type FCBSMantineTanstackTableActionBarConfig = {
    onAdd?: () => void
    onRefresh?: () => void
    filter?: FCBSMantineTanstackTableActionBarFilterProps
    onColumns?: (columnOrder: ColumnOrderState, columnVisibility: VisibilityState) => void
    report?: FCBSMantineTanstackTableActionBarReportConfig
    views?: FCBSMantineTanstackTableActionBarViewsConfig
    quickFilter?: FCBSMantineTanstackTableActionBarQuickFilterConfig

}

interface OwnProps {
    table: Table<unknown>
    isSortingEnabled: boolean
    isMultiSortEnabled: boolean

    actionBarConfig?: FCBSMantineTanstackTableActionBarConfig
    editing: FCBSMantineTanstackTableProps['editing']
    initAddRow: FCBSMantineTanstackTableProps['editing']['initAddRow']

}

type Props = OwnProps;

const FCBSMantineTanstackTableActionBar: FunctionComponent<Props> = (props) => {
    const {table, actionBarConfig, isSortingEnabled, isMultiSortEnabled} = props
    const theme = useMantineTheme()

    return (
        actionBarConfig ?
            <Group position={'apart'}>
                <Group spacing={0}>
                    {props.editing.enableAdd &&
                        <Button
                            variant={'subtle'}
                            leftIcon={<IconPlus size={theme.fontSizes.md}
                                                color={theme.colors.green[theme.fn.primaryShade()]}/>}
                            size={'xs'}
                            onClick={props?.editing?.initAddRow ?? props.initAddRow}
                        >Add</Button>
                    }

                    {/*{actionBarConfig.onAdd &&
                        <Button
                            variant={'subtle'}
                            leftIcon={<IconPlus size={theme.fontSizes.md}
                                                color={theme.colors.green[theme.fn.primaryShade()]}/>}
                            size={'xs'}
                            onClick={actionBarConfig.onAdd}
                        >Add</Button>
                    }*/}
                    {actionBarConfig.onRefresh &&
                        <Button
                            variant={'subtle'}
                            leftIcon={<IconRefresh size={theme.fontSizes.md}
                                                   color={theme.colors.blue[theme.fn.primaryShade()]}/>}
                            size={'xs'}
                            onClick={actionBarConfig.onRefresh}
                        >Refresh</Button>
                    }
                    {actionBarConfig.filter &&
                        <FCBSMantineTanstackTableActionBarFilter
                            fields={actionBarConfig.filter ? actionBarConfig.filter.fields : []}
                            onFilter={actionBarConfig.filter ? actionBarConfig.filter.onFilter : () => {
                            }}/>
                    }
                    {actionBarConfig.onColumns &&
                        <FCBSMantineTanstackTableActionBarColumns table={table}/>
                    }
                    {isSortingEnabled &&
                        <FCBSMantineTanstackTableActionBarSorting table={table}
                                                                  enableMultiSort={isMultiSortEnabled}/>
                    }
                    {actionBarConfig.report &&
                        <FCBSMantineTanstackTableActionBarReport table={table}
                                                                 config={actionBarConfig.report}
                        />
                    }
                    {actionBarConfig.views &&
                        <FCBSMantineTanstackTableActionBarViews table={table}
                                                                config={actionBarConfig.views}/>
                    }
                </Group>
                {actionBarConfig.quickFilter &&
                    <FCBSMantineTanstackTableActionBarQuickFilter
                        fields={actionBarConfig.quickFilter.fields}
                        onChange={actionBarConfig.quickFilter.onChange}
                    />
                }
            </Group>
            : null
    );
};

export default FCBSMantineTanstackTableActionBar;
