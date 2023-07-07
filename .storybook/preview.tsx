import type {Preview} from "@storybook/react";
import './../src/fonts.css'
// import './../src/assets/css/dx.generic.smbp-compact-scheme.css'
import 'devextreme/dist/css/dx.light.compact.css';
import {FCBSMantineProvider} from "../src/lib/mantine/FCBSMantineProvider";
import {DevExtremeProvider} from "../src/lib/devextreme";

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


export const decorators = [(renderStory: Function) => <DevExtremeProvider>
    <FCBSMantineProvider>
        {renderStory()}
    </FCBSMantineProvider>
</DevExtremeProvider>
];

export default preview;
