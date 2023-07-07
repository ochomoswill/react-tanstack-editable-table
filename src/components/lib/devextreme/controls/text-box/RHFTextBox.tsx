import React, {FunctionComponent} from 'react';
import {DxTextBox, DxTextBoxProps} from "./DxTextBox";
import {useController, UseControllerProps} from "react-hook-form";

interface OwnProps {
}

type Props<T> = OwnProps & DxTextBoxProps & UseControllerProps<T>;

export type RHFTextBoxProps<T> = Omit<Props<T>, 'value'| 'onValueChange'| 'validationStatus' | 'validationErrors'>;

export const RHFTextBox = <T,>(props: RHFTextBoxProps<T>) => {
    const {field, fieldState} = useController(props);

    let validationErrors: any = undefined;

    if(fieldState?.error?.message){
        validationErrors = [{message: fieldState?.error?.message}]
    }

    return (
        <DxTextBox
            value={field.value as string}
            onValueChange={(value) => {
                field.onChange(value);
            }}
            validationStatus={fieldState?.invalid ? 'invalid' : 'valid'}
            validationErrors={validationErrors}
            {...props}
        />
    );
};
