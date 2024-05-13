"use client";
import { updateItemsStatus } from "@/app/api/product/order";
import { useState } from "react";
import { LeftCircleOutlined, RightCircleOutlined } from "@ant-design/icons";
import { Modal, Descriptions, message } from "antd";
import { createStyles } from "antd-style";
import moment from "moment";
import fetchClient from "@/lib/fetch-client";
const useStyle = createStyles(({ token }) => ({
    "my-modal-body": {},
    "my-modal-mask": {},
    "my-modal-header": {},
    "my-modal-footer": {},
    "my-modal-content": {},
}));

function Item({
    item,
    color,
    refetch,
    orders,
    doneItems,
    preparingItems,
    cookingItems,
    socket,
}: {
    item: any;
    color: any;
    refetch: any;
    orders: any;
    doneItems: any;
    preparingItems: any;
    cookingItems: any;
    socket: any;
}) {
    const { styles } = useStyle();
    const classNames = {
        body: styles["my-modal-body"],
        mask: styles["my-modal-mask"],
        header: styles["my-modal-header"],
        footer: styles["my-modal-footer"],
        content: styles["my-modal-content"],
    };
    const [open, setOpen] = useState(false);
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
    const order = orders.find((order: any) =>
        item.OrderItem
            ? order.orderId === item.OrderItem.orderId
            : order.orderId === item.CartItem.cartId
    );
    const updateStatus = async () => {
        const res = await fetchClient({
            url: "/orders/chef",
            method: "PUT",
            body: {
                orderId: item.OrderItem
                    ? item.OrderItem.orderId
                    : item.CartItem.cartId,
                productId: item.OrderItem
                    ? item.OrderItem.productId
                    : item.CartItem.productId,
                dish_status:
                    (item.OrderItem
                        ? item.OrderItem.status
                        : item.CartItem.status) === "Preparing"
                        ? "Cooking"
                        : "Ready",
                POS: item.OrderItem ? false : true,
            },
        });
        refetch((pre: any) => !pre);

        if (item.CartItem && item.CartItem.status == "Cooking") await socket.emit("chef:tableItem:finish", item.CartItem.cartId, item.name);
        if (res.data == "Update Order") {
            message.success(`Finish order #${item.OrderItem.orderId}`);
            await socket.emit("chef:order:finish", item.OrderItem.orderId);
        }
    };

    const showModal = async () => {
        setOpen(true);
    };

    const handleOk = () => {
        setOpen(false);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    return (
        <div className='h-28 w-full rounded-xl border-slate-200 flex flex-row justify-start gap-2 border-2 hover:bg-slate-100 p-2 transition-all duration-300'>
            <div className={`${color} w-2 h-full`} id='color'></div>
            <div className='w-full h-full grid grid-cols-2 gap-2 p-2'>
                <span className='flex justify-start items-center font-bold text-black text-md'>
                    {item.name}
                </span>
                <span
                    onClick={async () => {
                        await showModal();
                    }}
                    className='flex justify-end items-center font-bold text-primary text-md hover:cursor-pointer'
                >
                    #
                    {item.OrderItem
                        ? item.OrderItem.orderId
                        : item.CartItem.cartId}
                </span>
                <span className='flex justify-start items-center font-bold text-black text-md'>
                    Quantity:{" "}
                    {item.OrderItem
                        ? item.OrderItem.quantity
                        : item.CartItem.quantity}
                </span>
                {(item.OrderItem
                    ? item.OrderItem.status
                    : item.CartItem.status) === "Ready" ? (
                    ""
                ) : (
                    <span className='flex justify-end items-center gap-3'>
                        <span className='text-primary'>
                            <RightCircleOutlined
                                style={{ fontSize: "1.4rem" }}
                                className='hover:cursor-pointer'
                                onClick={() => updateStatus()}
                            />
                        </span>
                    </span>
                )}
            </div>
            <Modal
                classNames={classNames}
                styles={modalStyles}
                title={`${
                    item.OrderItem
                        ? "Order #" + item.OrderItem.orderId
                        : "POS Table #" + item.CartItem.cartId
                }`}
                open={open}
                onOk={handleOk}
                okType='primary'
                okButtonProps={{ className: "bg-primary" }}
                cancelText='Cancel'
                onCancel={handleCancel}
                footer={null}
                width={800}
            >
                <Descriptions layout='vertical'>
                    <Descriptions.Item label='Date order'>
                        {moment(order.createdAt).format("DD-MM-YYYY")}
                    </Descriptions.Item>
                    <Descriptions.Item label='Time order'>
                        {moment(order.createdAt).format("hh:mm")}
                    </Descriptions.Item>
                    <Descriptions.Item label='Note'>
                        {order.descriptions}
                    </Descriptions.Item>
                </Descriptions>
            </Modal>
        </div>
    );
}
export default Item;
