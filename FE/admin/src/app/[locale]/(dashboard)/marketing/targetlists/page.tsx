"use client";
import React, { useState } from "react";
import {
    Input,
    Form
} from "antd";
import type { TableProps} from "antd";

import Link from "next/link";
import TableRender from "@/components/TableComponents";
import TextArea from "antd/es/input/TextArea";

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
            render: (text, row, record) => <Link href={`marketing/targetlists/${row.id}`}>{text}</Link>
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
            title: "Count",
            dataIndex: "count",
            key: "count",
        }
    ];

    const onSelectedRows = {
        handle: (selecteds: DataType[]) => setSelectedRows(selecteds),
        render: () => <p>Selected {selectedRows.length} targetList</p>
    }

    return (
        <TableRender<DataType> 
            columns={columns} 
            url="/targetlists" 
            onSelected={onSelectedRows} 
            formCreateElement = {
                <>
                    <Form.Item label="Name" name="name" required rules={[{ required: true, message: 'Please input the group name !' }]}>
                        <Input placeholder='Group name' />
                    </Form.Item>
                    <Form.Item label="Description" name="description" required rules={[{ required: true, message: 'Please input the group description !' }]}>
                        <TextArea placeholder='Group description' />
                    </Form.Item>
                </>
            }
        />
    );
};

export default TargetList;