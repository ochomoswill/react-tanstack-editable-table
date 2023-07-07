import React from 'react';
import {DxTextArea, DxTextAreaProps} from "./DxTextArea";
import {useController, UseControllerProps} from "react-hook-form";

interface OwnProps {
}

type Props<T> = OwnProps & DxTextAreaProps & UseControllerProps<T>;

export type RHFTextAreaProps<T> = Omit<Props<T>, 'value' | 'onValueChange' | 'validationStatus' | 'validationErrors'>;

export const RHFTextArea = <T, >(props: RHFTextAreaProps<T>) => {
    const {field, fieldState} = useController(props);

    let validationErrors: any = undefined;

    if (fieldState?.error?.message) {
        validationErrors = [{message: fieldState?.error?.message}]
    }

    return (
        <DxTextArea
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
