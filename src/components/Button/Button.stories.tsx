import {Meta, StoryObj} from "@storybook/react";
import {Button} from "@mantine/core";

const meta: Meta<typeof Button> = {
    title: 'Mantine/Button',
    component: Button,
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Filled: Story = {
    render: () => <Button variant={'filled'} color={'secondary'}>
        Save Changes
    </Button>,
};

export const Subtle: Story = {
    render: () => <Button variant={'subtle'}>
        Save Changes
    </Button>,
};