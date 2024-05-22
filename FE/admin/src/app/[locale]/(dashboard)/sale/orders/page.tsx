"use client";
import React, { useEffect, useRef, useState } from "react";
import {
    InputRef,
    Table,
    Space,
    Descriptions,
    Tag,
} from "antd";
import { TableProps, GetProp, TableColumnType } from "antd";
import type {
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
import TableOrderRender from "@/components/TableOrder";
import { useTranslations } from "next-intl";

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
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState<any>([]);
    const [reload, setReload] = useState(false);
    const socket = useSocket();
    const t_order = useTranslations('Order')

    const item_columns = [
        {
            title: t_order('name'),
            dataIndex: "name",
            key: "name",
        },
        {
            title: t_order('quantity'),
            dataIndex: "OrderItem",
            key: "quantity",
            render: (record: any) => <span>{record.quantity}</span>,
        },
        {
            title: t_order('price'),
            dataIndex: "price",
            key: "price",
            render: (record: any) => <span>{record}</span>,
        },
        {
            title: t_order('amount'),
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
            message.success(`${t_order('finish-1')} #${orderId}${t_order('finish-2')}`);
            setReload((prev) => !prev)
        });
        socket.on("cancelOrder:fromClient", async (orderId: any) => {
            message.warning(`${t_order('cancel-1')} #${orderId} ${t_order('cancel-2')}`);
            setReload((prev) => !prev)
        });
        socket.on("newOrder:fromClient", async (name: any) => {
            message.success(`${t_order('new-order')} ${name}!`);
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
            title: t_order('fullname'),
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
            title: t_order('status'),
            dataIndex: "status",
            key: "status",
            render: (_, record) => {
                let color = "";
                switch (record.status) {
                    case "Cancel":
                        color = "red";
                        return (
                            <Space size='small'>
                                <Tag color={color}>{t_order('cancel')}</Tag>
                            </Space>
                        );
                        break;
                    case "Pending":
                        color = "blue";
                        return (
                            <Space size='small'>
                                <Tag color={color}>{t_order('pending')}</Tag>
                            </Space>
                        );
                        break;
                    case "Preparing":
                        color = "green";
                        return (
                            <Space size='small'>
                                <Tag color={color}>{t_order('preparing')}</Tag>
                            </Space>
                        );
                        break;
                    case "Ready":
                        color = "orange";
                        return (
                            <Space size='small'>
                                <Tag color={color}>{t_order('ready')}</Tag>
                            </Space>
                        );
                        break;
                    case "Delivering":
                        color = "yellow";
                        return (
                            <Space size='small'>
                                <Tag color={color}>{t_order('delivering')}</Tag>
                            </Space>
                        );
                        break;
                    case "Done":
                        color = "purple";
                        return (
                            <Space size='small'>
                                <Tag color={color}>{t_order('done')}</Tag>
                            </Space>
                        );
                        break;
                    default:
                        break;
                }
                return (
                    <Space size='small'>
                        <Tag color={color}>Default</Tag>
                    </Space>
                );
            },
        },
        {
            title: t_order('amount'),
            dataIndex: "amount",
            key: "amount",
        },
        {
            title: t_order('created-at'),
            dataIndex: "createdAt",
            key: "createdAt",
            render: (text, record) => {
                return <>{moment(text).format("MMMM Do YYYY, h:mm:ss a")}</>;
            },
        },
        {
            title: t_order('action'),
            key: "action",
            render: (_, record) => (
                <Space size='middle'>
                    {record.status == "Pending" ? (
                        <>
                            <a
                                onClick={() => {
                                    Modal.confirm({
                                        title: t_order('accept-this-order'),
                                        autoFocusButton: null,
                                        okButtonProps: {
                                            style: {
                                                backgroundColor: "#2b60ff",
                                            },
                                        },
                                        okText: t_order('accept'),
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
                                {t_order('accept')}
                            </a>
                            {record.paymentMethod != "MOMO" && (
                                <a
                                    onClick={() => {
                                        Modal.confirm({
                                            title: t_order('reject-this-order'),
                                            autoFocusButton: null,
                                            okButtonProps: {
                                                style: {
                                                    backgroundColor: "#f7454e",
                                                },
                                            },
                                            okText: t_order('reject'),
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
                                    {t_order('reject')}
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
                                    title: t_order('deliver-this-order'),
                                    autoFocusButton: null,
                                    okButtonProps: {
                                        style: {
                                            backgroundColor: "#2b60ff",
                                        },
                                    },
                                    okText: t_order('deliver'),
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
                            {t_order('deliver')}
                        </a>
                    ) : record.status == "Delivering" ? (
                        <a
                            onClick={() => {
                                Modal.confirm({
                                    title: t_order('finish-delivering-this-order'),
                                    autoFocusButton: null,
                                    okButtonProps: {
                                        style: {
                                            backgroundColor: "#2b60ff",
                                        },
                                    },
                                    okText: t_order('finish'),
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
                            {t_order('done')}
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
                title={t_order('order-information')}
                open={open}
                onOk={handleOk}
                okType='primary'
                okButtonProps={{ className: "bg-primary" }}
                cancelText={t_order('cancel')}
                onCancel={handleCancel}
                footer={null}
                width={800}
            >
                <Descriptions>
                    <Descriptions.Item label={t_order('order-id')}>
                        {modalData.id}
                    </Descriptions.Item>
                    <Descriptions.Item label={t_order('fullname')}>
                        {modalData.fullname}
                    </Descriptions.Item>
                    <Descriptions.Item label={t_order('description')}>
                        {modalData.descriptions}
                    </Descriptions.Item>
                    <Descriptions.Item label={t_order('payment-method')}>
                        {modalData.paymentMethod}
                    </Descriptions.Item>
                    <Descriptions.Item label={t_order('status')}>
                        {modalData.status}
                    </Descriptions.Item>
                    <Descriptions.Item label={t_order('date')}>
                        {modalData.createdAt}
                    </Descriptions.Item>
                </Descriptions>{" "}
                <Descriptions title={t_order('items')}> </Descriptions>
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
