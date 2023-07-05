import type {Preview} from "@storybook/react";
import './../src/fonts.css'
import {FCBSMantineProvider} from "../src/lib/mantine/FCBSMantineProvider";

const preview: Preview = {
    parameters: {
        actions: {argTypesRegex: "^on[A-Z].*"},
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/,
            },
        },
    },
};


export const decorators = [(renderStory: Function) => <FCBSMantineProvider>{renderStory()}</FCBSMantineProvider>];

export default preview;
