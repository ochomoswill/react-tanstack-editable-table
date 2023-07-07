import {create} from "zustand";
import {FilterBuilderValue} from "./../utils";

type Value = {
    filterBuilder: FilterBuilderValue
    sqlLike: string
}

type FCBSMantineTanstackTableFilterState = {
    value: Value
}

type FCBSMantineTanstackTableFilterActions = {
    setValue: (value: Value) => void
}

const useFCBSMantineTanstackTableFilterStore = create<FCBSMantineTanstackTableFilterState & FCBSMantineTanstackTableFilterActions>(
    (setState, getState, store) => {
        return {
            value: {
                filterBuilder: [],
                sqlLike: ''
            },
            setValue: (value) => setState((state) => ({
                value
            }))
        }
    }
)

export const useFCBSMantineTanstackTableFilterStoreValue: () => FCBSMantineTanstackTableFilterState['value'] =
    () => useFCBSMantineTanstackTableFilterStore((state) => state.value)

export const useFCBSMantineTanstackTableFilterStoreSetValue: () => FCBSMantineTanstackTableFilterActions['setValue'] =
    () => useFCBSMantineTanstackTableFilterStore((state) => state.setValue)