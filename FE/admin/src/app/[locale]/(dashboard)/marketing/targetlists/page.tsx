"use client";
import React, { useState } from "react";
import {
    Input,
    Form
} from "antd";
import type { TableProps} from "antd";

import Link from "next/link";
import TableRender, { FilterItemType } from "@/components/TableComponents";
import TextArea from "antd/es/input/TextArea";
import TimeFormatter from "@/components/TimeFormatter";

type ColumnsType<T> = TableProps<T>["columns"];

interface DataType {
    key?: React.Key;
    id: number;
    name: string;
    description: string;
    createdAt: Date
    updatedAt: Date
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
            render: (text, row, record) => <Link href={`/targetlists/${row.id}`}>{text}</Link>
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
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

    const filterItems : FilterItemType[] = [
        {
            key: "1",
            type: "input" ,
            fieldName: 'name',
            title: "Name",
        },
        {
            key: "2",
            type: "input" ,
            fieldName: 'description',
            title: "Description",
        },
        {
            key: "3",
            type: "date" ,
            fieldName: 'createdAt',
            title: "CreatedAt",
        }
    ]

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
            filterItems={filterItems}
        />
    );
};

export default TargetList;