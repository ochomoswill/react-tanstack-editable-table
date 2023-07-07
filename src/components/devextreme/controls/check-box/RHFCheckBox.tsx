import React from 'react';
import {DxCheckBox, DxCheckBoxProps} from "./DxCheckBox";
import {useController, UseControllerProps} from "react-hook-form";

interface OwnProps {
}

type Props<T> = OwnProps & DxCheckBoxProps & UseControllerProps<T>;

export type RHFCheckBoxProps<T> = Omit<Props<T>, 'value' | 'onValueChange' | 'validationStatus' | 'validationErrors'>;

export const RHFCheckBox = <T, >(props: RHFCheckBoxProps<T>) => {
    const {field, fieldState} = useController(props);

    let validationErrors: any = undefined;

    if (fieldState?.error?.message) {
        validationErrors = [{message: fieldState?.error?.message}]
    }

    return (
        <DxCheckBox
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
