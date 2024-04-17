import { useEffect } from "react";
import fetchClient from "@/lib/fetch-client";
import Card from "@/components/Statistics/Card";
import useSWR from "swr";
import Loading from "../loading";

type Option = {
    type: string | "DAILY" | "MONTHLY" | "YEARLY" | "CUSTOM";
    beginDate?: Date;
    endDate?: Date;
};

const Stats = ({
    option,
    component,
    setComponent,
}: {
    option: Option;
    component: any;
    setComponent: any;
}) => {
    const {
        data: profit,
        error: profitError,
        isLoading: profitLoading,
    } = useSWR(
        option.beginDate && option.endDate
            ? `/reports/profit?type=${option.type}&beginDate=${option.beginDate}&endDate=${option.endDate}`
            : `/reports/profit?type=${option.type}`,
        async (url: string) =>
            await fetchClient({ url: url, data_return: true })
    );

    useEffect(() => {
        if (!profitLoading) {
            if (option.type === "DAILY") {
                setComponent({ ...component, monthlyStats: true });
            } else {
                setComponent({ ...component, topProducts: true });
            }
        }
    }, [profitLoading, option.type]);

    if (profitLoading || !profit) return <Loading />;

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
