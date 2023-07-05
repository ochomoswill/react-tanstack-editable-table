import React, {FunctionComponent} from 'react';
import {DxRadioGroup, DxRadioGroupProps} from "./DxRadioGroup";
import {useController, UseControllerProps} from "react-hook-form";

interface OwnProps {
}

type Props = OwnProps & DxRadioGroupProps & UseControllerProps<any>;

export type RHFRadioGroupProps = Omit<Props, 'value'| 'onValueChange'| 'validationStatus' | 'validationErrors'>;

export const RHFRadioGroup: FunctionComponent<RHFRadioGroupProps> = (props) => {
    const {field, fieldState} = useController(props);

    let validationErrors: any = undefined;

    if(fieldState?.error?.message){
        validationErrors = [{message: fieldState?.error?.message}]
    }

    return (
        <DxRadioGroup
            value={field.value}
            onValueChange={(value) => {
                field.onChange(value);
            }}
            validationStatus={fieldState?.invalid ? 'invalid' : 'valid'}
            validationErrors={validationErrors}
            {...props}
        />
    );
};
