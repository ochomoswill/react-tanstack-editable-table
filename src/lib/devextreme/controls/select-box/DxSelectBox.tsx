import SelectBox, {ISelectBoxOptions} from 'devextreme-react/select-box';
import React, {FunctionComponent} from 'react';

interface OwnProps {
}

export type DxSelectBoxProps = OwnProps & ISelectBoxOptions;

export const DxSelectBox: FunctionComponent<DxSelectBoxProps> = (props) => {

    return (
        <SelectBox
            {...props}
        />
    );
};

