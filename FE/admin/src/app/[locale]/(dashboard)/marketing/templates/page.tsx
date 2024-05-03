"use client";
import React, { useEffect, useRef, useState } from "react";
import {
    Alert,
    Button,
    ConfigProvider,
    Popconfirm,
    Select,
    Space,
    Table,
    message,
} from "antd";
import type { TableProps, GetProp } from "antd";
import { variables } from "@/app";
import type {
    Key,
    SortOrder,
} from "antd/es/table/interface";
import Link from "next/link";
import { EditFilled, PlusCircleFilled, SortAscendingOutlined, SortDescendingOutlined } from "@ant-design/icons";
import TimeFormatter from "@/components/TimeFormatter";
import { BiTrash } from "react-icons/bi";
import fetchClient from "@/lib/fetch-client";

type ColumnsType<T> = TableProps<T>["columns"];
type TablePaginationConfig = Exclude<
    GetProp<TableProps, "pagination">,
    boolean
>;

interface DataType {
    key: React.Key;
    id: number;
    name: string;
    type: string;
    createdAt: string;
    updatedAt: Date;
}

type ErrorType = {
    isError: boolean;
    title: string;
    message: string;
};

type SorterParams = {
    field?: Key | readonly Key[];
    order?: SortOrder;
};

interface TableParams {
    pagination?: TablePaginationConfig;
    sorter?: SorterParams;
    filters?: Parameters<GetProp<TableProps, "onChange">>[1];
}

const EmailTemplate: React.FC = () => {
    const [data, setData] = useState<DataType[]>();
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
    const [error, setError] = useState<ErrorType>({
        isError: false,
        message: "",
        title: "",
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
    };

    const handleDelete = async (id: number) => {
        try {
            const response = await fetchClient({ method: "DELETE", url: `/message-templates/${id}` });
            console.log('Delete email template', response.data);
            message.success('Delete email template successfully');
            fetchData()
        } catch (error) {
            console.error('Error delete email  Email template:', error);
            message.error('Failed to delete Email template');
        }
    }
    const columns: ColumnsType<DataType> = [
        { title: "ID", dataIndex: "id", key: "id" },
        {
            title: "Name", dataIndex: "name", key: "name", render: (text, record, index) => (
                <Link href={`templates/${record.id}/`}>{text}</Link>
            )
        },
        { title: "Description", dataIndex: "description", key: "description" },
        {
            title: "CreatedAt", dataIndex: "createdAt", key: "createdAt", render: (text) => (
                <TimeFormatter time={text} />
            )
        },

        { title: "UpdatedAt", dataIndex: "updatedAt", key: "updatedAt", render: (text) => <TimeFormatter time={text} /> },
        {
            title: "Action",
            render: (text, record, index) => (
                <Space>
                    <Link href={`templates/${record["id"]}`}><Button type="primary" className="bg-primary" icon={<EditFilled />}>Update</Button></Link>
                    <Popconfirm
                        title="Delete the task"
                        description="Are you sure to delete this task?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button danger icon={<BiTrash />}>Delete</Button>
                    </Popconfirm>
                </Space>
            )
        }
    ];


    const fetchData = async () => {
        setLoading(true);
        try {
            let filterQueriesStr = "";
            for (const key in tableParams.filters) {
                filterQueriesStr = `${filterQueriesStr}&${key}=${tableParams.filters[key]}`;
            }
            let sortQueries =
                tableParams.sorter?.field && tableParams.sorter?.order
                    ? `&sort=${tableParams.sorter?.field}&order=${tableParams.sorter?.order === "ascend" ? "asc" : "desc"
                    }`
                    : "";
            const respone = await fetchClient({
                url: `/message-templates/all?page=${tableParams.pagination?.current}&pageSize=${tableParams.pagination?.pageSize}${sortQueries}`
            })
            const results = respone.data;
            const data = results.data.map((item: any) => ({
                ...item,
                key: item.id,
                fullname: `${item.firstname} ${item.lastname}`,
            }));
            setData(data);
            setLoading(false);
            setTableParams({
                ...tableParams,
                pagination: {
                    ...tableParams.pagination,
                    pageSize: results.pageSize,
                    current: results.page,
                    total: results.totalCount,
                },
            });
        } catch (error: any) {
            console.log(error);
            setLoading(false)
            setError({
                isError: true,
                title: error?.name || "Something went wrong!",
                message: error?.message || "Unknown error",
            });
        }
    };
    useEffect(() => {
        fetchData();
    }, [JSON.stringify(tableParams)]);

    const handleTableChange: TableProps["onChange"] = (
        pagination,
        filters,
        sorter,
        extra
    ) => {
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
    };
    const handleCloseError = () => {
        console.log(error);
        setError({ isError: false, title: "", message: "" });
    };

    const handleSortFieldChange = (key: string) => {
        console.log(key, tableParams);
        setTableParams((prev) => ({
            ...prev,
            sorter: { ...prev.sorter, field: key },
        }));
        console.log(tableParams);
    };

    const handleToggleSorter = () => {
        setTableParams((prev) => ({
            ...prev,
            sorter: {
                ...prev.sorter,
                order: prev.sorter?.order === "ascend" ? "descend" : "ascend",
            },
        }));
    };

    return (
        <ConfigProvider
            theme={{
                components: {
                    Table: {
                        headerBg: variables.backgroundSecondaryColor,
                        footerBg: "#fff",
                    },
                },
            }}
        >
            <Space direction="vertical" className="w-full">
                {error.isError && (
                    <Alert
                        message={error.title}
                        description={error.message}
                        type="error"
                        showIcon
                        onClose={handleCloseError}
                        closeIcon
                    />
                )}
                <div className="border bg-white shadow px-3 py-2 flex items-center">
                    <div className="flex items-center gap-2">
                        <p>Sort by: </p>
                        <Select
                            // style={{ width: '20%' }}
                            placeholder="Columns"
                            value={tableParams.sorter?.field?.toString() || "id"}
                            onChange={handleSortFieldChange}
                            options={columns.map((item) => ({
                                value: item.key,
                                label: item.title,
                            }))}
                        />

                        <p>Order: </p>

                        <Button onClick={handleToggleSorter} icon={tableParams.sorter?.order === "ascend" ? (
                            <SortAscendingOutlined />
                        ) : (
                            <SortDescendingOutlined />
                        )} />
                    </div>
                    <Button type="link" href="templates/new" className="border ms-auto" icon={<PlusCircleFilled />}>New</Button>
                </div>
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
            </Space>
        </ConfigProvider>
    );
};

export default EmailTemplate;