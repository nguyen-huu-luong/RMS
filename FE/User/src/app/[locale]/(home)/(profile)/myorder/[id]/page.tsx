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
export default function Page({ params }: { params: { id: string } }) {
    const locale = useLocale();
    const { data: session, status } = useSession();
    const {
        data: order,
        error: orderErrors,
        isLoading: orderLoading,
    } = useSWR(
        session
            ? [
                  `http://localhost:3003/api/orders/${params.id}`,
                  session.user.accessToken,
              ]
            : null,
        ([url, token]) => orderFetcher(url, token)
    );
    const columns = [
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
            render: (record: any) => <span>{moneyFormatter(record)}</span>,
        },
        {
            title: "Amount",
            dataIndex: "OrderItem",
            key: "amount",
            render: (record: any) => (
                <span>{moneyFormatter(record.amount)}</span>
            ),
        },
    ];
    if (orderErrors) return <div>Failed to load</div>;
    if (orderLoading) return <div>Loading...</div>;
    if (!order) return <div>Loading...</div>;
    console.log(order);
    return (
        <>
            {" "}
            <div className='bg-primary-white w-full h-auto font-bold text-normal rounded-xl py-2 px-3'>
                <Link href={"/myorder"}>Manage Order</Link> / Order {params.id}
            </div>
            <div className='bg-primary-white w-full h-auto font-bold text-normal rounded-xl flex flex-col gap-2 p-3'>
                <Descriptions title='Overview'>
                    <Descriptions.Item label='Id'>
                        {order.order.id}
                    </Descriptions.Item>
                    <Descriptions.Item label='Date'>
                        {moment(order.order.createdAt).format("L")}
                    </Descriptions.Item>
                    <Descriptions.Item label='Status'>
                        {order.order.status}
                    </Descriptions.Item>
                    <Descriptions.Item label='Amount'>
                        {order.order.amount}
                    </Descriptions.Item>
                    <Descriptions.Item label='Remaining'>
                        {order.order.paymentMethod == "CASH"
                            ? order.order.amount
                            : 0}
                    </Descriptions.Item>
                </Descriptions>
                <Descriptions title='Detail'>
                    <Descriptions.Item label='Shipping Address'>
                        {order.order.shippingAddress
                            ? order.order.shippingAddress
                            : "Take away"}
                    </Descriptions.Item>
                    <Descriptions.Item label='Payment Method'>
                        {order.order.paymentMethod}
                    </Descriptions.Item>
                    <Descriptions.Item label='Receiver'>
                        {order.order.status}
                    </Descriptions.Item>
                    <Descriptions.Item label='Phone Number'>
                        {order.order.amount}
                    </Descriptions.Item>
                    <Descriptions.Item label='Note'>
                        {order.order.descriptions}
                    </Descriptions.Item>
                </Descriptions>
                <Descriptions title='Items'></Descriptions>
                <Table
                    columns={columns}
                    dataSource={order.items}
                    pagination={{ pageSize: 3 }}
                />
            </div>
        </>
    );
}
