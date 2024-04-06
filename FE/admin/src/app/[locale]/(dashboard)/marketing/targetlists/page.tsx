"use client";
import React, { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import {
    Button,
    ConfigProvider,
    Table,
    Input,
    Space,
    Select,
    Flex, Modal, Form, DatePicker, InputNumber
} from "antd";
import type { TableProps, GetProp } from "antd";
import { variables } from "@/app";
import type {
    Key,
    SortOrder,
} from "antd/es/table/interface";
import Link from "next/link";
import { EllipsisOutlined, PlusCircleOutlined, SearchOutlined } from "@ant-design/icons";

type ColumnsType<T> = TableProps<T>["columns"];
type TablePaginationConfig = Exclude<
    GetProp<TableProps, "pagination">,
    boolean
>;

interface DataType {
    key?: React.Key;
    id: number;
    name: string;
    description: string;
    type: string;
    count: number;}

type SorterParams = {
    field?: Key | readonly Key[];
    order?: SortOrder;
};

interface TableParams {
    pagination?: TablePaginationConfig;
    sorter?: SorterParams;
    filters?: Parameters<GetProp<TableProps, "onChange">>[1];
}


const TargetList: React.FC = () => {
    const temp_data: DataType[] = [
        { id: 1, name: "Customer", description: "Target 1", type: "Testing", count: 10 },
        { id: 2, name: "Lead", description: "Target 1", type: "Testing", count: 10  },
        { id: 3, name: "Subscriber", description: "Target 1", type: "Testing", count: 10  },
    ]

    const [form_campaign] = Form.useForm();

    const [checker, setChecker] = useState(true);
    const [data, setData] = useState<DataType[]>(temp_data);
    const [loading, setLoading] = useState(false);
    const [selectedCustomers, setSelectedCustomers] = useState<DataType[]>();
    const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {
            current: 1,
            pageSize: 10,
            total: 0,
        },
        filters: {},
        sorter: {
            field: "id",
            order: "ascend",
        },
    });

    // rowSelection object indicates the need for row selection
    const rowSelection = {
        onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
            console.log(
                `selectedRowKeys: ${selectedRowKeys}`,
                "selectedRows: ",
                selectedRows
            );
            setSelectedCustomers(selectedRows)

            console.log(selectedCustomers)
        },
        getCheckboxProps: (record: DataType) => ({

        }),
    };
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
            render: (text, row) => <a style={{ color: "#4A58EC" }} href={`../customers`}>{text}</a>
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

    const handleTableChange: TableProps["onChange"] = (
        pagination,
        filters,
        sorter,
        extra
    ) => {
        console.log(pagination, filters, sorter, extra);
        if (Array.isArray(sorter)) {
            const firstSorter = sorter[0];
            console.log("Sorter is array");
            setTableParams(prev => ({
                ...prev,
                pagination,
                filters,
                sorter: {
                    field: firstSorter?.field || prev.sorter?.field,
                    order: firstSorter?.order || prev.sorter?.order,
                },
            }));
        } else {
            console.log("Sorter is not an array");

            setTableParams(prev => ({
                pagination,
                filters,
                sorter: {
                    field: sorter?.field || prev.sorter?.field,
                    order: sorter?.order || prev.sorter?.order,
                },
            }));
        }

        setChecker(prevState => !prevState)
    };




    return (
        <ConfigProvider
            theme={{
                components: {
                    Table: {
                        headerBg: variables.backgroundSecondaryColor,
                        footerBg: "#fff",
                    },
                    Form: {
                        itemMarginBottom: 16,
                    },
                    Input: {
                        addonBg: "#F6FAFD",
                        colorFillTertiary: "#F6FAFD",
                    },
                    InputNumber: {
                        addonBg: "#F6FAFD",
                        colorFillTertiary: "#F6FAFD",
                    },
                    DatePicker: {
                        colorFillTertiary: "#F6FAFD",
                    },

                    Select: {
                        colorFillTertiary: "#F6FAFD",
                    },
                },
            }}
        >

            <div className="w-full h-auto flex-col gap-3">
                <div className="bg-white w-full py-2 px-3 rounded-md border">
                    <Flex>
                        {
                            <Space>
                                <Input
                                    placeholder="Enter keywork to search...."
                                    prefix={<SearchOutlined className="site-form-item-icon px-2 text-gray-500" />}
                                    className="flex items-center"
                                />
                            </Space>
                        }

                        <Space className="ms-auto">
                        <Link href={'../customers'}>
                            <Button icon={<PlusCircleOutlined />} >
                                New
                            </Button>
                            </Link>
                            <Button icon={<EllipsisOutlined />} />

                        </Space>
                    </Flex>
                </div>

                <div className="mt-2">
                    <Table
                        rowSelection={{
                            ...rowSelection,
                        }}
                        columns={columns}
                        pagination={{
                            className: "bg-white rounded px-4 py-2",
                            showTotal: (total: number) => `Total ${total} items`,
                            position: ["bottomCenter", "bottomRight"],
                            showSizeChanger: true,
                            showQuickJumper: true,
                            total: tableParams.pagination?.total,
                            pageSize: tableParams.pagination?.pageSize,
                        }}
                        loading={loading}
                        dataSource={data}
                        onChange={handleTableChange}
                    />
                </div>
            </div>
        </ConfigProvider>
    );
};

export default TargetList;