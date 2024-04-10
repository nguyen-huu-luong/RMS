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
import Loading from "@/components/loading";
import fetchClient from "@/lib/fetch-client";
const { RangePicker } = DatePicker;

export default function MyOrder() {
    const t = useTranslations("Profile");
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
            title: t("Date"),
            dataIndex: "createdAt",
            key: "createdAt",
            render: (text: any) => <span>{moment(text).format("L")}</span>,
            sorter: (a: any, b: any) =>
                moment(a.createdAt).unix() - moment(b.createdAt).unix(),
        },
        {
            title: t("Status"),
            dataIndex: "status",
            key: "status",
        },
        {
            title: t("Action"),
            key: "action",
            render: (record: any) => (
                <Space size='middle'>
                    <Link href={`/myorder/${record.id}`} locale={locale}>
                        <FileSearchOutlined
                            style={{ fontSize: "24px", color: "#08c" }}
                        />
                    </Link>
                    {record.status == "Pending" ? (
                        <div
                            className='cursor-pointer'
                            onClick={() => handleDeleteOrder(record)}
                        >
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
    } = useSWR(`/orders`, (url) =>
        fetchClient({ url: url, data_return: true })
    );
    const handleDeleteOrder = async (record: any) => {
        await fetchClient({
            url: `/orders`,
            method: "PUT",
            body: {
                orderId: record.id,
                status: "Cancel",
            },
        });
    };
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
        setFilteredOrders(filteredOrders);
    }, [dateRange, orders]);
    if (ordersErrors) return <div>Failed to load</div>;
    if (ordersLoading) return <Loading />;
    if (!orders) return <Loading />;
    if (!filterOrders) return <Loading />;
    return (
        <>
            <div className='bg-primary-white w-full h-auto font-bold text-normal rounded-xl py-2 px-3'>
                {t("Manage")}
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
                    <span className='font-bold'>{t("No")}</span>{" "}
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
