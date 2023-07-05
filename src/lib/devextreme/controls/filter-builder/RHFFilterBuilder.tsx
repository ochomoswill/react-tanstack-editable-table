import React, {FunctionComponent} from 'react';
import {DxFilterBuilder, DxFilterBuilderProps} from "./DxFilterBuilder";
import {useController, UseControllerProps} from "react-hook-form";

interface OwnProps {
}

type Props<T> = OwnProps & DxFilterBuilderProps & UseControllerProps<T>;

export type RHFFilterBuilderProps<T> = Omit<Props<T>, 'value'| 'onValueChange'| 'validationStatus' | 'validationErrors'>;

export const RHFFilterBuilder = <T,>(props: RHFFilterBuilderProps<T>) => {
    const {field, fieldState} = useController(props);

    return (
        <DxFilterBuilder
            value={field.value as string}
            onValueChange={(value) => {
                field.onChange(value);
            }}
            {...props}
        />
    );
};
