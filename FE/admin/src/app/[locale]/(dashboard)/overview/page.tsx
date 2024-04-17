"use client";
import React, { useState, Suspense } from "react";
import Stats from "@/components/Statistics/Stats";
import TimeBar from "@/components/Statistics/TimeBar";
import TopChart from "@/components/Statistics/TopChart";
type Option = {
    type: string | "DAILY" | "MONTHLY" | "YEARLY" | "CUSTOM";
    beginDate?: Date;
    endDate?: Date;
};

function Overview() {
    const daily: Option = { type: "DAILY" };
    const [option, setOption] = useState<Option>({
        type: "MONTHLY",
    });
    const [component, setComponent] = useState<any>({
        dailyStats: false,
        monthlyStats: false,
        topProducts: false,
        topCustomers: false,
    });
    return (
        <div className='w-full h-auto overflow-scroll p-4 flex flex-col gap-4 justify-start items-center'>
            <Stats
                option={daily}
                setComponent={setComponent}
                component={component}
            />
            <TimeBar
                option={option}
                setOption={setOption}
                setComponent={setComponent}
            />
            {component.monthlyStats && (
                <Stats
                    option={option}
                    setComponent={setComponent}
                    component={component}
                />
            )}
            <div className='w-full flex flex-row gap-5 justify-start '>
                {component.topProducts && (
                    <TopChart
                        name={"Top products"}
                        type={"products"}
                        option={option}
                        setComponent={setComponent}
                        component={component}
                    />
                )}
                {component.topCustomers && (
                    <TopChart
                        name={"Top customers"}
                        type={"customers"}
                        option={option}
                        setComponent={setComponent}
                        component={component}
                    />
                )}
            </div>
        </div>
    );
}

export default Overview;