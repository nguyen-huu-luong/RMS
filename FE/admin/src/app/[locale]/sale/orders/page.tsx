'use client'
import { SearchOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Button, Table } from 'antd';
import type { TableColumnsType } from 'antd';
import { StepBackwardOutlined } from "@ant-design/icons";

// interface DataType {
//     key: React.Key;
//     name: string;
//     age: number;
//     address: string;
// }

// const columns: TableColumnsType<DataType> = [
//     {
//         title: 'Name',
//         dataIndex: 'name',
//     },
//     {
//         title: 'Age',
//         dataIndex: 'age',
//     },
//     {
//         title: 'Address',
//         dataIndex: 'address',
//     },
// ];

// const data: DataType[] = [];
// for (let i = 0; i < 46; i++) {
//     data.push({
//         key: i,
//         name: `Edward King ${i}`,
//         age: 32,
//         address: `London, Park Lane no. ${i}`,
//     });
// }

interface DataType {
    key: React.Key;
    account: string;
    status: string;
    dateOrdered: string;
    amount: number;
    action: string;
}

const columns: TableColumnsType<DataType> = [
    {
        title: 'ID',
        dataIndex: 'key',
        render: () => <StepBackwardOutlined />,
    },
    {
        title: 'Account',
        dataIndex: 'account',
    },
    {
        title: 'Status',
        dataIndex: 'status',
    },
    {
        title: 'Date ordered',
        dataIndex: 'dateOrdered',
    },
    {
        title: 'Amount',
        dataIndex: 'amount',
    },
    {
        title: 'Action',
        dataIndex: 'action',
    },
];

const data: DataType[] = [];
for (let i = 0; i < 46; i++) {
    data.push({
        key: i,
        account: `Edward King ${i}`,
        status: "waiting",
        dateOrdered: "1/1/2023",
        amount: 500,
        action: "delete",
    });
}

const Order = () => {
    const router = useRouter();
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [loading, setLoading] = useState(false);

    const handelCreateButton = () => {
        router.push('./orders/create');
    }

    const start = () => {
        setLoading(true);
        // ajax request after empty completing
        setTimeout(() => {
            setSelectedRowKeys([]);
            setLoading(false);
        }, 1000);
    };

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        console.log(selectedRowKeys)
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;

    return (
        <>
            <div>
                <div className="w-full flex items-center bg-white py-2 space-x-5 px-10  rounded border">
                    <div className="relative rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2 ">
                            <span className="text-slate-400"> <SearchOutlined /> </span>
                        </div>
                        <form>
                            <input
                                type="text"
                                name="orderID"
                                id="orderID"
                                className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 focus:outline-none sm:text-sm sm:leading-6"
                                placeholder="Enter order ID ..."
                            /> </form>
                    </div>
                    <div className='flex space-x-4 '>
                        <div>
                            <button className='btn btn-sm border-slate-300 bg-gray-50' onClick={handelCreateButton}>
                                <PlusOutlined style={{ color: "#4E89FF" }} /> New
                            </button>
                        </div>
                        <div >
                            <Button className=' btn btn-sm border-slate-300 bg-gray-50' disabled={!hasSelected} loading={loading}>
                                <DeleteOutlined style={{ color: "red" }} /> Remove
                            </Button>
                        </div>
                    </div>
                </div>
                <div>
                </div>
            </div>
            <div>
                    <Table rowSelection={rowSelection} columns={columns} dataSource={data} pagination={{ pageSize: 8, total: 50, showSizeChanger: true }} scroll={{ y: 400 }} />
            </div>
        </>
    )
}
export default Order;