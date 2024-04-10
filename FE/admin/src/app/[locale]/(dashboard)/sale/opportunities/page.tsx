"use client";
import React, { useEffect, useRef, useState } from "react";
import {
    Button,
    ConfigProvider,
    InputRef,
    Table,
    Input,
    Space,
    Select,
    Alert,
} from "antd";
import { TableProps, GetProp, TableColumnType } from "antd";
import { variables } from "@/app";
import {
    SearchOutlined,
    SortAscendingOutlined,
    SortDescendingOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import type {
    FilterConfirmProps,
    Key,
    SortOrder,
} from "antd/es/table/interface";
import { Modal } from "antd";
import { useRouter } from "next-intl/client";;
import fetchClient from "@/lib/fetch-client";

type ColumnsType<T> = TableProps<T>["columns"];
type TablePaginationConfig = Exclude<
    GetProp<TableProps, "pagination">,
    boolean
>;
interface DataType {
    key: React.Key;
    id: number;
    fullname: string;
    amount: string;
    type: string;
    action: string;
}

interface ItemDataType {
    key: React.Key;
    name: string;
    amount: number;
    quantity: number;
    update_time: string;
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

const Opportunities: React.FC = () => {
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef<InputRef>(null);
    const [data, setData] = useState<DataType[]>();
    const [rawData, setRawData] = useState<any[]>();
    const [cartItems, setCartItems] = useState<any>();
    const [loading, setLoading] = useState(false);
    const [isModalCart, setIsModalCart] = useState(false)
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
        // onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
        //     setSelectedOrders(selectedRows);
        // },
        // getCheckboxProps: (record: DataType) => ({
        //     disabled: record.fullname === "",
        //     name: record.fullname,
        // }),
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
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            render: (text, row) => <p>{text} VND</p>
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
        },
        {
            title: "Action",
            dataIndex: "action",
            key: "action",
            render: (text, row) => <Button color="primary" onClick={() => handleOpenModalCart(row.id - 1, row.fullname, row.amount)}>View cart</Button>
        }];


    const items_columns: ColumnsType<DataType> = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Quantity",
            dataIndex: "quantity",
            key: "quantity",
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            render: (text, row) => <p>{text} VND</p>
        },
        {
            title: "Update Time",
            dataIndex: "update_time",
            key: "update_timeaction",
        }];

    const handleTableChange: TableProps["onChange"] = (
        pagination,
        filters,
        sorter,
        extra
    ) => {
        // if (Array.isArray(sorter)) {
        //     const firstSorter = sorter[0];
        //     setTableParams((prev) => ({
        //         ...prev,
        //         pagination,
        //         filters,
        //         sorter: {
        //             field: firstSorter?.field || prev.sorter?.field,
        //             order: firstSorter?.order || prev.sorter?.order,
        //         },
        //     }));
        //     fetchData()
        // } else {
        //     setTableParams((prev) => ({
        //         pagination,
        //         filters,
        //         sorter: {
        //             field: sorter?.field || prev.sorter?.field,
        //             order: sorter?.order || prev.sorter?.order,
        //         },
        //     }));
        //     fetchData()
        // }
    };

    const handleSortFieldChange = (key: string) => {
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

    const handleClearFilter = () => { };

    const handleClearAll = () => { };

    const handleCloseError = () => {
        console.log(error);
        setError({ isError: false, title: "", message: "" });
    };

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
            const response = await fetchClient({
                url: `/customers/opportunity/all`, data_return: true
            })
            console.log(response)
            setRawData(response)
            const results = response
            const data = results.map((item: any, index: any) => ({
                key: index,
                id: index + 1,
                amount: item.amount,
                type: item.Client.type,
                fullname: `${item.Client.firstname} ${item.Client.lastname}`,
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

    const handleCloseModalCart = () => {
        setIsModalCart(false)
    }

    const handleOpenModalCart = (index: any, fullname: any, amount: any) => {
        if (rawData) {
            const data: any = rawData[index]
            const items: any = data.Products.map((item: any) => ({
                name: item.name,
                amount: item.CartItem.amount,
                quantity: item.CartItem.quantity,
                update_time: item.CartItem.updatedAt.split('T')[0],
            }))
            let cart_items = {
                username: fullname,
                amount: amount,
                items: items
            }
            setCartItems(cart_items)
            setIsModalCart(true)
        }
    }

    useEffect(() => {
        fetchData();
    }, []);


    return (
        <>
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
                <div className='w-full flex flex-col justify-start gap-5'>
                    {/* <CustomerFilterBar /> */}
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
                    <div className='border bg-white shadow p-3 w-full'>
                        <div
                            style={{ marginBottom: 16 }}
                            className='flex items-center gap-2'
                        >
                            <p>Sort by: </p>
                            <Select
                                // style={{ width: '20%' }}
                                placeholder='Columns'
                                value={
                                    tableParams.sorter?.field?.toString() ||
                                    "id"
                                }
                                onChange={handleSortFieldChange}
                                options={columns.map((item) => ({
                                    value: item.key,
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
                    <div className='w-full h-auto'>
                        <Table
                            rowSelection={{
                                ...rowSelection,
                            }}
                            columns={columns}
                            pagination={{
                                className: "bg-white rounded px-4 py-2",
                                showTotal: (total: number) =>
                                    `Total ${total} items`,
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

            <Modal title="Cart Information" open={isModalCart} onCancel={handleCloseModalCart} footer={(_, { OkBtn, CancelBtn }) => (<></>)}>
                {
                    cartItems &&
                    <div>
                        <div className="flex justify-between">
                            <div>
                                <p className="font-semibold">Full Name</p>
                                <p>
                                    {cartItems.username}
                                </p>
                            </div>
                            <div>
                                <p className="font-semibold">Total amount</p>
                                <p>
                                    {cartItems.amount} VND
                                </p>
                            </div>
                        </div>
                        <div className='w-full h-auto mt-5'>
                            <Table
                                columns={items_columns}
                                dataSource={cartItems.items}
                                pagination={{
                                    pageSize: 4,
                                }}
                            />
                        </div>
                    </div>
                }
            </Modal>
        </>
    );
};

export default Opportunities;
