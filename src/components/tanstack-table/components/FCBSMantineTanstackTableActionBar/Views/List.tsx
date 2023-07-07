import React, {FunctionComponent, useMemo, useState} from 'react';
import {
    ActionIcon,
    Box,
    Button,
    Divider,
    Group,
    LoadingOverlay, Popover, Radio,
    Stack,
    Text,
    TextInput,
    useMantineTheme
} from "@mantine/core";
import {Eye, Plus, Search, Trash, X} from "tabler-icons-react";
import {FCBSMantineTanstackTableStyles} from "./../../../styles/FCBSMantineTanstackTableStyles";
import {IconEye, IconSettings} from "@tabler/icons-react";
import {
    FCBSMantineTanstackTableActionBarDefaultViewId
} from "./index";

const DeleteViewAction: FunctionComponent<{
    onConfirm: () => void
}> = (props) => {
    const theme = useMantineTheme()

    const [opened, setOpened] = useState<boolean>(false)

    return (
        <Popover withArrow={true}
                 opened={opened}
                 closeOnClickOutside={true}
                 onClose={() => {
                     setOpened(false)
                 }}
                 defaultOpened={false}
        >
            <Popover.Target>
                <ActionIcon color="red"
                            radius={"md"}
                            variant="light"
                            title={'Delete view'}
                            onClick={() => {
                                setOpened(true)
                            }}
                >
                    <Trash size={theme.fontSizes.sm}/>
                </ActionIcon>
            </Popover.Target>
            <Popover.Dropdown>
                <Stack>
                    <Text>Are you sure you want to proceed? This action cannot be undone.</Text>
                    <Group>
                        <Button color={'red'}
                                size={'xs'}
                                onClick={() => {
                                    props.onConfirm()
                                    setOpened(false)
                                }}
                        >
                            Delete
                        </Button>
                        <Button variant={'default'}
                                size={'xs'}
                                onClick={() => {
                                    setOpened(false)
                                }}
                        >
                            Cancel
                        </Button>
                    </Group>
                </Stack>
            </Popover.Dropdown>
        </Popover>
    )
}

export type FCBSMantineTanstackTableActionBarView = {
    id: number | string
    name: string
}

export interface FCBSMantineTanstackTableActionBarViewsListProps {
    isLoading: boolean
    list: Array<FCBSMantineTanstackTableActionBarView>
    selectedView: string

    onClose: () => void
    onAddView: () => void
    onCancel: () => void

    onSelectView: (view: FCBSMantineTanstackTableActionBarView) => void

    onDeleteView: (view: FCBSMantineTanstackTableActionBarView) => void
    onManageView: (view: FCBSMantineTanstackTableActionBarView) => void
}

const FCBSMantineTanstackTableActionBarViewsList: FunctionComponent<FCBSMantineTanstackTableActionBarViewsListProps> = (props) => {
    const {
        isLoading, list, selectedView,
        onClose, onAddView, onManageView, onCancel, onDeleteView, onSelectView
    } = props

    const {classes} = FCBSMantineTanstackTableStyles()
    const theme = useMantineTheme()

    const views: Array<FCBSMantineTanstackTableActionBarView> = useMemo(() => list, [list])
    const [searchFilter, setSearchFilter] = useState<string>('')

    const emptyList = useMemo(() => (
        <Stack sx={(theme) => ({
            height: '100%',
            background: theme.other.backgrounds.grey[0]
        })}
               spacing={8}
               justify={'center'}
               align={'center'}>
            <Eye color={theme.other.borders.grey}/>
            <Text size={'xs'}
                  color={'gray'}
            >No views available at the moment</Text>
        </Stack>
    ), [])
    const filteredViews: Array<FCBSMantineTanstackTableActionBarView> = useMemo(() => {
        return views
            .filter((a) => {
                if (!searchFilter) {
                    return true
                }
                return a.name.toLowerCase().indexOf(searchFilter.toLowerCase()) !== -1
            })
    }, [views, searchFilter])
    const viewsList = useMemo(() => {
        return (
            <table className={classes.table}>
                <thead>
                <tr>
                    <th className={classes.th}></th>
                    <th className={classes.th}>View Name</th>
                    <th className={classes.th}>Actions</th>
                </tr>
                </thead>
                <tbody>
                {filteredViews.map((view) => {
                    const isActive: boolean = `${view.id}` === selectedView
                    return (
                        <tr key={`${view.id}-${view.name}`}>
                            <td className={classes.td}>
                                {view.id !== FCBSMantineTanstackTableActionBarDefaultViewId ? view.id : ''}
                            </td>
                            <td className={classes.td}>{view.name}</td>
                            <td className={classes.td}>
                                <Group sx={{
                                    flexWrap: 'nowrap',
                                    cursor: 'pointer'
                                }} spacing={8}>
                                    <Radio label={isActive ? 'Selected' : 'Select'}
                                           size={'xs'}
                                           checked={isActive}
                                           disabled={isActive}
                                           onChange={e => {
                                               onSelectView(view)
                                           }}
                                           mr={'xs'}
                                           sx={{
                                               cursor: 'pointer'
                                           }}
                                    />
                                    {view.id !== FCBSMantineTanstackTableActionBarDefaultViewId &&
                                        <>
                                            <ActionIcon color="green"
                                                        radius={"md"}
                                                        variant="light"
                                                        title={'Manage view'}
                                                        onClick={() => {
                                                            onManageView(view)
                                                        }}
                                            >
                                                <IconSettings size={theme.fontSizes.sm}/>
                                            </ActionIcon>
                                            <DeleteViewAction onConfirm={() => onDeleteView(view)}/>
                                        </>
                                    }
                                </Group>
                            </td>
                        </tr>
                    )
                })}
                </tbody>
            </table>
        )
    }, [filteredViews, selectedView])

    return (
        <Box sx={{
            position: "relative"
        }}>
            <LoadingOverlay visible={isLoading}
                            overlayBlur={1}/>
            <Group position={"apart"}>
                <Group spacing={4}>
                    <IconEye size={theme.fontSizes.sm} color={'green'}/>
                    <Text color={'primary'}>Views</Text>
                </Group>
                <Group spacing={4}>
                    <TextInput
                        placeholder={'Find View'}
                        rightSection={<Search size={theme.fontSizes.sm}/>}
                        size={'xs'}
                        value={searchFilter}
                        onChange={(e) => {
                            setSearchFilter(e.target.value)
                        }}
                    />
                    <ActionIcon onClick={() => {
                        onClose()
                    }}>
                        <X size={theme.fontSizes.sm}/>
                    </ActionIcon>
                </Group>
            </Group>
            <Divider my={'xs'}/>

            <Box sx={(theme) => ({
                border: `solid 1px ${theme.other.borders.grey}`,
                height: 200,
                overflow: 'auto'
            })}
                 p={0}
                 m={0}
            >
                {views.length > 0 ? viewsList : emptyList}
            </Box>

            <Group position={"apart"} mt={'xs'}>
                <Button size={'xs'}
                        variant={"subtle"}
                        onClick={() => {
                            onAddView()
                        }}
                        leftIcon={<Plus/>}
                >Add View</Button>
                <Button size={'xs'}
                        variant={'default'}
                        onClick={() => {
                            onCancel()
                        }}
                >Cancel</Button>
            </Group>
        </Box>
    );
};

export default FCBSMantineTanstackTableActionBarViewsList;
