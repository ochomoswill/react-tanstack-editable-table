import {Meta, StoryObj} from "@storybook/react";
import OrganizationsListPage from "./examples/Organizations";
import {FCBSMantineTanstackTable} from "./index";
import EditableOrganizations from "./examples/EditableOrganizations";

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