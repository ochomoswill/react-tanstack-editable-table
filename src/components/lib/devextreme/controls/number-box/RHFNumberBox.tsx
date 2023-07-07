import React, {FunctionComponent} from 'react';
import {DxNumberBox, DxNumberBoxProps} from "./DxNumberBox";
import {useController, UseControllerProps} from "react-hook-form";

interface OwnProps {
}

type Props<T> = OwnProps & DxNumberBoxProps & UseControllerProps<T>;

export type RHFNumberBoxProps<T> = Omit<Props<T>, 'value'| 'onValueChange'| 'validationStatus' | 'validationErrors'>;

export const RHFNumberBox = <T, >(props: RHFNumberBoxProps<T>) => {
    const {field, fieldState} = useController(props);

    let validationErrors: any = undefined;

    if(fieldState?.error?.message){
        validationErrors = [{message: fieldState?.error?.message}]
    }

    return (
        <DxNumberBox
            value={field.value as number}
            onValueChange={(value) => {
                field.onChange(value);
            }}
            validationStatus={fieldState?.invalid ? 'invalid' : 'valid'}
            validationErrors={validationErrors}
            {...props}
        />
    );
};
