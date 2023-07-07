import {EditableTable} from "./EditableTable";
import {Meta, StoryObj} from "@storybook/react";
import {Persons} from "./examples/Persons";
import {IndustryTypes} from "./examples/IndustryTypes";

const meta: Meta<typeof EditableTable> = {
    title: 'EditableTable',
    component: EditableTable,
};

export default meta;

type Story = StoryObj<typeof EditableTable>;

export const ArrayDataSource: Story = {
    render: () => <Persons/>,
};

export const RESTAPIDataSource: Story = {
    render: () => <IndustryTypes/>,
};