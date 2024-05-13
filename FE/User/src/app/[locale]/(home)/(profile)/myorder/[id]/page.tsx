"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { useSession } from "next-auth/react";
import { useRouter } from "next-intl/client";
import useSWR from "swr";
import { orderFetcher } from "@/app/api/general/order";
import Image from "next/image";
import moment, { Moment } from "moment";
import { FileSearchOutlined, CloseSquareOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { Descriptions, Space, Table } from "antd";
import moneyFormatter from "@/components/function/moneyFormatter";
import Loading from "@/components/loading";
import fetchClient from "@/lib/fetch-client";
import useSocket from "@/socket";
export default function Page({ params }: { params: { id: string } }) {
    const t = useTranslations("Profile");
    const socket = useSocket();
    const locale = useLocale();
    const { data: session, status } = useSession();
    const router = useRouter();
    useEffect(() => {
        if (status === "loading") return;
        if (status === "unauthenticated") {
            router.push("/signin");
        }
    }, [status, router]);
    const {
        data: order,
        error: orderErrors,
        isLoading: orderLoading,
        mutate
    } = useSWR(`/orders/${params.id}`, (url) =>
        fetchClient({ url: url, data_return: true })
    );
    useEffect(() => {
        if (!socket) return;
        const handleGetNotification = (orderId: any) => {
            setTimeout(async ()=>{
                await mutate()
            }, 500)
        };

        socket.on("notification:prepare:fromStaff", handleGetNotification);
        socket.on("notification:deliver:fromStaff", handleGetNotification);
        socket.on("notification:done:fromStaff", handleGetNotification);
        socket.on("notification:reject:fromStaff", handleGetNotification);

        socket.on("connect_error", (error: any) => {
            console.log(error);
        });
        return () => {
            socket.off("notification:prepare:fromStaff", handleGetNotification);
            socket.off("notification:deliver:fromStaff", handleGetNotification);
            socket.off("notification:done:fromStaff", handleGetNotification);
            socket.off("notification:reject:fromStaff", handleGetNotification);
        };
    }, [socket]);
    const columns = [
        {
            title: t("Name"),
            dataIndex: "name",
            key: "name",
        },
        {
            title: t("Quantity"),
            dataIndex: "OrderItem",
            key: "quantity",
            render: (record: any) => <span>{record.quantity}</span>,
        },
        {
            title: t("Price"),
            dataIndex: "price",
            key: "price",
            render: (record: any) => <span>{moneyFormatter(record)}</span>,
        },
        {
            title: t("Amount"),
            dataIndex: "OrderItem",
            key: "amount",
            render: (record: any) => (
                <span>{moneyFormatter(record.amount)}</span>
            ),
        },
    ]; 
    if (orderErrors) return <div>Failed to load</div>;
    if (orderLoading) return <Loading />;
    if (!order) return <Loading />;
    return (
        <>
            <div className='bg-primary-white w-full h-auto font-bold text-normal rounded-xl py-2 px-3'>
                <Link href={"/myorder"}>{t("Manage")}</Link> / {t("Order")}{" "}
                {params.id}
            </div>
            <div className='bg-primary-white w-full h-auto font-bold text-normal rounded-xl flex flex-col gap-2 p-3'>
                <Descriptions title='Overview'>
                    <Descriptions.Item label='Id'>
                        {order.order.id}
                    </Descriptions.Item>
                    <Descriptions.Item label={t("Date")}>
                        {moment(order.order.createdAt).format("L")}
                    </Descriptions.Item>
                    <Descriptions.Item label={t("Status")}>
                        {order.order.status}
                    </Descriptions.Item>
                    <Descriptions.Item label={t("Ship")}>
                        {order.order.shippingCost}
                    </Descriptions.Item>
                    <Descriptions.Item label={t("Amount")}>
                        {order.order.amount}
                    </Descriptions.Item>
                    <Descriptions.Item label={t("Remain")}>
                        {order.order.paymentMethod == "CASH"
                            ? order.order.amount
                            : 0}
                    </Descriptions.Item>
                </Descriptions>
                <Descriptions title={t("Detail")}>
                    <Descriptions.Item label={t("Address")}>
                        {order.order.shippingAddress
                            ? order.order.shippingAddress
                            : t("Take")}
                    </Descriptions.Item>
                    <Descriptions.Item label={t("Pay")}>
                        {order.order.paymentMethod}
                    </Descriptions.Item>
                    <Descriptions.Item label={t("Receiver")}>
                        {session?.user.firstname + " " + session?.user.lastname}
                    </Descriptions.Item>
                    <Descriptions.Item label={t("Phone")}>
                        {session?.user.phone}
                    </Descriptions.Item>
                    <Descriptions.Item label={t("Note")}>
                        {order.order.descriptions}
                    </Descriptions.Item>
                </Descriptions>
                <Descriptions title={t("Item")}></Descriptions>
                <Table
                    columns={columns}
                    dataSource={order.items}
                    pagination={{ pageSize: 3 }}
                />
            </div>
        </>
    );
}
