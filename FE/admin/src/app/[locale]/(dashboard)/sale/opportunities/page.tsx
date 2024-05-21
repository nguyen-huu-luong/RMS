"use client";
import React, { useEffect, useRef, useState } from "react";
import {
    Button,
    ConfigProvider,
    Table,
    Select,
    Alert,
} from "antd";
import { TableProps, GetProp} from "antd";
import { variables } from "@/app";
import {
    SortAscendingOutlined,
    SortDescendingOutlined,
} from "@ant-design/icons";
import type {
    Key,
    SortOrder,
} from "antd/es/table/interface";
import { Modal } from "antd";
import { useRouter } from "next-intl/client";;
import fetchClient from "@/lib/fetch-client";
import { useLocale, useTranslations } from "next-intl";

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
    const [data, setData] = useState<DataType[]>();
    const [rawData, setRawData] = useState<any[]>();
    const [cartItems, setCartItems] = useState<any>();
    const [loading, setLoading] = useState(false);
    const [isModalCart, setIsModalCart] = useState(false)
    const t_general: any = useTranslations("General")
    const t_order: any = useTranslations("Order")
    const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {
            current: 1,
            pageSize: 10,
            total: 0,
        },
        filters: {},
        sorter: {
            field: 'amount',
            order: "ascend",
        },
    });
    const [isSorting, setIsSorting] = useState(true)
    const list_sort = [
        {
            key: "fullname",
            title: t_general('fullname')
        },
        {
            key: "amount",
            title: t_general('amount')
        },
        {
            key: "type",
            title: t_general('type')
        },
    ]
    const [error, setError] = useState<ErrorType>({
        isError: false,
        message: "",
        title: "",
    });
    const link_ref: any = {"customer": "../customers", "lead": "../leads"}

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
            title: t_general('id'),
            dataIndex: "id",
            key: "id"
        },
        {
            title: t_general('fullname'),
            dataIndex: "fullname",
            key: "fullname",
            render: (text, row) => <a style={{ color: "#4A58EC" }} href={`${link_ref[row.type]}/${row.id}`}>{text}</a>
        },
        {
            title: t_general('amount'),
            dataIndex: "amount",
            key: "amount",
            render: (text, row) => <p>{text} VND</p>
        },
        {
            title: t_general('type'),
            dataIndex: "type",
            key: "type",
        },
        {
            title: t_general('action'),
            dataIndex: "action",
            key: "action",
            render: (text, row, index) => <Button color="primary" onClick={() => handleOpenModalCart(index, row.fullname, row.amount)}>View cart</Button>
        }];


    const items_columns: ColumnsType<DataType> = [
        {
            title: t_general('name'),
            dataIndex: "name",
            key: "name",
        },
        {
            title: t_general('quantity'),
            dataIndex: "quantity",
            key: "quantity",
        },
        {
            title: t_general('amount'),
            dataIndex: "amount",
            key: "amount",
            render: (text, row) => <p>{text} VND</p>
        },
        {
            title: t_general('date'),
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
        setIsSorting((current) => !current)
    };

    const handleToggleSorter = () => {
        setTableParams((prev) => ({
            ...prev,
            sorter: {
                ...prev.sorter,
                order: prev.sorter?.order === "ascend" ? "descend" : "ascend",
            },
        }));
        setIsSorting((current) => !current)
    };

    const handleClearAll = () => {
        setTableParams((prev) => ({
            ...prev,
            sorter: {
                field: "amount",
                order: "ascend",
            },
        }));
        setIsSorting((current) => !current)
    };

    const handleCloseError = () => {
        console.log(error);
        setError({ isError: false, title: "", message: "" });
    };

    const fetchData = async (sort=false) => {
        setLoading(true);
        try {
            let filterQueriesStr = "";
            for (const key in tableParams.filters) {
                filterQueriesStr = `${filterQueriesStr}&${key}=${tableParams.filters[key]}`;
            }
            let url = ""
            if(sort) {
                const sort_factor = tableParams.sorter?.field
                const order = tableParams.sorter?.order
                url = `/customers/opportunity/all?sort_factor=${sort_factor}&order=${order}`
            }
            else {
                url = "/customers/opportunity/all"
            }

            const response = await fetchClient({
                url: url, data_return: true
            })

            console.log(response)
            setRawData(response)
            const results = response
            const data = results.map((item: any, index: any) => ({
                key: index,
                id: item.clientId,
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

    // useEffect(() => {
    //     fetchData();
    // }, []);

    useEffect(() => {
        setTableParams({
            ...tableParams,
            pagination: {
                current: 1,
                pageSize: 10,
                total: 0,
            }
        });

        fetchData(true)
    }, [isSorting])


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
                            style={{ marginBottom: 0 }}
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
                                options={list_sort.map((item) => ({
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
                            <Button onClick={handleClearAll}>
                                Clear sorters
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
                                `${t_general("total")} ${total} ${t_general("item")}`,
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
