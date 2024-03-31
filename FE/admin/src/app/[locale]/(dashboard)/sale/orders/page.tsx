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
import { io } from "socket.io-client";
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
    Key,
    SortOrder,
} from "antd/es/table/interface";
import axios from "axios";
import { Switch, Modal } from "antd";
import { useRouter } from "next-intl/client";
import { createStyles, useTheme } from "antd-style";
import { useSession } from "next-auth/react";
import moment from "moment";
import {message} from 'antd';

const useStyle = createStyles(({ token }) => ({
    "my-modal-body": {},
    "my-modal-mask": {},
    "my-modal-header": {},
    "my-modal-footer": {},
    "my-modal-content": {},
}));
const { confirm } = Modal;
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

const updateOrder = async (requestBody: any, token: any) => {
    try {
        const response = await axios.put(
            `http://localhost:3003/api/orders/admin`,
            requestBody,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error adding to cart:", error);
        throw error;
    }
};

function showConfirm() {
    confirm({
        title: "Do you want to delete these items?",
        content:
            "When clicked the OK button, this dialog will be closed after 1 second",
        async onOk() {
            try {
                return new Promise((resolve, reject) => {
                    setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
                });
            } catch (e) {
                return console.log("Oops errors!");
            }
        },
        onCancel() {},
    });
}

const orderFetcher = async (url: any, token: any) => {
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw error;
    }
};

const Order: React.FC = () => {
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef<InputRef>(null);
    const [data, setData] = useState<DataType[]>();
    const [loading, setLoading] = useState(false);
    const [socket, setSocket] = useState<any>(null);
    const [selectedOrders, setSelectedOrders] = useState<DataType[]>();
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState<any>([]);
    const [authenticated, setAuthenticated] = useState(false);
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
    const { data: session, status } = useSession();

    const fetchData = () => {
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
            fetch(
                `http://localhost:3003/api/orders/admin?page=${tableParams.pagination?.current}
							&pageSize=${tableParams.pagination?.pageSize}${sortQueries}`,
                {
                    headers: {
                        Authorization: `Bearer ${session?.user.accessToken}`,
                    },
                }
            )
                .then((res) => res.json())
                .then((results) => {
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
                            current: results.page,
                            total: results.totalCount,
                        },
                    });
                })
                .catch((error) => {
                    console.log(error);
                    setError({
                        isError: true,
                        title: error?.name || "Something went wrong!",
                        message: error?.message || "Unknown error",
                    });
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
        if (status === "authenticated") {
            setAuthenticated(true);
        } else if (status === "unauthenticated") {
            router.push("/signin");
        } else return;
        const socketClient = io("http://localhost:3003", {
            auth: {
                token: session?.user.accessToken,
            },
        });
        socketClient.on("connect", () => {
            setSocket(socketClient);
            console.log("Connected to socket server");
        });
        socketClient.on("connect_error", (error: any) => {
            console.log(error);
        });
        socketClient.on("order:finish:fromChef", (orderId: any) => {
            message.success(`Finish order #${orderId}! Ready to deliver!`);
            fetchData()
        });
        socketClient.on("disconnect", () => {
            console.log("Disconnected from socket server");
        });
        return () => {
            socketClient.disconnect();
        };
    }, [status, router, session?.user.accessToken]);

    useEffect(() => {
        if (authenticated) {
            // Gọi fetchData khi authenticated là true
            fetchData();
        }
    }, [authenticated, JSON.stringify(tableParams)]);
    // useEffect(() => {
    //     socket.on("order:finish:fromChef", (orderId: any) => {
    //         console.log(orderId)
    //     });
    // }, [socket]);
    const showModal = async (id: any) => {
        const res = await axios.get(`http://localhost:3003/api/orders/${id}`, {
            headers: {
                Authorization: `Bearer ${session?.user.accessToken}`,
            },
        });
        console.log(res.data.items);
        if (res) setItems(res.data.items);
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

    // rowSelection object indicates the need for row selection
    const rowSelection = {
        onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
            setSelectedOrders(selectedRows);
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
                        <Tag color={color}>{record.status.toUpperCase()}</Tag>;
                    </Space>
                );
            },
            ...getColumnSearchProps("status"),
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
                                            handleAcceptOrder(record.id);
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
                                            handleRejectOrder(record.id),
                                        footer: (_, { OkBtn, CancelBtn }) => (
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
                        </>
                    ) : (
                        ""
                    )}
                    {record.status == "Ready" ? (
                        <a
                            // onClick={() => handleDeliverOrder(record.id)}
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
                                    onOk: () => handleDeliverOrder(record.id),
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
                            // onClick={() => handleDoneOrder(record.id)}
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
                                    onOk: () => handleDoneOrder(record.id),
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
        if (Array.isArray(sorter)) {
            const firstSorter = sorter[0];
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
            setTableParams((prev) => ({
                pagination,
                filters,
                sorter: {
                    field: sorter?.field || prev.sorter?.field,
                    order: sorter?.order || prev.sorter?.order,
                },
            }));
        }
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

    const handleClearFilter = () => {};

    const handleClearAll = () => {};

    const handleCloseError = () => {
        console.log(error);
        setError({ isError: false, title: "", message: "" });
    };

    const handleAcceptOrder = async (orderId: number) => {
        await updateOrder(
            { orderId: orderId, status: "Preparing" },
            session?.user.accessToken
        );
        socket.emit("staff:order:prepare", orderId);
        fetchData();
    };

    const handleDeliverOrder = async (orderId: number) => {
        await updateOrder(
            { orderId: orderId, status: "Delivering" },
            session?.user.accessToken
        );
        fetchData();
    };

    const handleDoneOrder = async (orderId: number) => {
        await updateOrder(
            { orderId: orderId, status: "Done" },
            session?.user.accessToken
        );
        fetchData();
    };

    const handleRejectOrder = async (orderId: number) => {
        await updateOrder(
            { orderId: orderId, status: "Cancel" },
            session?.user.accessToken
        );
        fetchData();
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
