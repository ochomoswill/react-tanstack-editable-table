import React, {FunctionComponent, PropsWithChildren} from 'react';
import {IFilterBuilderProps} from "devextreme-react/data-grid";
import {FilterBuilder} from "devextreme-react";

interface OwnProps {
}

export type DxFilterBuilderProps = OwnProps & PropsWithChildren<IFilterBuilderProps>;

export const DxFilterBuilder: FunctionComponent<DxFilterBuilderProps> = (props) => {

    return (
        <FilterBuilder
            {...props}
            onValueChange={(e) => {
                console.log('@onValueChange ', e);
            }}
        />
    );
};



