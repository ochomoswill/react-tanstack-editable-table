import React, {
    forwardRef,
    ForwardRefExoticComponent,
    FunctionComponent, RefAttributes,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';
import {
    Accordion,
    ActionIcon,
    Box,
    Button,
    createStyles,
    Divider,
    Group, LoadingOverlay,
    Text,
    Tooltip,
    useMantineTheme
} from "@mantine/core";
import {InfoCircle, X} from "tabler-icons-react";
import {z} from "zod";
import {SubmitErrorHandler, SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {RHFTextBox} from "@/lib/devextreme/controls/text-box";
import FCBSMantineTanstackTableActionBarColumnsSelect
    , {
    FCBSMantineTanstackTableActionBarColumnsSelectColumn, getSelectableColumns
} from "./../Columns/Select";
import {Table} from "@tanstack/react-table";
import FCBSMantineTanstackTableActionBarSortingSelect
    , {
    FCBSMantineTanstackTableActionBarSortingSelectColumn, getSortingColumns
} from "./../Sorting/Select";
import FCBSMantineTanstackTableAdvancedFilter
    from "./../../FCBSMantineTanstackTableAdvancedFilter";
import {Field} from "devextreme/ui/filter_builder";
import {FilterBuilderValue, filterBuilderValueToGenericSQLFilter} from "./../../../utils";
import {IconEye} from "@tabler/icons-react";
import {useFCBSMantineTanstackTableFilterStoreValue} from "./../../../stores/filter";

const Schema = z.object({
    view_name: z.string().trim().min(1)
})
type FormValues = z.infer<typeof Schema>;
const initialFormState: Partial<FormValues> = {
    view_name: ''
};
const useFCBSFormContainerStyles = createStyles((theme) => ({
    [`form-container`]: {
        padding: theme.spacing.xs,
        display: 'grid',
        gap: theme.spacing.xl,
        gridAutoFlow: 'row'
    },
    [`form-control`]: {
        display: 'grid',
        gridTemplateAreas: `
        "label input" 
        "label error"
        `,
        gridRow: 'auto',
        gridTemplateColumns: '150px 250px',
        fontSize: theme.fontSizes.sm,
        columnGap: theme.spacing.xs,
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
            gridTemplateAreas: `
        "label"
        "input" 
        "error"
        `,
            gridTemplateColumns: `250px`
        }
    },
    [`form-label`]: {
        gridArea: 'label',
        color: theme.other.colors.turquoise,
        display: 'flex',
        alignItems: 'start'
    },
    [`form-label__required`]: {
        ':after': {
            content: `" *"`,
            color: theme.colors.red[theme.fn.primaryShade()],
        }
    },
    [`form-input`]: {
        gridArea: 'input'
    },
    [`form-error`]: {
        gridArea: 'error',
        color: theme.colors.red[theme.fn.primaryShade()],
        display: 'flex',
        justifyContent: 'end',
        alignItems: 'center'
    }
}))

interface AddFormProps {
    onSubmit: (values: FormValues) => void
}

const FCBSMantineTanstackTableActionBarViewsAddForm: ForwardRefExoticComponent<AddFormProps & RefAttributes<HTMLFormElement>> = forwardRef<HTMLFormElement, AddFormProps>((props, ref) => {
    const {classes} = useFCBSFormContainerStyles()
    const {control, handleSubmit, reset, watch} = useForm<FormValues>({
        defaultValues: {...initialFormState},
        resolver: zodResolver(Schema)
    });

    const handleFormValidSubmit: SubmitHandler<FormValues> = (data, event) => {
        /*console.log(data)
        console.log(event)*/
        props.onSubmit(data)
    }

    const handleFormInvalidSubmit: SubmitErrorHandler<FormValues> = (errors, event) => {
        console.error(errors)
        /*console.log(event)*/
    }

    return (
        <form ref={ref}
              onSubmit={handleSubmit(handleFormValidSubmit, handleFormInvalidSubmit)}
              onReset={() => reset()}
        >
            <div className={classes["form-container"]}>
                <div className={classes["form-control"]}>
                    <div className={`${classes["form-label"]}`}>
                        <label className={`${classes["form-label__required"]}`}
                               htmlFor={"view_name"}>
                            View Name
                        </label>
                        <Tooltip label={`View name`}
                                 position={'top-start'}
                                 withArrow={true}
                        >
                            <ActionIcon size={'xs'} ml={'xs'}>
                                <InfoCircle/>
                            </ActionIcon>
                        </Tooltip>
                    </div>
                    <RHFTextBox name={'view_name'}
                                control={control}
                                stylingMode={'outlined'}
                                className={classes["form-input"]}/>
                </div>
            </div>
        </form>
    )
})

export interface FCBSMantineTanstackTableActionBarViewsAddProps {
    table: Table<unknown>

    isLoading: boolean
    fields: Array<Field>

    onClose: () => void

    onCreateView: (values: FormValues & {
        filter: {
            value: FilterBuilderValue,
            sqlLike: string
        }
        columns: Array<FCBSMantineTanstackTableActionBarColumnsSelectColumn>
        sorting: Array<FCBSMantineTanstackTableActionBarSortingSelectColumn>
    }) => void
}

const FCBSMantineTanstackTableActionBarViewsAdd: FunctionComponent<FCBSMantineTanstackTableActionBarViewsAddProps> = (props) => {
    const {table, isLoading, onCreateView,fields,onClose} = props

    const theme = useMantineTheme()

    // Zustand
    const storeFilterValue = useFCBSMantineTanstackTableFilterStoreValue();

    const [filterBuilderValue, setFilterBuilderValue] = useState<FilterBuilderValue>(storeFilterValue.filterBuilder)
    const strFilterBuilderValue = useMemo(() => filterBuilderValueToGenericSQLFilter(filterBuilderValue, fields), [filterBuilderValue, fields])

    const columnSelectColumns: Array<FCBSMantineTanstackTableActionBarColumnsSelectColumn> = useMemo(() => {
        return getSelectableColumns(table)
    }, [table.getAllLeafColumns(), table.getVisibleLeafColumns(), table.getState().columnPinning])
    const [changeColumnSelectColumns, setChangeColumnSelectColumns] = useState<Array<FCBSMantineTanstackTableActionBarColumnsSelectColumn>>(columnSelectColumns)

    const columnSortingColumns: Array<FCBSMantineTanstackTableActionBarSortingSelectColumn> = useMemo(() => {
        return getSortingColumns(table)
    }, [table.getState().sorting])

    const [changeColumnSortingColumns, setChangeColumnSortingColumns] = useState<Array<FCBSMantineTanstackTableActionBarSortingSelectColumn>>(columnSortingColumns);

    useEffect(() => {
        setChangeColumnSelectColumns(columnSelectColumns)
    }, [columnSelectColumns]);

    useEffect(() => {
        setChangeColumnSortingColumns(columnSortingColumns)
    }, [columnSortingColumns]);

    const formRef = useRef<HTMLFormElement>(null)

    return (
        <Box sx={{
            position: "relative"
        }}>
            <LoadingOverlay visible={isLoading}
                            overlayBlur={1}/>
            <Group position={"apart"}>
                <Group spacing={4}>
                    <IconEye size={theme.fontSizes.sm} color={'green'}/>
                    <Text color={'primary'}>New View</Text>
                </Group>
                <ActionIcon onClick={() => {
                    onClose()
                }}>
                    <X size={theme.fontSizes.sm}/>
                </ActionIcon>
            </Group>
            <Divider my={'xs'}/>

            <Box sx={(theme) => ({
                /*border: `solid 1px ${theme.other.borders.grey}`,*/
                maxHeight: 500,
                overflow: 'auto',
            })}
                 p={0}
                 m={0}>

                <FCBSMantineTanstackTableActionBarViewsAddForm
                    ref={formRef}
                    onSubmit={(values) => {
                        /*console.log(`Form : `, values)
                        console.log(`Filter : `, filterBuilderValue, strFilterBuilderValue)
                        console.log(`Columns : `, changeColumnSelectColumns)
                        console.log(`Sort : `, changeColumnSortingColumns)*/
                        onCreateView({
                            ...values,
                            filter: {
                                value: filterBuilderValue,
                                sqlLike: strFilterBuilderValue
                            },
                            columns: changeColumnSelectColumns,
                            sorting: changeColumnSortingColumns
                        })
                    }}/>
                <Divider p={'xs'}/>

                <Accordion variant="separated"
                           radius={0}
                           chevronPosition="left"
                >
                    <Accordion.Item value="filters">
                        <Accordion.Control p={8}>Filters</Accordion.Control>
                        <Accordion.Panel p={0}>

                            <FCBSMantineTanstackTableAdvancedFilter
                                fields={fields}
                                value={filterBuilderValue}
                                onChange={(value, sqlLikeFilter) => {
                                    setFilterBuilderValue(value)
                                }}/>

                        </Accordion.Panel>
                    </Accordion.Item>
                    <Accordion.Item value="columns">
                        <Accordion.Control p={8}>Columns</Accordion.Control>
                        <Accordion.Panel p={0}>

                            <FCBSMantineTanstackTableActionBarColumnsSelect
                                columns={changeColumnSelectColumns}
                                onChange={(columns) => {
                                    setChangeColumnSelectColumns(columns)
                                }}
                            />

                        </Accordion.Panel>
                    </Accordion.Item>
                    <Accordion.Item value="sorting">
                        <Accordion.Control p={8}>Sorting</Accordion.Control>
                        <Accordion.Panel p={0}>

                            <FCBSMantineTanstackTableActionBarSortingSelect
                                columns={changeColumnSortingColumns}
                                onChange={(columns) => {
                                    setChangeColumnSortingColumns(columns)
                                }}
                                enableMultiple={true}
                            />

                        </Accordion.Panel>
                    </Accordion.Item>
                </Accordion>

            </Box>

            <Group position={"apart"} mt={'xs'}>
                <Button size={'xs'}
                        variant={'default'}
                        onClick={() => {
                            if (formRef.current) formRef.current.reset()

                            setChangeColumnSelectColumns(columnSelectColumns)
                            setChangeColumnSortingColumns(columnSortingColumns)
                            setFilterBuilderValue(storeFilterValue.filterBuilder)
                        }}
                >Cancel</Button>
                <Button size={'xs'}
                        onClick={() => {
                            if (formRef.current) formRef.current.requestSubmit()
                        }}
                >Create View</Button>
            </Group>
        </Box>
    );
};

export default FCBSMantineTanstackTableActionBarViewsAdd;
