"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { useSession } from "next-auth/react";
import { useRouter } from "next-intl/client";
import useSWR from "swr";
import { ordersFetcher } from "@/app/api/general/order";
import Image from "next/image";
import { Space, Table, DatePicker } from "antd";
import moment, { Moment } from "moment";
import { FileSearchOutlined, CloseSquareOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { cancelOrder } from "@/app/api/product/order";
const { RangePicker } = DatePicker;

export default function MyOrder() {
    const locale = useLocale();
    const [dateRange, setDateRange] = useState<any>(null);
    const [filterOrders, setFilteredOrders] = useState<any>(null);
    const handleRangeChange = (dates: any) => {
        setDateRange(dates);
    };
    const { data: session, status } = useSession();
    const router = useRouter();

    const columns = [
        {
            title: "Id",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Date",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (text: any) => <span>{moment(text).format("L")}</span>,
            sorter: (a: any, b: any) =>
                moment(a.createdAt).unix() - moment(b.createdAt).unix(),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
        },
        {
            title: "Action",
            key: "action",
            render: (record: any) => (
                <Space size='middle'>
                    <Link href={`/myorder/${record.id}`} locale={locale}>
                        <FileSearchOutlined
                            style={{ fontSize: "24px", color: "#08c" }}
                        />
                    </Link>
                    {record.status == "Pending" ? (
                        <div className="cursor-pointer" onClick={() => handleDeleteOrder(record)}>
                            <CloseSquareOutlined
                                style={{ fontSize: "24px", color: "#08c" }}
                            />
                        </div>
                    ) : (
                        ""
                    )}
                </Space>
            ),
        },
    ];
    const {
        data: orders,
        error: ordersErrors,
        isLoading: ordersLoading,
    } = useSWR(
        session
            ? [`http://localhost:3003/api/orders`, session.user.accessToken]
            : null,
        ([url, token]) => ordersFetcher(url, token)
    );
    const handleDeleteOrder = (record: any) => {
        cancelOrder(session?.user.accessToken, {orderId: record.id, status: "Cancel"})
    }
    useEffect(() => {
        if (!orders) return;
        setFilteredOrders(orders);
        if (!dateRange) return;
        console.log(dateRange);
        const filteredOrders = orders.filter((order: any) => {
            const orderDate = moment(order.createdAt);
            return orderDate.isBetween(
                moment(dateRange[0].$d).toDate(),
                moment(dateRange[1].$d).toDate(),
                "days",
                "[]"
            );
        });
        console.log(filterOrders);
        setFilteredOrders(filteredOrders);
    }, [dateRange, orders]);
    if (ordersErrors) return <div>Failed to load</div>;
    if (ordersLoading) return <div>Loading...</div>;
    if (!orders) return <div>Loading...</div>;
    if (!filterOrders) return <div>Loading...</div>;
    return (
        <>
            <div className='bg-primary-white w-full h-auto font-bold text-normal rounded-xl py-2 px-3'>
                Manage Order
            </div>
            {orders.length == 0 ? (
                <div className='bg-primary-white w-full h-auto font-bold text-normal rounded-xl flex flex-col gap-2 items-center p-10'>
                    <div className='w-auto h-auto rounded-lg overflow-hidden'>
                        <Image
                            src={"/no-order.png"}
                            alt={"no-order"}
                            width={300}
                            height={300}
                            unoptimized
                        />
                    </div>
                    <span className='font-bold'>
                        You haven't placed any orders yet.
                    </span>{" "}
                </div>
            ) : (
                <div className='bg-primary-white w-full h-auto font-bold text-normal rounded-xl py-2 px-3 flex flex-col gap-2'>
                    <RangePicker onChange={handleRangeChange} />
                    <div className=''>
                        <Table
                            columns={columns}
                            dataSource={filterOrders}
                            pagination={{ pageSize: 5 }}
                        />
                    </div>
                </div>
            )}
        </>
    );
}