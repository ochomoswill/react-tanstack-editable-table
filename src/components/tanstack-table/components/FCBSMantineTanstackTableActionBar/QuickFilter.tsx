import React, {FunctionComponent, useEffect, useMemo, useState} from 'react';
import {ActionIcon, Group, NumberInput, Select, Text, TextInput, useMantineTheme} from "@mantine/core";
import {Field} from "devextreme/ui/filter_builder";
import {DateInput} from "@mantine/dates";
import {IconFilter, IconX} from "@tabler/icons-react";
import {
    useFCBSMantineTanstackTableFilterStoreSetValue,
    useFCBSMantineTanstackTableFilterStoreValue
} from "./../../stores/filter";
import {FilterBuilderValue, filterBuilderValueToGenericSQLFilter} from "./../../utils";

type QuickFilterType = number | string | boolean | Date | null

export type FCBSMantineTanstackTableActionBarQuickFilterConfig =
    Pick<FCBSMantineTanstackTableActionBarQuickFilterProps, 'fields' | 'onChange'>

export interface FCBSMantineTanstackTableActionBarQuickFilterProps {
    fields: Array<Field>
    onChange: (value: FilterBuilderValue, sqlLikeFilter: string) => void
}

const FCBSMantineTanstackTableActionBarQuickFilter: FunctionComponent<FCBSMantineTanstackTableActionBarQuickFilterProps> = (props) => {
    const {fields} = props

    const theme = useMantineTheme()

    // Zustand
    const storeValue = useFCBSMantineTanstackTableFilterStoreValue();
    const setStoreValue = useFCBSMantineTanstackTableFilterStoreSetValue();

    const [selected, setSelected] = useState<string>('');
    const selectedField = useMemo(() => {
        return fields.filter((a) => ((a.dataField || a.name) === selected))[0]
    }, [selected, fields])

    const [filter, setFilter] = useState<QuickFilterType>();

    useEffect(() => {
        if (filter === undefined) {
            setStoreValue({
                filterBuilder: [],
                sqlLike: ''
            })
            props.onChange([], '')
        }
    }, [filter]);

    const SelectColumns = useMemo(() => {
        return (
            <Select size={'xs'}
                    placeholder="Columns"
                    searchable={true}
                    nothingFound={"Column not found!"}
                    clearable={true}

                    data={fields.map((a) => ({
                        label: a.caption ?? '',
                        value: a.dataField ?? a.name ?? ''
                    }))}
                    onChange={(...args) => {
                        setSelected(args[0] ?? '')
                        setFilter(null)
                    }}
                    value={selected}
            />
        )
    }, [fields, selected])

    const FilterInput = useMemo( () => {
        if (selectedField) {
            switch (selectedField.dataType) {
                case "number":
                    return <NumberInput size={'xs'}
                                        placeholder="value"

                                        value={filter ? Number(filter) : undefined}
                                        onChange={(...args) => {
                                            setFilter(args[0])
                                        }}
                    />
                case "string":
                case "object":
                    if (selectedField.lookup) {
                        // TODO: Find solution for this...
                        /*const fetch = await (selectedField.lookup.dataSource as CustomStore).load()

                        const data = Array.isArray(fetch) ? fetch : [];

                        return <Select size={'xs'}
                                       clearable={true}
                                       data={data as SelectItem[]}

                                       value={String(filter)}
                                       onChange={(...args) => {
                                           if (args[0]) {
                                               setFilter(args[0])
                                           } else {
                                               setFilter(undefined)
                                           }
                                       }}
                        />*/
                        return <TextInput size={'xs'}
                                          placeholder="value"

                                          value={filter ? String(filter) : ''}
                                          onChange={(...args) => {
                                              setFilter(args[0].target.value)
                                          }}
                        />
                    } else {
                        return <TextInput size={'xs'}
                                          placeholder="value"

                                          value={filter ? String(filter) : ''}
                                          onChange={(...args) => {
                                              setFilter(args[0].target.value)
                                          }}
                        />
                    }
                case "date":
                    return <DateInput size={'xs'}
                                      placeholder={'value'}
                                      valueFormat={"YYYY-MM-DD"}

                                      value={filter ? filter as Date : undefined}
                                      onChange={(...args) => {
                                          if (args[0]) {
                                              setFilter(args[0])
                                          } else {
                                              setFilter(undefined)
                                          }
                                      }}
                                      clearable={true}
                    />
                case "datetime":
                    return <DateInput size={'xs'}
                                      placeholder={'value'}
                                      valueFormat={"YYYY-MM-DD HH:mm:ss"}

                                      value={filter ? filter as Date : undefined}
                                      onChange={(...args) => {
                                          if (args[0]) {
                                              setFilter(args[0])
                                          } else {
                                              setFilter(undefined)
                                          }
                                      }}
                                      clearable={true}
                    />
                case "boolean":
                    return <Select size={'xs'}
                                   clearable={true}
                                   data={[
                                       {label: 'true', value: 'true'},
                                       {label: 'false', value: 'false'},
                                   ]}

                                   value={filter === undefined ? undefined : String(filter)}
                                   onChange={(...args) => {
                                       if (args[0]) {
                                           setFilter(args[0] === 'true')
                                       } else {
                                           setFilter(undefined)
                                       }
                                   }}
                    />
                default:
                    return <TextInput size={'xs'}
                                      placeholder="value"

                                      value={filter ? String(filter) : ''}
                                      onChange={(...args) => {
                                          setFilter(args[0].target.value)
                                      }}
                    />
            }
        } else {
            return (
                <TextInput size={'xs'}
                           disabled={true}
                           readOnly={true}
                           value={''}
                           placeholder="value"/>
            )
        }
    }, [selectedField, filter])

    useEffect(() => {
        if (
            (storeValue.filterBuilder.length === 3) &&
            (typeof storeValue.filterBuilder[0] === "string") &&
            (storeValue.filterBuilder[1] === "=")
        ) {
            setSelected(storeValue.filterBuilder[0])
            if (storeValue.filterBuilder[2]) setFilter(storeValue.filterBuilder[2] as QuickFilterType)
        } else {
            setSelected('')
            setFilter(null)
        }
    }, [storeValue.filterBuilder]);

    return (
        <Group spacing={'xs'}>
            <Text size={'sm'}>Quick Filter</Text>
            <Group spacing={0}>
                {SelectColumns}
                {FilterInput}
                {filter !== null &&
                    <React.Fragment>
                        <ActionIcon color="lime"
                                    variant="filled"
                                    ml={'xs'}
                                    radius={'sm'}
                                    onClick={() => {
                                        const value = [
                                            selected,
                                            "=",
                                            filter
                                        ];

                                        const strValue = filterBuilderValueToGenericSQLFilter(value, fields);

                                        setStoreValue({
                                            filterBuilder: value,
                                            sqlLike: strValue
                                        })

                                        props.onChange(value, strValue)
                                    }}
                        >
                            <IconFilter size={theme.fontSizes.sm}/>
                        </ActionIcon>
                        <ActionIcon ml={'xs'}
                                    radius={'sm'}
                                    onClick={() => {
                                        setStoreValue({
                                            filterBuilder: [],
                                            sqlLike: ''
                                        })

                                        props.onChange([], '')
                                    }}
                        >
                            <IconX size={theme.fontSizes.sm}/>
                        </ActionIcon>
                    </React.Fragment>
                }
            </Group>
        </Group>
    );
};

export default FCBSMantineTanstackTableActionBarQuickFilter;
