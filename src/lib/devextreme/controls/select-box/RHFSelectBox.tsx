import React, { FunctionComponent } from 'react';
import {DxSelectBox, DxSelectBoxProps} from "./DxSelectBox";
import {useController, UseControllerProps} from "react-hook-form";

interface OwnProps {}

type Props<T> = OwnProps & DxSelectBoxProps & UseControllerProps<T>;
export type RHFSelectBoxProps<T> = Omit<Props<T>, 'value'| 'onValueChange'| 'onFocusOut' | 'validationStatus'| 'validationErrors'>

export const RHFSelectBox = <T,>(props: RHFSelectBoxProps<T>) => {
  const {field, fieldState} = useController(props);

  let validationErrors: any = undefined;

  if(fieldState?.error?.message){
    validationErrors = [{message: fieldState?.error?.message}]
  }

  return (
      <DxSelectBox
          value={field.value}
          onValueChange={(value) => {
            field.onChange(value);
          }}
          onFocusOut={(e) => {
            // @ts-ignore
            field.onBlur(e.event.originalEvent as Event)
          }}
          validationStatus={fieldState?.invalid ? 'invalid' : 'valid'}
          validationErrors={validationErrors}
          {...props}
      />
  );
};

