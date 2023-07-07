/*import {FilterBuilderOperation, GroupOperation} from "devextreme/ui/filter_builder";

const FilterBuilderOperationToGenericSQL: Record<FilterBuilderOperation, string> = {
    "<": "<",                 // ["Product_ID","<",10]                  (Product_ID < 10)
    "<=": "<=",               // ["Product_ID","<=",10]                 (Product_ID <= 10)
    "<>": "<>",               // ["Product_ID","<>",10]                 (Product_ID <> 10)
    "=": "=",                 // ["Product_ID","=",10]                  (Product_ID = 10)
    ">": ">",                 // ["Product_ID",">",10]                  (Product_ID > 10)
    ">=": ">=",               // ["Product_ID",">=",10]                 (Product_ID >= 10)
    between: "BETWEEN",       // ["Product_ID","between",[10,20]]       (Product_ID BETWEEN 10 AND 20)
    contains: "LIKE",         // ["Product_Name","contains","test"]     (Product_Name LIKE '%test%')
    endswith: "LIKE",         // ["Product_Name","endswith","test"]     (Product_Name LIKE '%test')
    isblank: "IS NULL",       // ["Product_ID","=",null]                (Product_ID IS NULL)
    isnotblank: "IS NOT NULL",// ["Product_ID","<>",null]               (Product_ID IS NOT NULL)
    notcontains: "NOT LIKE",  // ["Product_Name","notcontains","res"]   (Product_Name NOT LIKE '%test%')
    startswith: "LIKE"        //["Product_Name","startswith","res"]     (Product_Name LIKE '%test')
}

const GroupOperationToGenericSQL: Record<GroupOperation, string> = {
    and: 'AND',
    or: 'OR',
    notAnd: 'NOT AND',
    notOr: 'NOT OR'
}*/

/*
export const filterBuilderValueToGenericSQLFilter = (filterBuilderValue: FilterBuilderValue): string => {
    // [["Product_ID","between",[10,1000]],"and",["Product_Cost",">",1000],"and",[["Product_Name","contains","sony"],"or",["Product_Name","contains","lg"]],"and",["Product_Retail_Price","<>",null]]
    // ((Product_ID BETWEEN 10 AND 1000) AND (Product_Cost > 1000) AND ((Product_Name LIKE '%sony%') OR (Product_Name LIKE '%lg%')) AND (Product_Retail_Price IS NOT NULL ))

    let strGenericFilter: string = "("

    for (let a = 0; a < (filterBuilderValue ?? []).length;) {
        if (Array.isArray(filterBuilderValue[a])) {
            strGenericFilter += filterBuilderValueToGenericSQLFilter(filterBuilderValue[a] as FilterBuilderValue)
            if (filterBuilderValue[a + 1]) {
                strGenericFilter += ` ${GroupOperationToGenericSQL[filterBuilderValue[a + 1] as GroupOperation]} `
            }
            a = a + 2
        } else {
            const field = filterBuilderValue[a];
            const operator = filterBuilderValue[a + 1] as FilterBuilderOperation;
            const value = filterBuilderValue[a + 2];

            switch (operator) {
                case "<":
                case "<=":
                case "<>":
                case "=":
                case ">":
                case ">=":
                    if (value) strGenericFilter += field + ` ${operator} ` + value;
                    else strGenericFilter += (operator === "<>") ? field + ' IS NOT NULL ' : field + ' IS NULL ';
                    break;
                case "between":
                    strGenericFilter += field + ' BETWEEN ' + (value as [number, number]).join(' AND ');
                    break;
                case "contains":
                    strGenericFilter += field + ' LIKE ' + `'%${value}%'`;
                    break;
                case "endswith":
                    strGenericFilter += field + ' LIKE ' + `'%${value}'`;
                    break;
                case "isblank":
                    strGenericFilter += field + ' IS NULL ';
                    break;
                case "isnotblank":
                    strGenericFilter += field + ' IS NOT NULL ';
                    break;
                case "notcontains":
                    strGenericFilter += field + ' NOT LIKE ' + `'%${value}%'`;
                    break;
                case "startswith":
                    strGenericFilter += field + ' LIKE ' + `'${value}%'`;
                    break;
                default:
                    strGenericFilter += field + ` ${operator} ` + value;
            }
            a = a + 3
        }
    }

    return strGenericFilter + ")"
}
*/

