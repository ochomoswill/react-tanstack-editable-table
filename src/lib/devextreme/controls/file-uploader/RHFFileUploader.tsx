import React, {FunctionComponent} from 'react';
import {DxFileUploader, DxFileUploaderProps} from "./DxFileUploader";
import {useController, UseControllerProps} from "react-hook-form";

interface OwnProps {
}

type Props = OwnProps & DxFileUploaderProps & UseControllerProps<any>;

export type RHFFileUploaderProps = Omit<Props, 'value'| 'onValueChanged'| 'validationStatus' | 'validationErrors'>;

export const RHFFileUploader: FunctionComponent<RHFFileUploaderProps> = (props) => {
    const {field, fieldState} = useController(props);

    let validationErrors: any = undefined;

    if(fieldState?.error?.message){
        validationErrors = [{message: fieldState?.error?.message}]
    }

    return (
        <DxFileUploader
            value={field.value}
            /*onValueChanged={(e) => {
                field.onChange(e.value);
            }}*/
            onValueChange={(value) => {
                field.onChange(value);
            }}
            validationStatus={fieldState?.invalid ? 'invalid' : 'valid'}
            validationErrors={validationErrors}
            {...props}
        />
    );
};
