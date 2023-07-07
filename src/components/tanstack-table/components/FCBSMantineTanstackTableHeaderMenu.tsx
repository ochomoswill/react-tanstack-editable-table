import React, {FunctionComponent} from 'react';
import {Header} from "@tanstack/react-table";
import {ActionIcon, Divider, Menu, useMantineTheme} from "@mantine/core";
import {DotsVertical, Eraser, EyeOff, Pin, PinnedOff, SortAscending, SortDescending} from "tabler-icons-react";

interface OwnProps {
    header: Header<unknown, any>
}

type Props = OwnProps;

const FCBSMantineTanstackTableHeaderMenu: FunctionComponent<Props> = (props) => {
    const {header} = props;
    const theme = useMantineTheme()

    return (
        <Menu shadow={'md'}>
            <Menu.Target>
                <ActionIcon size={'xs'}>
                    <DotsVertical size={theme.fontSizes.xs}/>
                </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Label>Actions</Menu.Label>
                {!header.isPlaceholder && header.column.getCanPin() && (
                    <React.Fragment>
                        {header.column.getIsVisible() &&
                            <Menu.Item icon={<EyeOff size={theme.fontSizes.sm}/>}
                                       onClick={() => {
                                           header.column.toggleVisibility(false)
                                       }}>Hide Column</Menu.Item>
                        }
                        {header.column.getIsPinned() !== "left" &&
                            <Menu.Item icon={<Pin size={theme.fontSizes.sm}/>}
                                       onClick={() => {
                                           header.column.pin("left")
                                       }}>Pin to the left</Menu.Item>
                        }
                        {header.column.getIsPinned() &&
                            <Menu.Item icon={<PinnedOff size={theme.fontSizes.sm}/>}
                                       onClick={() => {
                                           header.column.pin(false)
                                       }}>Unpin</Menu.Item>
                        }
                        {header.column.getIsPinned() !== "right" &&
                            <Menu.Item icon={<Pin size={theme.fontSizes.sm}/>}
                                       onClick={() => {
                                           header.column.pin("right")
                                       }}>Pin to the right</Menu.Item>
                        }
                    </React.Fragment>
                )}
                {header.column.getCanSort() &&
                    <React.Fragment>
                        <Divider size={'xs'}/>
                        {header.column.getIsSorted() !== 'asc' &&
                            <Menu.Item icon={<SortAscending size={theme.fontSizes.sm}/>}
                                       onClick={() => {
                                           header.column.toggleSorting(false)
                                       }}>Sort Ascending</Menu.Item>
                        }
                        {header.column.getIsSorted() !== 'desc' &&
                            <Menu.Item icon={<SortDescending size={theme.fontSizes.sm}/>}
                                       onClick={() => {
                                           header.column.toggleSorting(true)
                                       }}>Sort Descending</Menu.Item>
                        }
                        {header.column.getIsSorted() &&
                            <Menu.Item icon={<Eraser size={theme.fontSizes.sm}/>}
                                       onClick={() => {
                                           header.column.clearSorting()
                                       }}>Clear Sort</Menu.Item>
                        }
                    </React.Fragment>
                }
            </Menu.Dropdown>
        </Menu>
    );
};

export default FCBSMantineTanstackTableHeaderMenu;
