import { useEffect, useState } from "react";
import fetchClient from "@/lib/fetch-client";
import Card from "@/components/Statistics/Card";
import useSWR from "swr";
import Loading from "../loading";
import { useLocale, useTranslations } from "next-intl";

import {
    Chart as ChartJS,
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Tooltip,
    LineController,
    BarController,
    ChartData,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import moment from "moment";
ChartJS.register(
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Tooltip,
    LineController,
    BarController
);

const OrderChart = ({ option, component, setComponent }: { option: any, component: any, setComponent: any }) => {
    const [data, setData] = useState<any>(null);
    const t = useTranslations('Overview')
    const {
        data: chartData,
        error: chartError,
        isLoading: chartLoading,
    } = useSWR(
        option.beginDate && option.endDate
            ? `/reports/charts?type=${option.type}&beginDate=${option.beginDate}&endDate=${option.endDate}`
            : `/reports/charts?type=${option.type}`,
        async (url: string) =>
            await fetchClient({ url: url, data_return: true })
    );
    useEffect(() => {
        if (!chartLoading && chartData) {
            setComponent({...component, leadChart: true});
            const sortedChartData = chartData[0].sort((a: any, b: any) => {
                return new Date(a.date).valueOf() - new Date(b.date).valueOf();
            });

            const custom: any = [];
            const groupedData: any = {};
            sortedChartData.forEach((item: any) => {
                const yearMonth = moment(item.date).format("YYYY-MM");
                if (!groupedData[yearMonth]) {
                    groupedData[yearMonth] = {
                        date: yearMonth,
                        count: 0,
                        total_amount: 0,
                    };
                }
                groupedData[yearMonth].count += parseInt(item.count, 10);
                groupedData[yearMonth].total_amount += parseInt(
                    item.total_amount,
                    10
                );
            });
            Object.keys(groupedData).forEach((key) => {
                custom.push(groupedData[key]);
            });
           
            setData({
                labels:
                    (option.type == "YEARLY" || option.type == "CUSTOM") &&
                    custom.length > 3
                        ? custom.map((item: any) => {
                              return item.date;
                          })
                        : sortedChartData.map((item: any) => {
                              return item.date;
                          }),
                datasets: [
                    {
                        type: "line",
                        label: t('orders'),
                        borderColor: "rgb(233, 101, 45)",
                        borderWidth: 2,
                        data:
                            (option.type == "YEARLY" ||
                                option.type == "CUSTOM") &&
                            custom.length > 3
                                ? custom.map((item: any) => {
                                      return item.count;
                                  })
                                : sortedChartData.map((item: any) => {
                                      return item.count;
                                  }),
                        yAxisID: "y",
                    },
                    {
                        type: "line",
                        label: t('profits'),
                        backgroundColor: "rgb(14, 156, 255)",
                        data:
                            (option.type == "YEARLY" ||
                                option.type == "CUSTOM") &&
                            custom.length > 3
                                ? custom.map((item: any) => {
                                      return item.total_amount;
                                  })
                                : sortedChartData.map((item: any) => {
                                      return item.total_amount;
                                  }),
                        borderWidth: 2,
                        yAxisID: "y1",
                    },
                ],
            });
        }
    }, [chartLoading]);
    if (chartLoading || !chartData) return <Loading />;
    if (!data) return <Loading />;
    return (
        <div className='flex flex-col gap-2 justify-start w-full shadow-md h-auto rounded-xl bg-white'>
            <div className='p-7 font-bold text-xl text-black flex flex-row justify-between items-center w-full h-auto bg-white rounded-xl -mb-5'>
                <span>{t('orders-chart')}</span>
            </div>
            <div className='p-7 w-full h-[450px]'>
                <Chart
                    type='bar'
                    data={data}
                    options={{
                        elements: {
                            line: {
                                tension: 0.5,
                            },
                        },
                        maintainAspectRatio: false,
                        aspectRatio: 1,
                        scales: {
                            y: {
                                type: "linear" as const,
                                display: true,
                                position: "left" as const,
                            },
                            y1: {
                                type: "linear" as const,
                                display: true,
                                position: "right" as const,
                                grid: {
                                    drawOnChartArea: false,
                                },
                            },
                        },
                    }}
                />
            </div>
        </div>
    );
};

export default OrderChart;
