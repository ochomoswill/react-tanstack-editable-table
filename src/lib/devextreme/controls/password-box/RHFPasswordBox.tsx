import React, {FunctionComponent} from 'react';
import {DxPasswordBox, DxPasswordBoxProps} from "./DxPasswordBox";
import {useController, UseControllerProps} from "react-hook-form";

interface OwnProps {
}

type Props<T> = OwnProps & DxPasswordBoxProps & UseControllerProps<T>;

export type RHFPasswordBoxProps<T> = Omit<Props<T>, 'value'| 'onValueChange'| 'validationStatus' | 'validationErrors'>;

export const RHFPasswordBox = <T,>(props: RHFPasswordBoxProps<T>) => {
    const {field, fieldState} = useController(props);

    let validationErrors: any = undefined;

    if(fieldState?.error?.message){
        validationErrors = [{message: fieldState?.error?.message}]
    }



    return (
        <DxPasswordBox
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

