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
    Descriptions,
    Tag,
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
import { useRouter } from "next-intl/client";
import { createStyles } from "antd-style";
import moment from "moment";
import { message } from "antd";
import fetchClient from "@/lib/fetch-client";
import useSocket from "@/socket";

const useStyle = createStyles(({ token }) => ({
    "my-modal-body": {},
    "my-modal-mask": {},
    "my-modal-header": {},
    "my-modal-footer": {},
    "my-modal-content": {},
}));
type ColumnsType<T> = TableProps<T>["columns"];
type TablePaginationConfig = Exclude<
    GetProp<TableProps, "pagination">,
    boolean
>;
interface DataType {
    key: React.Key;
    id: number;
    fullname: string;
    status: string;
    createdAt: string;
    amount: number;
    clientId: number;
    paymentMethod: string;
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

const Order: React.FC = () => {
    const [checker, setChecker] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef<InputRef>(null);
    const [data, setData] = useState<DataType[]>();
    const [loading, setLoading] = useState(false);
    const [selectedOrders, setSelectedOrders] = useState<DataType[]>();
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState<any>([]);
    const socket = useSocket();
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

    const item_columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Quantity",
            dataIndex: "OrderItem",
            key: "quantity",
            render: (record: any) => <span>{record.quantity}</span>,
        },
        {
            title: "Price",
            dataIndex: "price",
            key: "price",
            render: (record: any) => <span>{record}</span>,
        },
        {
            title: "Amount",
            dataIndex: "OrderItem",
            key: "amount",
            render: (record: any) => <span>{record.amount}</span>,
        },
    ];

    const router = useRouter();
    const [modalData, setModalData] = useState<any>({
        id: "",
        amount: "",
        fullname: "",
        descriptions: "",
        discountAmount: "",
        paymentMethod: "",
        status: "",
        createdAt: "",
    });
    const { styles } = useStyle();

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

            const results = await fetchClient({
                url: `/orders/admin?page=${tableParams.pagination?.current}
            &pageSize=${tableParams.pagination?.pageSize}${sortQueries}`,
                data_return: true,
            });
            const data = results.data.map((item: any) => ({
                ...item.order,
                key: item.order.id,
                fullname: `${item.client.firstname} ${item.client.lastname}`,
            }));
            setData(data);
            setLoading(false);
            setTableParams({
                ...tableParams,
                pagination: {
                    ...tableParams.pagination,
                    pageSize: results.pageSize,
                    current: parseInt(results.page, 10),
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
        if (!socket) return;
        socket.on("order:finish:fromChef", async (orderId: any) => {
            message.success(`Finish order #${orderId}! Ready to deliver!`);
            await fetchData();
        });
        socket.on("cancelOrder:fromClient", async (orderId: any) => {
            message.warning(`Order #${orderId} is cancel by client!`);
            await fetchData();
        });
        socket.on("newOrder:fromClient", async (name: any) => {
            message.success(`New order from client ${name}!`);
            await fetchData();
        });
        return () => {
            socket.off("order:finish:fromChef");
        };
    }, [socket]);

    useEffect(() => {
        fetchData();
    }, [JSON.stringify(tableParams)]);

    const showModal = async (id: any) => {
        const res = await fetchClient({
            url: `/orders/${id}`,
            data_return: true,
        });
        console.log(res);
        if (res) setItems(res.items);
        setOpen(true);
    };

    const handleOk = () => {
        setOpen(false);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const classNames = {
        body: styles["my-modal-body"],
        mask: styles["my-modal-mask"],
        header: styles["my-modal-header"],
        footer: styles["my-modal-footer"],
        content: styles["my-modal-content"],
    };

    const modalStyles = {
        header: {
            borderRadius: 0,
            borderBottom: "1px solid #ccc",
            paddingBottom: 4,
            marginBottom: 24,
        },
        body: {
            borderRadius: 5,
        },
        footer: {
            borderTop: "1px solid #ccc",
            paddingTop: 16,
        },
        content: {
            padding: 20,
        },
    };

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
            setSelectedOrders(selectedRows);
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
            render: (_, record) => (
                <a
                    onClick={async () => {
                        setModalData(record);
                        await showModal(record.id);
                    }}
                    className='text-blue-700 hover:text-blue-600'
                >
                    {record.id}
                </a>
            ),
        },
        {
            title: "Fullname",
            dataIndex: "fullname",
            key: "fullname",
            render: (_, record) => (
                <a
                    onClick={() => router.push(`/customers/${record.clientId}`)}
                    className='text-blue-700 hover:text-blue-600'
                >
                    {record.fullname}
                </a>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (_, record) => {
                let color = "";
                switch (record.status) {
                    case "Cancel":
                        color = "red";
                        break;
                    case "Pending":
                        color = "blue";
                        break;
                    case "Preparing":
                        color = "green";
                        break;
                    case "Ready":
                        color = "orange";
                        break;
                    case "Delivering":
                        color = "yellow";
                        break;
                    case "Done":
                        color = "purple";
                        break;
                    default:
                        break;
                }
                return (
                    <Space size='small'>
                        <Tag color={color}>{record.status.toUpperCase()}</Tag>
                    </Space>
                );
            },
            // ...getColumnSearchProps("status"),
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            ...getColumnSearchProps("amount"),
        },
        {
            title: "Created At",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (text, record) => {
                return <>{moment(text).format("MMMM Do YYYY, h:mm:ss a")}</>;
            },
            ...getColumnSearchProps("createdAt"),
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Space size='middle'>
                    {record.status == "Pending" ? (
                        <>
                            <a
                                onClick={() => {
                                    Modal.confirm({
                                        title: "Accept this order",
                                        autoFocusButton: null,
                                        okButtonProps: {
                                            style: {
                                                backgroundColor: "#2b60ff",
                                            },
                                        },
                                        okText: "Accept",
                                        onOk: () => {
                                            handleAcceptOrder(record);
                                        },
                                        footer: (_, { OkBtn, CancelBtn }) => (
                                            <>
                                                <CancelBtn />
                                                <OkBtn />
                                            </>
                                        ),
                                    });
                                }}
                                className='text-green-700 hover:text-green-600'
                            >
                                Accept
                            </a>
                            {record.paymentMethod != "MOMO" && (
                                <a
                                    onClick={() => {
                                        Modal.confirm({
                                            title: "Reject this order",
                                            autoFocusButton: null,
                                            okButtonProps: {
                                                style: {
                                                    backgroundColor: "#f7454e",
                                                },
                                            },
                                            okText: "Reject",
                                            onOk: () =>
                                                handleRejectOrder(record),
                                            footer: (
                                                _,
                                                { OkBtn, CancelBtn }
                                            ) => (
                                                <>
                                                    <CancelBtn />
                                                    <OkBtn />
                                                </>
                                            ),
                                        });
                                    }}
                                    className='text-red-700 hover:text-red-600'
                                >
                                    Reject
                                </a>
                            )}
                        </>
                    ) : (
                        ""
                    )}
                    {record.status == "Ready" ? (
                        <a
                            onClick={() => {
                                Modal.confirm({
                                    title: "Deliver this order",
                                    autoFocusButton: null,
                                    okButtonProps: {
                                        style: {
                                            backgroundColor: "#2b60ff",
                                        },
                                    },
                                    okText: "Deliver",
                                    onOk: () => handleDeliverOrder(record),
                                    footer: (_, { OkBtn, CancelBtn }) => (
                                        <>
                                            <CancelBtn />
                                            <OkBtn />
                                        </>
                                    ),
                                });
                            }}
                            className='text-blue-700 hover:text-blue-600'
                        >
                            Deliver
                        </a>
                    ) : record.status == "Delivering" ? (
                        <a
                            onClick={() => {
                                Modal.confirm({
                                    title: "Finish delivering this order",
                                    autoFocusButton: null,
                                    okButtonProps: {
                                        style: {
                                            backgroundColor: "#2b60ff",
                                        },
                                    },
                                    okText: "Finish",
                                    onOk: () => handleDoneOrder(record),
                                    footer: (_, { OkBtn, CancelBtn }) => (
                                        <>
                                            <CancelBtn />
                                            <OkBtn />
                                        </>
                                    ),
                                });
                            }}
                            className='text-blue-700 hover:text-blue-600'
                        >
                            Done
                        </a>
                    ) : (
                        ""
                    )}
                </Space>
            ),
        },
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
        setTableParams((prev: any) => ({
            ...prev,
            filters: {},
        }));
    };

    const handleClearAll = () => {
        setTableParams((prev: any) => ({
            ...prev,
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
        }));
        setSearchText("");
        setSearchedColumn("");
    };

    const handleCloseError = () => {
        console.log(error);
        setError({ isError: false, title: "", message: "" });
    };

    const handleAcceptOrder = async (order: any) => {
        await fetchClient({
            url: `/orders/admin`,
            method: "PUT",
            body: { orderId: order.id, status: "Preparing" },
        });
        await fetchClient({
            url: `/notifications/${order.clientId}`,
            method: "POSt",
            body: { status: false, orderStatus: `${order.id}-1` },
        });
        if (socket) {
            await socket.emit("staff:order:prepare", order.id);
            await socket.emit(
                "staff:notifications:prepare",
                order.clientId,
                order.id
            );
        }
        await fetchData();
    };

    const handleDeliverOrder = async (order: any) => {
        await fetchClient({
            url: `/orders/admin`,
            method: "PUT",
            body: { orderId: order.id, status: "Delivering" },
        });
        await fetchClient({
            url: `/notifications/${order.clientId}`,
            method: "POSt",
            body: { status: false, orderStatus: `${order.id}-2` },
        });
        if (socket) {
            await socket.emit(
                "staff:notifications:deliver",
                order.clientId,
                order.id
            );
        }
        await fetchData();
    };

    const handleDoneOrder = async (order: any) => {
        await fetchClient({
            url: `/orders/admin`,
            method: "PUT",
            body: { orderId: order.id, status: "Done" },
        });
        await fetchClient({
            url: `/notifications/${order.clientId}`,
            method: "POSt",
            body: { status: false, orderStatus: `${order.id}-3` },
        });
        await fetchClient({
            url: `/customers/segment/${order.clientId}`,
            method: "POST",
            body: {},
        });
        if (socket) {
            await socket.emit(
                "staff:notifications:done",
                order.clientId,
                order.id
            );
        }
        await fetchData();
    };

    const handleRejectOrder = async (order: any) => {
        await fetchClient({
            url: `/orders/admin`,
            method: "PUT",
            body: { orderId: order.id, status: "Cancel" },
        });
        await fetchClient({
            url: `/notifications/${order.clientId}`,
            method: "POSt",
            body: { status: false, orderStatus: `${order.id}-0` },
        });
        if (socket) {
            await socket.emit(
                "staff:notifications:reject",
                order.clientId,
                order.id
            );
        }
        await fetchData();
    };

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
                        <div className='flex items-center gap-2'>
                            <p>Sort by: </p>
                            <Select
                                placeholder='Columns'
                                value={
                                    tableParams.sorter?.field?.toString() ||
                                    "id"
                                }
                                onChange={handleSortFieldChange}
                                options={columns
                                    .filter(
                                        (item) =>
                                            item.key !== "fullname" &&
                                            item.key !== "action"
                                    )
                                    .map((item) => ({
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
            <Modal
                classNames={classNames}
                styles={modalStyles}
                title='Order Information'
                open={open}
                onOk={handleOk}
                okType='primary'
                okButtonProps={{ className: "bg-primary" }}
                cancelText='Cancel'
                onCancel={handleCancel}
                footer={null}
                width={800}
            >
                <Descriptions>
                    <Descriptions.Item label='Order Id'>
                        {modalData.id}
                    </Descriptions.Item>
                    <Descriptions.Item label='Customer'>
                        {modalData.fullname}
                    </Descriptions.Item>
                    <Descriptions.Item label='Description'>
                        {modalData.descriptions}
                    </Descriptions.Item>
                    <Descriptions.Item label='Payment Method'>
                        {modalData.paymentMethod}
                    </Descriptions.Item>
                    <Descriptions.Item label='Status'>
                        {modalData.status}
                    </Descriptions.Item>
                    <Descriptions.Item label='Date'>
                        {modalData.createdAt}
                    </Descriptions.Item>
                </Descriptions>{" "}
                <Descriptions title='Items'> </Descriptions>
                <Table
                    columns={item_columns}
                    dataSource={[...items]}
                    pagination={{ pageSize: 3 }}
                />
            </Modal>
        </>
    );
};

export default Order;
