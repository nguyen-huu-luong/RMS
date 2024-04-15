"use client";
import { useState } from "react";
import { DatePicker } from "antd";
const { RangePicker } = DatePicker;
import { Radio } from "antd";
type Option = {
    type: string | "DAILY" | "MONTHLY" | "YEARLY" | "CUSTOM";
    beginDate?: Date;
    endDate?: Date;
};
const TimeBar = ({ option, setOption }: { option: Option; setOption: any }) => {
    const [type, setType] = useState<string>("MONTHLY")
    const options = [
        {
            label: "Monthly",
            value: "MONTHLY",
        },
        {
            label: "Yearly",
            value: "YEARLY",
        },
        {
            label: "Custom",
            value: "CUSTOM",
        },
    ];
    const onChangeType = ({ target: { value } }: { target: any }) => {
        if (value != "CUSTOM") setOption({ ...option, type: value });
        setType(value);
    };

    const handleRangeChange = (dates: any) => {
        if (dates.length > 0) setOption({ type: "CUSTOM", beginDate: dates[0], endDate: dates[1] });
    };
    return (
        <div className='w-full h-auto flex flex-row p-2 rounded-xl border-2 bg-white text-black justify-center gap-4'>
            <div className='w-60'>
                <Radio.Group
                    options={options}
                    onChange={onChangeType}
                    value={type}
                    optionType='button'
                    buttonStyle='solid'
                />
            </div>
            {type === "CUSTOM" ? (
                <RangePicker  onChange={handleRangeChange} />
            ) : (
                <></>
            )}
        </div>
    );
};

export default TimeBar;