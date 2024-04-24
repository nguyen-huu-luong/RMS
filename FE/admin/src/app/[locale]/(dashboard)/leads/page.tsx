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
import { leadsFetcher } from "@/app/api/lead";
import { LeadActionBar } from "@/components/Lead";
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
    score: number;
    age: number;
    address: string;
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

const Lead: React.FC = () => {
    const [checker, setChecker] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef<InputRef>(null);
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
    const handleSearch = (
        selectedKeys: string[],
        confirm: (param?: FilterConfirmProps) => void,
        dataIndex: DataIndex
    ) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters: () => void) => {
        clearFilters();
        setSearchText("");
    };
    const getColumnSearchProps = (
        dataIndex: DataIndex
    ): TableColumnType<DataType> => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
            close,
        }: any) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) =>
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                    }
                    onPressEnter={() =>
                        handleSearch(
                            selectedKeys as string[],
                            confirm,
                            dataIndex
                        )
                    }
                    style={{ marginBottom: 8, display: "block" }}
                />
                <Space>
                    <Button
                        type='primary'
                        onClick={() =>
                            handleSearch(
                                selectedKeys as string[],
                                confirm,
                                dataIndex
                            )
                        }
                        icon={<SearchOutlined />}
                        size='small'
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() =>
                            clearFilters && handleReset(clearFilters)
                        }
                        size='small'
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                    <Button
                        type='link'
                        size='small'
                        onClick={() => {
                            confirm({ closeDropdown: false });
                            setSearchText((selectedKeys as string[])[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type='link'
                        size='small'
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined
                style={{ color: filtered ? "#1677ff" : undefined }}
            />
        ),
        onFilter: (value: any, record: any) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes((value as string).toLowerCase()),
        onFilterDropdownOpenChange: (visible: any) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text: string) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ""}
                />
            ) : (
                text
            ),
    });

    const rowSelection = {
        onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
            console.log(
                `selectedRowKeys: ${selectedRowKeys}`,
                "selectedRows: ",
                selectedRows
            );
            setSelectedCustomers(selectedRows);

            console.log(selectedCustomers);
        },
        getCheckboxProps: (record: DataType) => ({
            disabled: record.fullname === "",
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
            render: (text, row) => (
                <a style={{ color: "#4A58EC" }} href={`./leads/${row.id}`}>
                    {text}
                </a>
            ),
            ...getColumnSearchProps("fullname"),
        },
        {
            title: "Phone number",
            dataIndex: "phone",
            key: "phone",
            ...getColumnSearchProps("phone"),
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            ...getColumnSearchProps("email"),
        },
        {
            title: "Source",
            dataIndex: "source",
            key: "source",
            ...getColumnSearchProps("source"),
        },
        {
            title: "Birthday",
            dataIndex: "birthday",
            key: "birthday",
            ...getColumnSearchProps("birthday"),
        },
        {
            title: "Score",
            dataIndex: "score",
            key: "score",
            ...getColumnSearchProps("score"),
        },
        {
            title: "CreatedAt",
            dataIndex: "createdAt",
            key: "createdAt",
            ...getColumnSearchProps("createdAt"),
        },
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
                    ? `&sort=${tableParams.sorter?.field}&order=${
                          tableParams.sorter?.order === "ascend"
                              ? "asc"
                              : "desc"
                      }`
                    : "";
            let results = await fetchClient({
                url: `/customers/all?page=${tableParams.pagination?.current}&pageSize=${tableParams.pagination?.pageSize}${sortQueries}&type=lead`,
                data_return: true,
            });
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
            setError({
                isError: true,
                title: error?.name || "Something went wrong!",
                message: error?.message || "Unknown error",
            });
        }
    };

    useEffect(() => {
        fetchData();
    }, [checker, JSON.stringify(tableParams)]);

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
            setTableParams((prev) => ({
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

            setTableParams((prev) => ({
                pagination,
                filters,
                sorter: {
                    field: sorter?.field || prev.sorter?.field,
                    order: sorter?.order || prev.sorter?.order,
                },
            }));
        }

        setChecker((prevState) => !prevState);
    };

    const handleSortFieldChange = (key: string) => {
        console.log(key, tableParams);
        setTableParams((prev) => ({
            ...prev,
            sorter: { ...prev.sorter, field: key },
        }));
        setChecker((prevState) => !prevState);
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
        setChecker((prevState) => !prevState);
    };

    const handleClearFilter = () => {
        setTableParams({
            ...tableParams,
            filters: {},
        });
    };

    const handleClearAll = () => {
        setTableParams({
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
            <Space direction='vertical'>
                <LeadActionBar dataSelected={selectedCustomers} />
                {error.isError && (
                    <Alert
                        message={error.title}
                        description={error.message}
                        type='error'
                        showIcon
                        onClose={handleCloseError}
                        closeIcon
                    />
                )}
                <div className='border bg-white shadow p-3'>
                    <div className='flex items-center gap-2'>
                        <p>Sort by: </p>
                        <Select
                            placeholder='Columns'
                            value={
                                tableParams.sorter?.field?.toString() || "id"
                            }
                            onChange={handleSortFieldChange}
                            options={columns.map((item) => ({
                                value:
                                    item.key === "fullname"
                                        ? "firstname"
                                        : item.key,
                                label: item.title,
                            }))}
                        />

                        <p>Order: </p>

                        <Button
                            onClick={handleToggleSorter}
                            icon={
                                tableParams.sorter?.order === "ascend" ? (
                                    <SortAscendingOutlined />
                                ) : (
                                    <SortDescendingOutlined />
                                )
                            }
                        />

                        <Button onClick={handleClearFilter}>
                            Clear filters
                        </Button>
                        <Button onClick={handleClearAll}>
                            Clear filters and sorters
                        </Button>
                    </div>
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

export default Lead;
