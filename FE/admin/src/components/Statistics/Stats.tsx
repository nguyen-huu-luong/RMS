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
        data: stats,
        error: statsError,
        isLoading: statsLoading,
    } = useSWR(
        option.beginDate && option.endDate
            ? `/reports/statistics?type=${option.type}&beginDate=${option.beginDate}&endDate=${option.endDate}`
            : `/reports/statistics?type=${option.type}`,
        async (url: string) =>
            await fetchClient({ url: url, data_return: true })
    );

    useEffect(() => {
        if (!statsLoading) {
            if (option.type === "DAILY") {
                setComponent({ ...component, monthlyStats: true });
            } else {
                setComponent({ ...component, topProducts: true });
            }
        }
    }, [statsLoading, option.type]);

    if (statsLoading || !stats) return <Loading />;

    return (
        <div className='flex flex-row justify-between w-full gap-4'>
            <Card name={"Orders"} before={stats.orders.before} current={stats.orders.now} />
            <Card
                name={"Profits"}
                before={stats.profit.before}
                current={stats.profit.now}
            />
            <Card name={"Customers"} before={stats.clients.before} current={stats.clients.now} />
            <Card name={"Emails"} before={150000} current={100000} />
        </div>
    );
};

export default Stats;
