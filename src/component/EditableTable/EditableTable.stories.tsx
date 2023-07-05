import {EditableTable} from "./EditableTable.tsx";
import {Meta, StoryObj} from "@storybook/react";
import {Persons} from "./examples/Persons.tsx";
import {IndustryTypes} from "./examples/IndustryTypes.tsx";

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