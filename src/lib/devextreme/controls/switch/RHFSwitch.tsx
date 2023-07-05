import React from 'react';
import {DxSwitch, DxSwitchProps} from "./DxSwitch";
import {useController, UseControllerProps} from "react-hook-form";

interface OwnProps {
}

type Props<T> = OwnProps & DxSwitchProps & UseControllerProps<T>;

export type RHFSwitchProps<T> = Omit<Props<T>, 'value' | 'onValueChange' | 'validationStatus' | 'validationErrors'>;

export const RHFSwitch = <T, >(props: RHFSwitchProps<T>) => {
    const {field, fieldState} = useController(props);

    let validationErrors: any = undefined;

    if (fieldState?.error?.message) {
        validationErrors = [{message: fieldState?.error?.message}]
    }

    return (
        <DxSwitch
            value={field.value as boolean}
            onValueChange={(value) => {
                field.onChange(value);
            }}
            validationStatus={fieldState?.invalid ? 'invalid' : 'valid'}
            validationErrors={validationErrors}
            {...props}
        />
    );
};
