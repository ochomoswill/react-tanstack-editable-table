import React, {FunctionComponent, useEffect, useState} from 'react';
import {DateBox, IDateBoxOptions} from "devextreme-react/date-box";
import {Button} from "devextreme-react/button";


type DxRangeValueType = [Date, Date] | undefined;

interface OwnProps {
    separator?: React.ReactNode
    defaultValue?: DxRangeValueType
    value?: DxRangeValueType
    onFieldChange?: (value: DxRangeValueType) => void
    type: 'datetime' | 'date'
    startDateValidationStatus?: 'valid' | 'invalid'
    startDateValidationErrors?: any
    endDateValidationStatus?: 'valid' | 'invalid'
    endDateValidationErrors?: any
}

type NewDateBoxOptions = Omit<IDateBoxOptions, 'value' | 'onValueChange' | 'defaultValue' | 'onChange' | 'type' | 'openOnFieldClick'>

export type DxRangePickerProps = OwnProps & NewDateBoxOptions;

const DxRangePicker: FunctionComponent<DxRangePickerProps> = (props) => {
    const [startDate, setStartDate] = useState<any>(props?.defaultValue?.[0]);
    const [endDate, setEndDate] = useState<any>(props?.defaultValue?.[1]);

    useEffect(() => {
        if (!!props?.value) {
            if (props?.value?.[0]) {
                setStartDate(props?.value?.[0])
            }

            if (props?.value?.[1]) {
                setEndDate(props?.value?.[1])
            }
        }else{
            setStartDate(undefined)
            setEndDate(undefined)

        }
    }, [props?.value]);


    useEffect(() => {
        if (props?.onFieldChange) {
            if (!startDate && !endDate) {
                props?.onFieldChange(undefined);
            } else {
                props?.onFieldChange([startDate, endDate])
            }
        }
    }, [startDate, endDate])

    const resetEndDate = (newStartDate: string) => {
        if (!!endDate && newStartDate > endDate) {
            setEndDate(undefined);
        }
    }

    const resetRangePicker = () => {
        setStartDate(undefined);
        setEndDate(undefined);
    }

    return (
        <React.Fragment>
            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'baseline', gap: 8}}>
                <div>
                    <DateBox
                        {...props as NewDateBoxOptions}
                        placeholder={'Start Date'}
                        value={startDate}
                        onValueChange={(value) => {
                            setStartDate(value);

                            resetEndDate(value);
                        }}
                        openOnFieldClick={true}
                        // validationStatus={props.startDateValidationStatus}
                        validationStatus={props.startDateValidationStatus}
                        validationErrors={props?.startDateValidationErrors}
                        label={'Start Date'}
                    />
                </div>
                <div>
                    {props?.separator ? props.separator : '~'}
                </div>
                <div>
                    <DateBox
                        {...props as NewDateBoxOptions}
                        placeholder={'End Date'}
                        value={endDate}
                        onValueChange={(value) => {
                            setEndDate(value)
                        }}
                        openOnFieldClick={true}
                        min={startDate}
                        //validationStatus={props.endDateValidationStatus}
                        validationStatus={props.endDateValidationStatus}
                        validationErrors={props?.endDateValidationErrors}
                        label={'End Date'}
                    />
                </div>
                <div>
                    <Button
                        // icon="images/icons/weather.png"
                        text="Clear"
                        onClick={resetRangePicker}
                    />
                </div>
            </div>
        </React.Fragment>
    );
};

export default DxRangePicker;
