import {createStyles} from "@mantine/core";

export const FCBSMantineTanstackTableStyles = createStyles((theme, params, variations) => {
    return {
        table: {
            borderCollapse: 'separate',
            borderSpacing: 0,
            fontSize: theme.fontSizes.xs,
            background: theme.white,
            minWidth: '100%',
            tableLayout: 'fixed',
            border: `solid 1px ${theme.colors.gray[3]}`,
        },
        th: {
            border: `solid 1px ${theme.colors.gray[3]}`,
            background: `${theme.colors.gray[1]}`,
            // whiteSpace: 'nowrap',
            padding: `0.25rem`,
            textAlign: 'left',

            position: "sticky",
            top: -1,
            zIndex: 1,
            borderTop: 'none',
            borderRight: 'none',
        },
        td: {
            border: `solid 1px ${theme.colors.gray[3]}`,
            padding: `0.1rem 0.5rem`,

            overflow: "hidden",
            textOverflow: "ellipsis",

            borderBottom: 'none',
            borderRight: 'none',
        },
        tr: {
            backgroundColor: theme.white,
            "&:hover": {
                backgroundColor: theme.colors.primary[0]
            },
            "&:focus": {
                backgroundColor: theme.colors.primary[0]
            }
        }
    }
})