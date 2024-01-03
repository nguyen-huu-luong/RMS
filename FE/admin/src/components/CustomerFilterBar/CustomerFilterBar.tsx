import { Button } from "antd";
import React from "react";
import { SelectInput } from "./SelectInput";
import { MyDatePicker } from "./DatePicker";
import { PlusCircleFilled, PlusCircleOutlined } from "@ant-design/icons";

const ontions = [
    {
        key: 1,
        title: 'Source',
        type: 'select',
        items: [
            "Web",
            "Facebook",
            "Campaign"
        ]
    },
    {
        key: 2,
        title: 'Source',
        type: 'date',
        items: [
            "Web",
            "Facebook",
            "Campaign"
        ]
    },

]
export const CustomerFilterBar: React.FC = () => {
    return <main className="bg-white w-full py-2 px-3 rounded-md border">
        <div className="mb-4 flex space-x-3">
            <SelectInput />
            <SelectInput />
            <SelectInput />
            <SelectInput />
            <MyDatePicker />
            <MyDatePicker />
        </div>
        <div className="flex space-x-2">
            <Button icon={<PlusCircleOutlined />}>Add Filter</Button>
            <Button>Clear filter</Button>
            <Button type="primary" className="bg-primary">Apply</Button>
        </div>
    </main>
}
