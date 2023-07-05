import React, {FunctionComponent} from 'react';
import {DxHtmlEditor, DxHtmlEditorProps} from "./DxHtmlEditor";
import {useController, UseControllerProps} from "react-hook-form";

interface OwnProps {
    children?:any
}


type Props = OwnProps & DxHtmlEditorProps & UseControllerProps<any>;

export type RHFHtmlEditorProps = Omit<Props, 'value'| 'onValueChange'| 'validationStatus' | 'validationErrors'>;

export const RHFHtmlEditor: FunctionComponent<RHFHtmlEditorProps> = (props) => {
    const {field, fieldState} = useController(props);

    let validationErrors: any = undefined;

    if(fieldState?.error?.message){
        validationErrors = [{message: fieldState?.error?.message}]
    }

    return (
        <DxHtmlEditor
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
