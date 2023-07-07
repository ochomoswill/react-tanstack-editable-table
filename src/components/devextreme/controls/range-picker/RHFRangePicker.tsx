import React, {FunctionComponent} from 'react';
import {useController, UseControllerProps} from 'react-hook-form';
import DxRangePicker, {DxRangePickerProps} from "./DxRangePicker";

interface OwnProps {
    //form: UseFormReturn
}

type CleansedDxRangePickerProps = Omit<DxRangePickerProps, 'onFieldChange' | 'onFocusOut' | 'startDateValidationStatus' | 'endDateValidationStatus'>;
export type RHFRangePickerProps = OwnProps & UseControllerProps<any> & CleansedDxRangePickerProps;

export const RHFRangePicker: FunctionComponent<RHFRangePickerProps> = (props) => {
    const {field, fieldState, formState} = useController(props);

    // console.log('@field ', field);
    // console.log('@fieldState ', fieldState);
    // console.log('@formState.errors ', formState.errors);

    let startDateValidationStatus: any = 'valid';
    let startDateValidationErrors: any = undefined;
    let endDateValidationStatus: any = 'valid';
    let endDateValidationErrors: any = undefined;


    if (fieldState.invalid) {
        if(fieldState?.error?.type === 'required'){
            startDateValidationStatus = 'invalid'
            startDateValidationErrors = [{message: 'Start Date is required!'}]
            endDateValidationStatus = 'invalid'
            endDateValidationErrors = [{message: 'End Date is required!'}]
        }

        if (fieldState?.error?.type === 'startDateRequired') {
            startDateValidationStatus = 'invalid'
            startDateValidationErrors = [{message: fieldState?.error?.message}, {message: fieldState?.error?.message}]
        }

        if (fieldState?.error?.type === 'endDateRequired') {
            endDateValidationStatus = 'invalid'
            endDateValidationErrors = [{message: fieldState?.error?.message}]
        }
    }

    return (
        <DxRangePicker
            value={field.value}
            onFieldChange={(value) => {
                field.onChange(value);
            }}
            onFocusOut={(e) => {
                // @ts-ignore
                field.onBlur(e.event.originalEvent as Event)
            }}
            startDateValidationStatus={startDateValidationStatus}
            startDateValidationErrors={startDateValidationErrors}
            endDateValidationStatus={endDateValidationStatus}
            endDateValidationErrors={endDateValidationErrors}
            {...props as CleansedDxRangePickerProps}
        />
    );
};

