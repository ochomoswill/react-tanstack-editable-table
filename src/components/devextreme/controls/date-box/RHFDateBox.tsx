import React, {FunctionComponent} from 'react';
import {DxDateBox, DxDateBoxProps} from "./DxDateBox";
import {Controller, useController, UseControllerProps} from "react-hook-form";

interface OwnProps {
}

type Props<T> = OwnProps & DxDateBoxProps & UseControllerProps<T>;

export type RHFDateBoxProps<T> = Omit<Props<T>, 'value'| 'onValueChange'| 'validationStatus' | 'validationErrors'>;

export const RHFDateBox = <T, >(props: RHFDateBoxProps<T>) => {
    const {field, fieldState} = useController(props);

    let validationErrors: any = undefined;

    if(fieldState?.error?.message){
        validationErrors = [{message: fieldState?.error?.message}]
    }

    return (
        <DxDateBox
            value={field.value as string}
            onValueChange={(value) => {
                field.onChange(value);
            }}
            validationStatus={fieldState?.invalid ? 'invalid' : 'valid'}
            validationErrors={validationErrors}
            openOnFieldClick={true}
            {...props}
        />
    );
};
