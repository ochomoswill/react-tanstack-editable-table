import React, {FunctionComponent} from 'react';
import {MantineProvider, MantineThemeOverride, NavLinkStylesParams, Tuple} from '@mantine/core';


interface OwnProps {
    children?: React.ReactNode
}

type Props = OwnProps;

/*{
    50: '#f1fde0',
    100: '#dcf4b9',
    200: '#c7eb91',
    300: '#b1e367',
    400: '#9cdb3d',
    500: '#83c224',
    600: '#65971a',
    700: '#486c10',
    800: '#2a4106',
    900: '#0c1700',
}*/

const PrimaryColor: Tuple<string, 10> = [
    '#DCE7F8',
    '#BAC7DC',
    '#98A8BF',
    '#7788A3',
    '#556886',
    '#33496A',
    '#11294D',
    '#0D2242',
    '#091B37',
    '#05142C',
]


/*{
    50: '#fff0e3',
    100: '#f8d4ba',
    200: '#f1b88d',
    300: '#ed9b61',
    400: '#e87f35',
    500: '#ce661c',
    600: '#a04f15',
    700: '#73390f',
    800: '#452107',
    900: '#1b0a00',
}*/

const SecondaryColor: Tuple<string, 10> = [
    '#FDE0CB',
    '#E6C4AC',
    '#D0A88D',
    '#B98C6E',
    '#A2704F',
    '#8C5430',
    '#753811',
    '#5C2B0B',
    '#441E06',
    '#2B1100',
]


/*{
    50: '#e4f2ff',
    100: '#c6daeb',
    200: '#a6c2d9',
    300: '#84acc8',
    400: '#628fb7',
    500: '#49709e',
    600: '#37527b',
    700: '#253659',
    800: '#131d38',
    900: '#000519',
}*/

const NeutralColor: Tuple<string, 10> = [
    '#D7F2FF',
    '#BEEAFF',
    '#A5E2FF',
    '#8CDAFF',
    '#72D2FF',
    '#59CAFF',
    '#40C2FF',
    '#2BAEEB',
    '#1599D6',
    '#0085C2',
]


/*{
    50: '#e9ebfe',
    100: '#c7cbea',
    200: '#a4abd9',
    300: '#808dca',
    400: '#5c6fbb',
    500: '#4459a2',
    600: '#34487f',
    700: '#25355b',
    800: '#152138',
    900: '#040a17',
}*/

const DarkColor: Tuple<string, 10> = [
    '#e9ebfe',
    '#c7cbea',
    '#a4abd9',
    '#808dca',
    '#5c6fbb',
    '#4459a2',
    '#34487f',
    '#25355b',
    '#152138',
    '#040a17',
]

const fcbsTheme: MantineThemeOverride = {
    colorScheme: 'light',
    defaultRadius: 0,
    colors: {
        primary: PrimaryColor,
        secondary: SecondaryColor,
        neutral: NeutralColor,
        dark: DarkColor
    },
    primaryColor: 'primary',
    fontFamily: 'Goldmann Sans',
    black: '#404756',
    components: {
        NavLink: {
            styles: (theme, params: NavLinkStylesParams) => ({
                root: {
                    padding: '5px 6px',
                }
            })
        }
    },
    other: {
        backgrounds: {
            grey: ['#F3F2F1', '#F2F2F2', '#BFBFBF']
        },
        borders: {
            grey: '#D1D1D1'
        },
        colors: {
            turquoise: `#0BA5A9`
        }
    }
};

export const FCBSMantineProvider: FunctionComponent<Props> = (props) => {


    return (
        <MantineProvider
            theme={fcbsTheme}
            withCSSVariables={true}
            withNormalizeCSS={true}
            withGlobalStyles={true}
        >
            {/*<NavigationProgress color={'red'}/>*/}
            {props.children}
        </MantineProvider>
    );
};

