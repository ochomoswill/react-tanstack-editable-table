import React, {FunctionComponent, useEffect, useState} from 'react';
import {Table} from "@tanstack/react-table";
import {IconReportSearch} from "@tabler/icons-react";
import {Button, Popover, useMantineTheme} from "@mantine/core";
import FCBSMantineTanstackTableActionBarReportList
    , {
    FCBSMantineTanstackTableActionBarReportListProps
} from "./List";
import FCBSMantineTanstackTableActionBarReportAdd
    , {
    FCBSMantineTanstackTableActionBarReportAddProps
} from "./Add";
import FCBSMantineTanstackTableActionBarReportUpdate
    , {
    FCBSMantineTanstackTableActionBarReportUpdateProps
} from "./Update";

type Mode = 'ADD' | 'UPDATE' | 'LIST';

export type FCBSMantineTanstackTableActionBarReportConfig = {
    listView: Pick<FCBSMantineTanstackTableActionBarReportListProps, 'list' | 'isLoading' | 'onDeleteTemplate' | 'onDownloadTemplate' | 'onViewTemplate'> & {
        onActive: () => void
    }
    addView: Pick<FCBSMantineTanstackTableActionBarReportAddProps, 'fields' | 'onRunReport' | 'isLoading'>
    updateView: Pick<FCBSMantineTanstackTableActionBarReportUpdateProps, 'fields' | 'onUpdateReport' | 'isLoading' | 'template'>
}

export interface FCBSMantineTanstackTableActionBarReportProps {
    table: Table<unknown>
    config: FCBSMantineTanstackTableActionBarReportConfig
}

const FCBSMantineTanstackTableActionBarReport: FunctionComponent<FCBSMantineTanstackTableActionBarReportProps> = (props) => {
    const {config, table} = props
    const theme = useMantineTheme()

    const [opened, setOpened] = useState<boolean>(false)
    const [mode, setMode] = useState<Mode>('LIST')

    useEffect(() => {
        if (opened && (mode === 'LIST')) config.listView.onActive()
    }, [mode, opened]);

    return (
        <Popover withArrow={true}
                 closeOnClickOutside={false}
                 opened={opened}
        >
            <Popover.Target>
                <Button
                    variant={'subtle'}
                    leftIcon={<IconReportSearch size={theme.fontSizes.md}
                                                color={theme.colors.green[theme.fn.primaryShade()]}/>}
                    size={'xs'}
                    onClick={() => {
                        setOpened(!opened)
                    }}
                >Reports</Button>
            </Popover.Target>
            <Popover.Dropdown sx={(theme) => ({
                minWidth: 800,
                maxWidth: 800,
                [theme.fn.smallerThan('sm')]: {
                    minWidth: 800,
                    maxWidth: '100%',
                }
            })}>
                {mode === 'LIST' &&
                    <FCBSMantineTanstackTableActionBarReportList
                        onAddTemplate={() => {
                            setMode('ADD')
                        }}
                        onCancel={() => {
                            setOpened(false)
                        }}
                        onClose={() => {
                            setOpened(false)
                        }}

                        list={config.listView.list}
                        isLoading={config.listView.isLoading}
                        onViewTemplate={(template) => {
                            config.listView.onViewTemplate(template)

                            setMode('UPDATE')
                        }}
                        onDownloadTemplate={(template) => {
                            config.listView.onDownloadTemplate(template)
                        }}
                        onDeleteTemplate={(template) => {
                            config.listView.onDeleteTemplate(template)
                        }}
                    />}
                {mode === 'ADD' &&
                    <FCBSMantineTanstackTableActionBarReportAdd
                        table={table}
                        fields={config.addView.fields}
                        onRunReport={config.addView.onRunReport}
                        isLoading={config.addView.isLoading}
                        onClose={() => {
                            setMode('LIST')
                        }}
                    />}
                {mode === 'UPDATE' &&
                    <FCBSMantineTanstackTableActionBarReportUpdate
                        table={table}
                        fields={config.updateView.fields}
                        onUpdateReport={config.updateView.onUpdateReport}
                        isLoading={config.updateView.isLoading}
                        onClose={() => {
                            setMode('LIST')
                        }}
                        template={config.updateView.template}
                    />}
            </Popover.Dropdown>
        </Popover>
    );
};

export default FCBSMantineTanstackTableActionBarReport;
