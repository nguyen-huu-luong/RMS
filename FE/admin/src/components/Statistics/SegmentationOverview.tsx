import Loading from "../loading";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import fetchClient from '@/lib/fetch-client';
import { Pie } from 'react-chartjs-2';
import { Table, Tooltip as Tooltip_antd } from 'antd';
import type { TableProps } from 'antd';
import useSWR from 'swr'; { }

ChartJS.register(ArcElement, Tooltip, Legend);

const SegmentationOverview = () => {
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

        data.bgColor = temp_bg
        data.bdColor = temp_border
        data.chartData = temp_data
        data.chartLabel = temp_title
        data.columnStyle = column_style
    }

    let {
        data: chartDataTemp,
        error: chartDataTempError,
        isLoading: chartDataTempLoading,
    } = useSWR(
        '/groups/total', (url) => fetchClient({ url: url, data_return: true })
    );

    const {
        data: groupSumarize,
        error: groupSumarizeError,
        isLoading: groupSumarizeLoading,
    } = useSWR(
        !chartDataTempLoading ? '/groups/filter?type=Sumarize' : null,
        (url) => fetchClient({ url: url, data_return: true })
    );

    if (chartDataTempLoading || groupSumarizeLoading) {
        return (<Loading />);
    }
    else {
        updateChart(chartDataTemp)
    }



    const group_columns: TableProps<GroupSumarize>['columns'] = [
        {
            title: 'Group name',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => <Tooltip_antd placement="top" title={record.description} ><p style={{ color: `${chartDataTemp.columnStyle[record.name]}` }}>{text}</p></Tooltip_antd>
        },
        {
            title: 'Popular Gender',
            dataIndex: 'gender',
            key: 'gender',
            render: (text, record) => <p style={{ color: `${chartDataTemp.columnStyle[record.name]}` }}>{text}</p>
        },
        {
            title: 'Popular Source',
            dataIndex: 'source',
            key: 'source',
            render: (text, record) => <p style={{ color: `${chartDataTemp.columnStyle[record.name]}` }}>{text}</p>
        },
        {
            title: 'Convert Day Average',
            dataIndex: 'avg_convert_day',
            key: 'avg_convert_day',
            render: (text, record) => <p style={{ color: `${chartDataTemp.columnStyle[record.name]}` }}>{text}</p>
        }
    ];


    const data = {
        labels: chartDataTemp.chartLabel,
        datasets: [
            {
                label: 'Total customers: ',
                data: chartDataTemp.chartData,
                backgroundColor: chartDataTemp.bgColor,
                borderColor: chartDataTemp.bdColor,
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
                    <Table columns={group_columns} dataSource={groupSumarize} pagination={false} className='' />
                </div>
            </div>
        </div>
    );
};

export default SegmentationOverview;
