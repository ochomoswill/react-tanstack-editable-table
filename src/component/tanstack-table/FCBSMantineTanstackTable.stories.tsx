import {Meta, StoryObj} from "@storybook/react";
import {Button} from "@mantine/core";
import OrganizationsListPage from "./examples/Organizations.tsx";
import {FCBSMantineTanstackTable} from "@/component/tanstack-table/index.tsx";
import EditableOrganizations from "@/component/tanstack-table/examples/EditableOrganizations.tsx";

const meta: Meta<typeof FCBSMantineTanstackTable> = {
    title: 'Mantine/TanstackTable',
    component: FCBSMantineTanstackTable,
};

export default meta;

type Story = StoryObj<typeof FCBSMantineTanstackTable>;

export const Default: Story = {
    render: () => (
        <OrganizationsListPage/>
    ),
};

export const Editing: Story = {
    render: () => (
        <EditableOrganizations/>
    ),
};