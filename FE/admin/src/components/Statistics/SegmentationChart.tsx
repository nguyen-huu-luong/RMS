"use client";
import { useState, useEffect } from "react";
import { DatePicker } from "antd";
const { RangePicker } = DatePicker;
import { Radio } from "antd";
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
import Loading from "../loading";
import fetchClient from "@/lib/fetch-client";
import { FilterDate } from "../TableComponents/FilterItems/FilterDate";

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

const SegmentationChart = () => {

    const dateFormat = "YYYY-MM-DD";

    const options = [
        {
            label: "Monthly",
            value: "Month",
        },
        {
            label: "Yearly",
            value: "Year",
        },
        {
            label: "Custom",
            value: "Custom",
        },
    ];

    const [data, setData] = useState<any>([])
    const [isLoading, setIsLoading] = useState(true)
    const [type, setType] = useState<string>("Month")
    const [dateFilter, setDateFilter] = useState<any>(null)

    const backGroundColor = ["rgb(233, 101, 45)",
        "rgb(14, 156, 255)",
        'rgba(255, 99, 132)',
        'rgba(255, 206, 86)',
        'rgba(75, 192, 192)',
        'rgba(153, 102, 255)',
        'rgba(255, 159, 64)',]

    const borderColor = ["rgb(233, 101, 45, 0.2)",
        "rgb(14, 156, 255, 0.2)",
        'rgba(255, 99, 132, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',]

    const fetchData = async () => {
        try {
            setIsLoading(true)
            let url = ""
            let idx_sub = 0
            let factor = ""
            let fetcher = false
    
            if (type == "Month") {
                url = "/groups/filter?type=Month"
                idx_sub = 7
                factor = "month"
                fetcher = true
            }
            else if (type == "Year") {
                url = "/groups/filter?type=Year"
                idx_sub = 4
                factor = "year"
                fetcher = true
            }
            else if (type == "Custom") {
                url = `/groups/filter?type=Customize&start_date=${dateFilter["start_date"]}&end_date=${dateFilter["end_date"]}`
                idx_sub = 10
                factor = "convertDate"
                fetcher = true
            }
    
            if (fetcher) {
                console.log(url)
                const group_name = await fetchClient({ url: "/groups/all", data_return: true })
    
                let datasets_temp: any = []
                let labels_temp: any = []
    
                group_name.map((item: any, index: any) => {
                    datasets_temp.push({
                        label: item.name,
                        data: [],
                        borderWidth: 2,
                        backgroundColor: backGroundColor[index],
                        borderColor: borderColor[index]
                    })
                })
    
                const data_temp = await fetchClient({ url: url, data_return: true })
    
                data_temp.map((item: any) => {
                    labels_temp.push(item[factor].substring(0, idx_sub))
                    datasets_temp.map((record: any) => {
                        if (record.label in item) {
                            record.data.push(Number(item[record.label]))
                        }
                        else {
                            record.data.push(0)
                        }
                    })
                })
    
                setData({
                    labels: labels_temp,
                    datasets: datasets_temp
    
                })
    
                setIsLoading(false)
            }
        }
        catch(err){
            console.log(err)
        }
    }

    useEffect(() => {
        if (type != "Custom") {
            fetchData()
            console.log("Call API")
        }
    }, [type])

    useEffect(() => {
        fetchData()
    }, [dateFilter])

    const onChangeType = ({ target: { value } }: { target: any }) => {
        setType(value)
    };

    const handleRangeChange = (dates: any) => {
        if (dates.length > 0) {
            setDateFilter({ "start_date": dates[0].format("YYYY-MM-DD"), "end_date": dates[1].format("YYYY-MM-DD") })
        }
    };

    return (
        <>
            <div className='w-full h-auto flex flex-row p-2 shadow-md rounded-xl bg-white text-black justify-center gap-4'>
                <div className='w-60'>
                    <Radio.Group
                        options={options}
                        onChange={onChangeType}
                        value={type}
                        optionType='button'
                        buttonStyle='solid'
                    />
                </div>
                {type === "Custom" ? (
                    <RangePicker onChange={handleRangeChange}/>
                ) : (
                    <></>
                )}
            </div>
            {
                isLoading ? (<Loading />)
                    : (
                        <div className='flex flex-col gap-2 justify-start w-full shadow-md h-auto rounded-xl bg-white'>
                            <div className='p-7 font-bold text-xl text-black flex flex-row justify-between items-center w-full h-auto bg-white rounded-xl -mb-5'>
                                <span>Cusomer Group Chart</span>
                            </div>
                            <div className='p-7 w-full h-[450px]'>
                                <Chart
                                    type='line'
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
                                        },
                                    }}
                                />
                            </div>
                        </div>
                    )
            }
        </>
    )
}

export default SegmentationChart