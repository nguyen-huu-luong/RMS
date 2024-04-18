import { useEffect, useState } from "react";
import fetchClient from "@/lib/fetch-client";
import Card from "@/components/Statistics/Card";
import useSWR from "swr";
import Loading from "../loading";

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

const OrderChart = ({ option }: { option: any }) => {
    const [data,setData] = useState<any>(null)

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
            console.log(chartData)
            setData({
                labels: chartData[0].map((item: any)=> {return item.date}),
                datasets: [
                    {
                        type: "line",
                        label: "Orders",
                        borderColor: "rgb(233, 101, 45)",
                        borderWidth: 2,
                        data: chartData[0].map((item: any)=> {return item.count}),
                    },
                    {
                        type: "line",
                        label: "Profit",
                        backgroundColor: "rgb(14, 156, 255)",
                        data: chartData[0].map((item: any)=> {return item.total_amount}),
                        borderWidth: 2,
                    },
                ],
            })
        }
    }, [chartLoading])
    if (chartLoading || !chartData) return <Loading />;
    if (!data) return <Loading/>
    return (
        <div className='flex flex-col gap-2 justify-start w-full shadow-md h-auto rounded-xl bg-white'>
            <div className='p-7 font-bold text-xl text-black flex flex-row justify-between items-center w-full h-auto bg-white rounded-xl -mb-5'>
                <span>Order Chart</span>
            </div>
            <Chart
                type="bar"
                data={data}
                options={{ responsive: true,maintainAspectRatio: false, aspectRatio: 2}}
              />
        </div>
    );
};

export default OrderChart;
