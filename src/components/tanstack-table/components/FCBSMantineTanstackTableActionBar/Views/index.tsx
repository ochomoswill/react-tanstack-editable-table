import React, {FunctionComponent, useEffect, useMemo, useRef, useState} from 'react';
import {ActionIcon, Group, Popover, Select, useMantineTheme} from "@mantine/core";
import {IconEye} from "@tabler/icons-react";
import {Table} from "@tanstack/react-table";
import FCBSMantineTanstackTableActionBarViewsList, {
    FCBSMantineTanstackTableActionBarView,
    FCBSMantineTanstackTableActionBarViewsListProps
} from "./List";
import FCBSMantineTanstackTableActionBarViewsAdd
    , {
    FCBSMantineTanstackTableActionBarViewsAddProps
} from "./Add";
import FCBSMantineTanstackTableActionBarViewsUpdate, {
    FCBSMantineTanstackTableActionBarViewsUpdateProps
} from "./Update";

export const FCBSMantineTanstackTableActionBarDefaultViewId: string = 'FCBSMantineTanstackTableActionBarDefaultView'

type Mode = 'ADD' | 'UPDATE' | 'LIST';

export type FCBSMantineTanstackTableActionBarViewsConfig = {
    listView: Pick<FCBSMantineTanstackTableActionBarViewsListProps, 'list' | 'isLoading' | 'onDeleteView' | 'onManageView'> & {
        onActive: () => void

        activeView?: FCBSMantineTanstackTableActionBarView['id']
        onChangeView: (view: FCBSMantineTanstackTableActionBarView) => void
    }
    addView: Pick<FCBSMantineTanstackTableActionBarViewsAddProps, 'fields' | 'onCreateView' | 'isLoading'>
    updateView: Pick<FCBSMantineTanstackTableActionBarViewsUpdateProps, 'fields' | 'onUpdateView' | 'isLoading' | 'view'>
}

export interface FCBSMantineTanstackTableActionBarViewsProps {
    table: Table<unknown>
    config: FCBSMantineTanstackTableActionBarViewsConfig
}

const FCBSMantineTanstackTableActionBarViews: FunctionComponent<FCBSMantineTanstackTableActionBarViewsProps> = (props) => {
    const {config, table} = props
    const theme = useMantineTheme()

    const initialRenderRef = useRef<boolean>(true)

    const [opened, setOpened] = useState<boolean>(false)
    const [mode, setMode] = useState<Mode>('LIST')

    const [selectedView, setSelectedView] = useState<string>(config.listView.activeView ? `${config.listView.activeView}` : FCBSMantineTanstackTableActionBarDefaultViewId)

    const enrichedList: Array<FCBSMantineTanstackTableActionBarView> = useMemo(() => [
        {id: FCBSMantineTanstackTableActionBarDefaultViewId, name: 'DEFAULT'},
        ...config.listView.list
    ], [props.config.listView.list])

    useEffect(() => {
        if (opened && (mode === 'LIST')) config.listView.onActive()
    }, [mode, opened]);

    useEffect(() => {
        if (!initialRenderRef.current) {
            props.config.listView.onChangeView(
                enrichedList.filter((a) => `${a.id}` === selectedView)[0]
            )
        }
        initialRenderRef.current = false
    }, [selectedView, enrichedList]);

    useEffect(() => {
        setSelectedView(config.listView.activeView ? `${config.listView.activeView}` : FCBSMantineTanstackTableActionBarDefaultViewId)
    }, [config.listView.activeView]);

    return (
        <Group spacing={4}>
            <Popover withArrow={true}
                     closeOnClickOutside={false}
                     opened={opened}
            >
                <Popover.Target>
                    <ActionIcon color="green"
                                radius={"md"}
                                variant="light"
                                title={'Views'}
                                ml={'xs'}
                                onClick={() => {
                                    setOpened(!opened)
                                }}
                    >
                        <IconEye size={theme.fontSizes.sm}/>
                    </ActionIcon>
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
                        <FCBSMantineTanstackTableActionBarViewsList
                            onAddView={() => {
                                setMode('ADD')
                            }}
                            onCancel={() => {
                                setOpened(false)
                            }}
                            onClose={() => {
                                setOpened(false)
                            }}

                            selectedView={selectedView}
                            onSelectView={(view) => {
                                setSelectedView(`${view.id}`)
                            }}

                            list={enrichedList}
                            isLoading={config.listView.isLoading}
                            onManageView={(view) => {
                                config.listView.onManageView(view)

                                setMode('UPDATE')
                            }}
                            onDeleteView={(view) => {
                                config.listView.onDeleteView(view)
                            }}
                        />}
                    {mode === 'ADD' &&
                        <FCBSMantineTanstackTableActionBarViewsAdd
                            table={table}
                            fields={config.addView.fields}
                            onCreateView={config.addView.onCreateView}
                            isLoading={config.addView.isLoading}
                            onClose={() => {
                                setMode('LIST')
                            }}
                        />}
                    {mode === 'UPDATE' &&
                        <FCBSMantineTanstackTableActionBarViewsUpdate
                            table={table}
                            fields={config.updateView.fields}
                            onUpdateView={config.updateView.onUpdateView}
                            isLoading={config.updateView.isLoading}
                            onClose={() => {
                                setMode('LIST')
                            }}
                            view={config.updateView.view}
                        />}
                </Popover.Dropdown>
            </Popover>


            <Select size={'xs'}
                    placeholder="Views Picker"
                    value={selectedView}
                    data={enrichedList.map(a => ({
                        label: a.name,
                        value: `${a.id}`
                    }))}
                    onChange={(id) => {
                        setSelectedView(`${id}`)
                    }}
            />
        </Group>
    );
};

export default FCBSMantineTanstackTableActionBarViews;
