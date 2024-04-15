"use client";
import { useState } from "react";
import fetchClient from "@/lib/fetch-client";
import Card from "@/components/Statistics/Card";
import useSWR from "swr";
import Loading from "../loading";
type Option = {
    type: string | "DAILY" | "MONTHLY" | "YEARLY" | "CUSTOM";
    beginDate?: Date;
    endDate?: Date;
};
const Stats = ({ option }: { option: Option }) => {
    const {
        data: profit,
        error: profitError,
        isLoading: profitLoading,
    } = useSWR(
        option.beginDate && option.endDate
            ? `/reports/profit?type=${option.type}&beginDate=${option.beginDate}&endDate=${option.endDate}`
            : `/reports/profit?type=${option.type}`,
        (url: string) => fetchClient({ url: url, data_return: true })
    );
    if (!profit || profitLoading) return <Loading />;
    return (
        <div className='flex flex-row justify-between w-full gap-4'>
            <Card name={"Orders"} before={150000} current={100000} />
            <Card
                name={"Profits"}
                before={profit.before}
                current={profit.now}
            />
            <Card name={"Orders"} before={150000} current={100000} />
            <Card name={"Orders"} before={150000} current={100000} />
        </div>
    );
};

export default Stats;
