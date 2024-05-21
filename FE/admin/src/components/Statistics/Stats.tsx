import { useEffect } from "react";
import fetchClient from "@/lib/fetch-client";
import Card from "@/components/Statistics/Card";
import useSWR from "swr";
import Loading from "../loading";
import { useTranslations } from "next-intl";

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
    const t = useTranslations('Overview')
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
            <Card name={t('orders')} before={stats.orders.before} current={stats.orders.now} />
            <Card
                name={t('profits')}
                before={stats.profit.before}
                current={stats.profit.now}
            />
            <Card name={t('customers')} before={stats.clients.before} current={stats.clients.now} />
            <Card name={t('emails')} before={150000} current={100000} />
        </div>
    );
};

export default Stats;
