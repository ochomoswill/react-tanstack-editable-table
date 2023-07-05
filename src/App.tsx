import React from 'react'
import './App.css'
import {IndustryTypes} from "./component/EditableTable/examples/IndustryTypes.tsx";
import {FCBSMantineProvider} from "./lib/mantine/FCBSMantineProvider.tsx";


function App() {


    return (
        <React.Fragment>
            <FCBSMantineProvider>
                <IndustryTypes/>
            </FCBSMantineProvider>
        </React.Fragment>
    )
}


export default App;


