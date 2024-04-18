"use client";
import React, { useEffect, useRef, useState } from "react";
import {
    Button,
    ConfigProvider,
    Table,
    Space,
    Select,
    Alert,
} from "antd";
import type { TableProps, GetProp } from "antd";
import { variables } from "@/app";
import {
    SortAscendingOutlined,
    SortDescendingOutlined,
} from "@ant-design/icons";
import type {
    Key,
    SortOrder,
} from "antd/es/table/interface";
import fetchClient from "@/lib/fetch-client";

type ColumnsType<T> = TableProps<T>["columns"];
type TablePaginationConfig = Exclude<
    GetProp<TableProps, "pagination">,
    boolean
>;

interface DataType {
    key: React.Key;
    id: number;
    phone: string;
    fullname: string;
    email: string;
    createdAt: string;
    birthday: string;
    source: string;
    group: string[];
    score: number;
    age: number;
    address: string;
    // updatedAt: Date ;
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


interface ICustomerTableList {
    display?: "model" | "normal",
    onSelected?: (selecteds : DataType[]) => void

}

const CustomerTableList: React.FC<ICustomerTableList> = ({display, onSelected}) => {
    const [checker, setChecker] = useState(true);
    const [data, setData] = useState<DataType[]>();
    const [loading, setLoading] = useState(false);
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

    const handleReset = (clearFilters: () => void) => {
        clearFilters();
    };

    // rowSelection object indicates the need for row selection
    const rowSelection = {
        onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
            console.log(
                `selectedRowKeys: ${selectedRowKeys}`,
                "selectedRows: ",
                selectedRows
            );
            onSelected && onSelected(selectedRows)

        },
        getCheckboxProps: (record: DataType) => ({
            disabled: record.fullname === "", // Column configuration not to be checked
            name: record.fullname,
        }),
    };
    const columns: ColumnsType<DataType> = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Fullname",
            dataIndex: "fullname",
            key: "fullname",
            render: (text, row) => <a style={{ color: "#4A58EC" }} href={`./customers/${row.id}`}>{text}</a>,
            // ...getColumnSearchProps("fullname"),
        },
        {
            title: "Phone number",
            dataIndex: "phone",
            key: "phone",
            // sorter: (a, b) => a.age - b.age,
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Source",
            dataIndex: "source",
            key: "source",
        },
        {
            title: "Birthday",
            dataIndex: "birthday",
            key: "birthday",
        },
        {
            title: "Score",
            dataIndex: "score",
            key: "score",
        },
        {
            title: "Group",
            dataIndex: "group",
            key: "group",
        },
        {
            title: "Age",
            dataIndex: "age",
            key: "age",
        },
        {
            title: "CreatedAt",
            dataIndex: "createdAt",
            key: "createdAt",
        },
        // {
        // 	title: 'Last updated',
        // 	dataIndex: 'updatedAt',
        // 	key: 'updatedAt',
        // 	// ...getColumnSearchProps('updatedAt'),
        // }
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
                url: `/customers/all?page=${tableParams.pagination?.current}
				&pageSize=${tableParams.pagination?.pageSize}${sortQueries}`
            })

            console.log(respone)
            const results = respone.data
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
            setLoading(false)
            console.log(error);
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

        setChecker(prevState => !prevState)
    };

    const handleSortFieldChange = (key: string) => {
        console.log(key, tableParams);
        setTableParams((prev) => ({
            ...prev,
            sorter: { ...prev.sorter, field: key },
        }));
        setChecker(prevState => !prevState)
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
        setChecker(prevState => !prevState)
    };

    const handleClearFilter = () => { };

    const handleClearAll = () => { };

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
            <div className="border bg-white shadow p-3">
                <div style={{ marginBottom: 16 }} className="flex items-center gap-2">
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
                <Space>
                    <Button onClick={handleClearFilter}>Clear filters</Button>
                    <Button onClick={handleClearAll}>Clear filters and sorters</Button>
                    {/* <Space className="ms-auto">
							<input type="checkbox" name="apply-mode" id="apply-mode" />
							<label htmlFor="apply-mode">Apply filters only in current page</label>
						</Space> */}
                </Space>
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
        </ConfigProvider>
    );
};

export default CustomerTableList;