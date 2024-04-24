
import { useEffect, useState } from 'react';
import Loading from "../loading";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import fetchClient from '@/lib/fetch-client';
import { Pie } from 'react-chartjs-2';
import { Table, Tooltip as  Tooltip_antd} from 'antd';
import type { TableProps } from 'antd';

ChartJS.register(ArcElement, Tooltip, Legend);

const SegmentationOverview = ({customerLoading, setCustomerLoading}: {customerLoading: any, setCustomerLoading: any}) => {
    const [isLoading, setIsLoading] = useState(true)
    const [chartData, setChartData] = useState<any>()
    const [chartLabel, setChartLabel] = useState<any>()
    const [bgColor, setBgColor] = useState<any>()
    const [bdColor, setBdColor] = useState<any>()
    const [groupSumarize, setGroupSumarize] = useState()
    const [columnStyle, setColumnStyle] = useState<any>()

    interface GroupSumarize {
        key: string;
        name: string;
        description: string;
        gender: string;
        source: string;
        avg_convert_day: number;
    }

    const backgroundColor = ["rgb(233, 101, 45)",
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


    const updateChart = (data: any) => {
        const temp_data: any = []
        const temp_title: any = []
        const temp_bg: any = []
        const temp_border: any = []
        const column_style: any = {}
        data.map((item: any, index: any) => {
            temp_data.push(Number(item.num_customers))
            temp_title.push(item.name)
            temp_bg.push(backgroundColor[index])
            temp_border.push(borderColor[index])
            column_style[String(item.name)] = backgroundColor[index]
        })
        setBgColor(temp_bg)
        setBdColor(temp_border)
        setChartData(temp_data)
        setChartLabel(temp_title)
        setColumnStyle(column_style)
    }

    const fetchData = async () => {
        try{
            setIsLoading(true)
            const data = await fetchClient({ url: "/groups/total", data_return: true })
            updateChart(data)
            const group_sumarize = await fetchClient({ url: "/groups/filter?type=Sumarize", data_return: true })
            setGroupSumarize(group_sumarize)
            setIsLoading(false)
        }
        catch(err){
            console.log(err)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])


    if (isLoading) {
        return (<Loading />);
    }

    const group_columns: TableProps<GroupSumarize>['columns'] = [
        {
            title: 'Group name',
            dataIndex: 'name',
            key: 'name', 
            render: (text, record) =>  <Tooltip_antd placement="top" title={record.description} ><p style={{color: `${columnStyle[record.name]}`}}>{text}</p></Tooltip_antd>
        },
        {
            title: 'Popular Gender',
            dataIndex: 'gender',
            key: 'gender',
            render: (text, record) => <p style={{color: `${columnStyle[record.name]}`}}>{text}</p>
        },
        {
            title: 'Popular Source',
            dataIndex: 'source',
            key: 'source',
            render: (text, record) => <p style={{color: `${columnStyle[record.name]}`}}>{text}</p>
        },
        {
            title: 'Convert Day Average',
            dataIndex: 'avg_convert_day',
            key: 'avg_convert_day',
            render: (text, record) => <p style={{color: `${columnStyle[record.name]}`}}>{text}</p>
        }
    ];


    const data = {
        labels: chartLabel,
        datasets: [
            {
                label: 'Total customers: ',
                data: chartData,
                backgroundColor: bgColor,
                borderColor: bdColor,
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className='flex flex-col gap-2 justify-start w-full shadow-md h-auto rounded-xl bg-white'>
            <div className='p-7 font-bold text-xl text-black flex flex-row justify-between items-center w-full h-auto bg-white rounded-xl -mb-5'>
                <span>Customer Group Overview</span>
            </div>
            <div className='flex pb-5'>
                <div className='flex-auto'>
                    <Pie data={data} />
                </div>
                <div className='flex-auto  flex justify-center items-center'>
                    <Table columns={group_columns} dataSource={groupSumarize} pagination={false}  className=''/>
                </div>
            </div>
        </div>
    );
};

export default SegmentationOverview;
