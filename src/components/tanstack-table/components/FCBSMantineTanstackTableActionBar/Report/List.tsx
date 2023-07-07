import React, {FunctionComponent, useMemo, useState} from 'react';
import {
    ActionIcon,
    Box,
    Button,
    Divider,
    Group,
    LoadingOverlay, Popover,
    Stack,
    Text,
    TextInput,
    useMantineTheme
} from "@mantine/core";
import {Download, Eye, FileInfo, Plus, Report, Search, Trash, X} from "tabler-icons-react";
import {FCBSMantineTanstackTableStyles} from "./../../../styles/FCBSMantineTanstackTableStyles";

const DeleteTemplateAction: FunctionComponent<{
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
                            title={'Delete report template'}
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

export type FCBSMantineTanstackTableActionBarReportTemplate = {
    id: number | string
    name: string
    type: 'PDF' | 'XLSX'
}

export interface FCBSMantineTanstackTableActionBarReportListProps {
    isLoading: boolean
    list: Array<FCBSMantineTanstackTableActionBarReportTemplate>

    onClose: () => void
    onAddTemplate: () => void
    onCancel: () => void

    onDeleteTemplate: (template: FCBSMantineTanstackTableActionBarReportTemplate) => void
    onDownloadTemplate: (template: FCBSMantineTanstackTableActionBarReportTemplate) => void
    onViewTemplate: (template: FCBSMantineTanstackTableActionBarReportTemplate) => void
}

const FCBSMantineTanstackTableActionBarReportList: FunctionComponent<FCBSMantineTanstackTableActionBarReportListProps> = (props) => {
    const {
        isLoading, list,
        onClose, onAddTemplate, onViewTemplate, onCancel, onDownloadTemplate, onDeleteTemplate
    } = props

    const {classes} = FCBSMantineTanstackTableStyles()
    const theme = useMantineTheme()

    const templates: Array<FCBSMantineTanstackTableActionBarReportTemplate> = useMemo(() => list, [list])
    const [searchFilter, setSearchFilter] = useState<string>('')

    const emptyList = useMemo(() => (
        <Stack sx={(theme) => ({
            height: '100%',
            background: theme.other.backgrounds.grey[0]
        })}
               spacing={8}
               justify={'center'}
               align={'center'}>
            <Report color={theme.other.borders.grey}/>
            <Text size={'xs'}
                  color={'gray'}
            >No report templates at the moment</Text>
        </Stack>
    ), [])
    const filteredTemplates: Array<FCBSMantineTanstackTableActionBarReportTemplate> = useMemo(() => {
        return templates
            .filter((a) => {
                if (!searchFilter) {
                    return true
                }
                return a.name.toLowerCase().indexOf(searchFilter.toLowerCase()) !== -1
            })
    }, [templates, searchFilter])
    const templatesList = useMemo(() => {
        return (
            <table className={classes.table}>
                <thead>
                <tr>
                    <th className={classes.th}></th>
                    <th className={classes.th}>Report Name</th>
                    <th className={classes.th}>Report Type</th>
                    <th className={classes.th}>Actions</th>
                </tr>
                </thead>
                <tbody>
                {filteredTemplates.map((template) => (
                    <tr key={`${template.id}-${template.name}`}>
                        <td className={classes.td}>{template.id}</td>
                        <td className={classes.td}>{template.name}</td>
                        <td className={classes.td}>
                            {template.type === 'XLSX' ?
                                <Group spacing={4}>
                                    <FileInfo size={theme.spacing.md}
                                              color={theme.colors.green[theme.fn.primaryShade()]}/>
                                    <Text color={'green'}>
                                        {template.type}
                                    </Text>
                                </Group> :
                                <Group spacing={4}>
                                    <FileInfo size={theme.spacing.md}
                                              color={theme.colors.grape[theme.fn.primaryShade()]}/>
                                    <Text color={'grape'}>
                                        {template.type}
                                    </Text>
                                </Group>
                            }
                        </td>
                        <td className={classes.td}>
                            <Group sx={{
                                flexWrap: 'nowrap',
                                cursor: 'pointer'
                            }} spacing={8}>
                                <ActionIcon color="blue"
                                            radius={"md"}
                                            variant="light"
                                            title={'Download report'}
                                            onClick={() => {
                                                onDownloadTemplate(template)
                                            }}
                                >
                                    <Download size={theme.fontSizes.sm}/>
                                </ActionIcon>
                                <ActionIcon color="green"
                                            radius={"md"}
                                            variant="light"
                                            title={'View report template'}
                                            onClick={() => {
                                                onViewTemplate(template)
                                            }}
                                >
                                    <Eye size={theme.fontSizes.sm}/>
                                </ActionIcon>
                                <DeleteTemplateAction onConfirm={() => onDeleteTemplate(template)}/>
                            </Group>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        )
    }, [filteredTemplates])

    return (
        <Box sx={{
            position: "relative"
        }}>
            <LoadingOverlay visible={isLoading}
                            overlayBlur={1}/>
            <Group position={"apart"}>
                <Group spacing={4}>
                    <Report size={theme.fontSizes.sm} color={'green'}/>
                    <Text color={'primary'}>Report Templates</Text>
                </Group>
                <Group spacing={4}>
                    <TextInput
                        placeholder={'Find Report'}
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
                {templates.length > 0 ? templatesList : emptyList}
            </Box>

            <Group position={"apart"} mt={'xs'}>
                <Button size={'xs'}
                        variant={"subtle"}
                        onClick={() => {
                            onAddTemplate()
                        }}
                        leftIcon={<Plus/>}
                >Add Template</Button>
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

export default FCBSMantineTanstackTableActionBarReportList;
