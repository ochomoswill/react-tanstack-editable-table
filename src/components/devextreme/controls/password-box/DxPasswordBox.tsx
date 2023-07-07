import React, {FunctionComponent, useState} from 'react';
import {Button as TextBoxButton} from 'devextreme-react/text-box';
import {DxTextBox, DxTextBoxProps} from "../text-box";


interface OwnProps {
}

type Props = OwnProps & DxTextBoxProps;

export type DxPasswordBoxProps = Omit<Props, 'mode'>

export const DxPasswordBox: FunctionComponent<DxPasswordBoxProps> = (props) => {
    const [showPassword, setShowPassword] = useState<boolean>(false);

    return (
        <DxTextBox
            mode={showPassword ? 'text' : 'password'}
            {...props}
        >
            {/*<TextBoxButton
                name="password"
                location="after"
                options={{
                    icon: (<p>Hello</p>),
                    type: 'default',
                    onClick: () => {
                        setShowPassword((prevPasswordMode) => {
                            return !prevPasswordMode
                        })
                    },
                }}
            />*/}

            <TextBoxButton
                name="password"
                location="after"
                options={{
                    icon: showPassword ? '/assets/hide-password.png' : '/assets/show-password.png',
                    type: 'normal',
                    title: showPassword ? 'Hide Password' : 'Show Password',
                    stylingMode:"text",
                    onClick: () => {
                        setShowPassword((prevPasswordMode) => {
                            return !prevPasswordMode
                        })
                    },
                }}
            />
        </DxTextBox>
    );
};