import {ColumnOrderState, SortingState, VisibilityState} from "@tanstack/react-table";
import {dxFilterBuilderField} from "devextreme/ui/filter_builder";
import dayjs from "dayjs";

export type FilterBuilderValue = Array<string | number | boolean | Date | Array<number> | Array<Date> | null | undefined | Array<FilterBuilderValue>>

export const getSortString = (sortModel: SortingState): string => {
    if (sortModel)
        return sortModel.map((sortObj) => `${sortObj.id} ${sortObj.desc ? 'DESC' : 'ASC'}`).join(',');
    return '';
};

export const getColumnsString = (columnOrder: ColumnOrderState, columnVisibility: VisibilityState): string => {
    return columnOrder
        .filter((a) => columnVisibility[a])
        .join(",")
}

// Object mapping to __fcbs__ API filters
export const filterTypes: Record<string, string> = {
    'contains': 'contains',
    'notcontains': '!contains',
    '=': 'eq',
    '<>': '!eq',
    '<': 'lt',
    '<=': 'lte',
    '>': 'gt',
    '>=': 'gte',
    'startswith': 'sw',
    'endswith': 'ew',
    'between': 'btwn',
    'anyof': 'in',
    'noneof': '!in'
};

const hasFilterGroup = (filter: string[] | string): boolean => {
    let yes = false;

    if (typeof filter === 'string')
        return yes;

    for (let a = 0; a < filter.length; a++) {
        if (Array.isArray(filter[a])) {
            yes = true;
            break;
        }
    }
    return yes;
};

const isPreviousItemArray = (item: any) => {
    return Array.isArray(item);
};

export const fcbsFilterToAPIString = (filter: string[] | string, columns: Array<dxFilterBuilderField>) => {
    let str = '';
    for (let a = 0; a < filter.length; a++) {
        //@ts-ignore
        if (hasFilterGroup(filter[a])) {
            // [['field','condition','value'],'or',['field','condition','value']]
            str += `(${fcbsFilterToAPIString(filter[a], columns)})`;
        } else {
            if (Array.isArray(filter[a])) {
                // ['field','condition','value']
                str += `(${fcbsFilterToAPIString(filter[a], columns)})`;
            } else {
                if (isPreviousItemArray(filter[a - 1])) {
                    // 'and', 'or'
                    str += `|${String(filter[a]).toUpperCase()}|`;
                } else {
                    // ['field','condition','value']
                    if (filter[a + 1] === 'isblank') {
                        str += `${filter[a]}:null`;
                    } else if (filter[a + 1] === 'isnotblank') {
                        str += `${filter[a]}:!null`;
                    } else {
                        const dateTimeColumn = columns.find((column) => column.dataType === 'datetime' && column.dataField === filter[a]);

                        if (dateTimeColumn) {

                            if (filter[a + 1] === 'between') {
                                // const dateList = filter[a + 2].split(",");
                                //@ts-ignore
                                const newDateList = filter[a + 2].reduce((newList, rawDate) => {
                                    newList.push(dayjs(rawDate).format('YYYY-MM-DD HH:mm:ss'))
                                    return newList;
                                }, [])


                                str += `${filter[a]}:${filterTypes[filter[a + 1]]}:${newDateList.join(",")}`;
                            } else {
                                //@ts-ignore
                                str += `${filter[a]}:${filterTypes[filter[a + 1]]}:${dayjs(filter[a + 2]).format('YYYY-MM-DD HH:mm:ss')}`;
                            }

                        } else {
                            //@ts-ignore
                            str += `${filter[a]}:${filterTypes[filter[a + 1]]}:${filter[a + 2]}`;
                        }
                    }
                    break;
                }
            }
        }
    }
    return `${str}`;
};
export const filterBuilderValueToGenericSQLFilter = (filterBuilderValue: FilterBuilderValue, columns: Array<dxFilterBuilderField>): string => {
    //@ts-ignore
    return fcbsFilterToAPIString(filterBuilderValue, columns)
}