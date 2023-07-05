import React, {FunctionComponent, useState} from 'react';
import {HtmlEditor, IHtmlEditorOptions} from 'devextreme-react/html-editor';


interface OwnProps {
}

export type DxHtmlEditorProps = OwnProps & IHtmlEditorOptions;

export const DxHtmlEditor: FunctionComponent<DxHtmlEditorProps> = (props) => {

    return (
        <HtmlEditor
            //valueType="html"
            {...props}
        />
    );
};

