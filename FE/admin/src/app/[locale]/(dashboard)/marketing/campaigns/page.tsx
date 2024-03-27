"use client";
import React, { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import {
    Button,
    ConfigProvider,
    InputRef,
    Radio,
    Table,
    Input,
    Space,
    Checkbox,
    Select,
    Row,
    Alert,
} from "antd";
import type { TableProps, GetProp, TableColumnType } from "antd";
import { variables } from "@/app";
import {
    SearchOutlined,
    SortAscendingOutlined,
    SortDescendingOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import type {
    FilterConfirmProps,
    FilterValue,
    Key,
    SortOrder,
    SorterResult,
} from "antd/es/table/interface";
import { CustomerActionBar, CustomerFilterBar } from "@/components";
import Link from "next/link";
import { customersFetcher } from "@/app/api/client";

type ColumnsType<T> = TableProps<T>["columns"];
type TablePaginationConfig = Exclude<
    GetProp<TableProps, "pagination">,
    boolean
>;

interface DataType {
    key?: React.Key;
    id: number;
    name: string;
    type: string;
    status: string;
    start_date: string;
    end_date: string;

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

type DataIndex = keyof DataType;

const Campaign: React.FC = () => {
    const temp_data: DataType[] = [{ id: 1, name: "Introduce new dish", type: "Type", status: "Planning", start_date: "2024-02-04", end_date: "2024-05-04" }]
    const { data: session, status } = useSession();
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
            render: (text, row) => <a style={{ color: "#4A58EC" }} href={`./campaigns/${row.id}`}>{text}</a>
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
        },
        {
            title: "Sart date",
            dataIndex: "start_date",
            key: "start_date",
        },
        {
            title: "End date",
            dataIndex: "end_date",
            key: "end_date",
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


    const handleCloseError = () => {
        console.log(error);
        setError({ isError: false, title: "", message: "" });
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
            
            <div className="w-full h-auto flex-col gap-3">
            
                {/* <CustomerFilterBar /> */}
                <CustomerActionBar dataSelected={selectedCustomers} />
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

export default Campaign;