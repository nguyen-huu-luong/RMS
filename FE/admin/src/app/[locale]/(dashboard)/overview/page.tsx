"use client";
import { useState } from "react";
import Stats from "@/components/Statistics/Stats";
import TimeBar from "@/components/Statistics/TimeBar";
type Option = {
    type: string | "DAILY" | "MONTHLY" | "YEARLY" | "CUSTOM";
    beginDate?: Date;
    endDate?: Date;
};

function Overview() {
    const daily: Option = {type:"DAILY"};
    const [option, setOption] = useState<Option>({
      type: "MONTHLY",      
    });
    const [dateRange, setDateRange] = useState<any>(null);
    return (
        <div className='w-full h-auto overflow-scroll p-4 flex flex-col gap-4 justify-start items-center'>
            <Stats option={daily} />
            <TimeBar option={option} setOption={setOption}/>
            <Stats option={option} />
        </div>
    );
}

export default Overview;
