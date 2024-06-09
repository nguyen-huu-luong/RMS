"use client";
import React, { useState } from "react";
import {
    Input,
    Form,
    Button,
    Space,
    Popconfirm,
    message
} from "antd";
import type { TableProps } from "antd";

import TableRender, { FilterItemType } from "@/components/TableComponents";
import TimeFormatter from "@/components/TimeFormatter";
import { useRouter } from "next/navigation";
import fetchClient from "@/lib/fetch-client";
import { CreateTargetListModal } from "@/components/Modals/CreateTargetListModal";
import LinkWithRef from "next-intl/link";

type ColumnsType<T> = TableProps<T>["columns"];

interface DataType {
    key?: React.Key;
    id: number;
    name: string;
    description: string;
    type: string;
    count: number;
}


const TargetList: React.FC = () => {
    const [selectedRows, setSelectedRows] = useState<DataType[]>([])
    const [reload, setReload] = useState(false)
    const [data, setData] = useState<DataType[]>([])
    const router = useRouter()
    const columns: ColumnsType<DataType> = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            render: (text, row, record) => <LinkWithRef href={`targetlists/${row.id}`}>{text}</LinkWithRef>
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
        },
        {
            title: "CreatedAt",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (text) => <TimeFormatter time={text} />
        },
        {
            title: "UpdatedAt",
            dataIndex: "updatedAt",
            key: "updatedAt",
            render: (text) => <TimeFormatter time={text} />
        },

    ];

    const filterItems: FilterItemType[] = [
        {
            key: "1",
            type: "input",
            fieldName: 'name',
            title: "Name",
        },
        {
            key: "2",
            type: "input",
            fieldName: 'description',
            title: "Description",
        },
        {
            key: "3",
            type: "date",
            fieldName: 'createdAt',
            title: "CreatedAt",
        }
    ];

    const handleDelete = async () => {
        try {
            const result = await fetchClient({
                method: "DELETE",
                url: "/targetlists",
                body: {
                    ids: selectedRows.map(item => item.id)
                }
            })

            // const deletedIds = selectedRows.map(item => item.id);
            // setData(prev => {
            //     const  newData = data.filter(item => !deletedIds.includes(item.id))
            //     return  newData ;
            // })
            setSelectedRows([])
            setReload(!reload)


        } catch (error: any) {
            console.log(error)
            message.error(error.response.data.message)
            throw new Error(error)
        }
    }

    const onSelectedRows = {
        handle: (selecteds: DataType[]) => setSelectedRows(selecteds),
        render: () => <Space className="w-full my-2">
            <p>Selected {selectedRows?.length} targetlists</p>
            <Popconfirm title={`Delete ${selectedRows.length} targetlist. Are you sure?`} onConfirm={handleDelete}>
                <Button>Delete</Button>
            </Popconfirm>

        </Space>
    }

    const handleCreateTargetlist = async (values: any) => {
        try {
            const result = await fetchClient({
                method: "POST",
                url: "/targetlists",
                body: {
                    ...values
                }
            })
            // setReload(!reload)
        //    const  newData = [...data, result.data]
           setData(prev => ([...prev, result.data]))
        } catch (error) {
            message.error("Đã xảy ra lỗi")
            throw error
        }
    }


    return (
        <>
            <TableRender<DataType>
                data={data}
                setData={setData}
                columns={columns}
                url="/targetlists"
                reload={reload}
                onSelected={onSelectedRows}
                createModal={<CreateTargetListModal onOk={handleCreateTargetlist} triggerText="New" />}
                createModalTitle="Create new targetlist"
                filterItems={filterItems}
            />
        </>
    );
};

export default TargetList;