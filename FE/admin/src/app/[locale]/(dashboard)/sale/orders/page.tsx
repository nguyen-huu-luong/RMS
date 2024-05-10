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
import TableRender, { FilterItemType } from "@/components/TableComponents";
import TableOrderRender from "@/components/TableOrder";

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
    const [reload, setReload] = useState(false);
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

    useEffect(() => {
        if (!socket) return;
        socket.on("order:finish:fromChef", async (orderId: any) => {
            message.success(`Finish order #${orderId}! Ready to deliver!`);
            setReload((prev) => !prev)
        });
        socket.on("cancelOrder:fromClient", async (orderId: any) => {
            message.warning(`Order #${orderId} is cancel by client!`);
            setReload((prev) => !prev)
        });
        socket.on("newOrder:fromClient", async (name: any) => {
            message.success(`New order from client ${name}!`);
            setReload((prev) => !prev)
        });
        return () => {
            socket.off("order:finish:fromChef");
        };
    }, [socket]);

    const showModal = async (id: any) => {
        const res = await fetchClient({
            url: `/orders/${id}`,
            data_return: true,
        });
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
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
        },
        {
            title: "Created At",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (text, record) => {
                return <>{moment(text).format("MMMM Do YYYY, h:mm:ss a")}</>;
            },
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
                                        onOk: async () => {
                                            await handleAcceptOrder(record);
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
                                            onOk: async () =>
                                                await handleRejectOrder(record),
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
                                    onOk: async () => await handleDeliverOrder(record),
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
                                    onOk: async () => await handleDoneOrder(record),
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
        setReload((prev) => !prev)
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
        setReload((prev) => !prev)
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
        setReload((prev) => !prev)
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
        setReload((prev) => !prev)
    };
    // const filterItems: FilterItemType[] = [
    //     {
    //         key: "1",
    //         title: "Status",
    //         fieldName: "status",
    //         type: "input",
    //     },
    //     {
    //         key: "6",
    //         title: "CreatedAt",
    //         fieldName: "createdAt",
    //         type: "date",
    //     },
    // ];
    return (
        <>
            <TableOrderRender<DataType>
                columns={columns}
                url='/orders/admin'
                reload={reload}
            />
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
