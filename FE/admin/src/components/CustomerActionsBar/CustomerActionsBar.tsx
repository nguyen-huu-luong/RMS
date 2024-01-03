import { Button } from "antd";
import React from "react";

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
export const CustomerActionBar: React.FC = () => {
    return <main className="bg-white w-full py-2 px-3 rounded-md border">
        <div className="mb-4 flex space-x-2">
            abc
        </div>
    </main>
}
