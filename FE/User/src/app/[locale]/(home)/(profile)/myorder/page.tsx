"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import Image from "next/image";
import { Space, Table, DatePicker } from "antd";
import moment, { Moment } from "moment";
import { FileSearchOutlined, CloseSquareOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import Loading from "@/components/loading";
import fetchClient from "@/lib/fetch-client";
import useSocket from "@/socket";
const { RangePicker } = DatePicker;

export default function MyOrder() {
    const t = useTranslations("Profile");
    const locale = useLocale();
    const [dateRange, setDateRange] = useState<any>(null);
    const [filterOrders, setFilteredOrders] = useState<any>(null);
    const handleRangeChange = (dates: any) => {
        setDateRange(dates);
    };
    const socket = useSocket();
    useEffect(() => {
        if (!socket) return;
        const handleGetNotification = (orderId: any) => {
            setTimeout(()=>{
                fetchData()
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
    const [orders, setOrders] = useState<any>(null);

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
                    {record.status == "Pending" && record.paymentMethod != "MOMO" ? (
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

    const fetchData = async () => {
        try {
            const orders = await fetchClient({
                url: `/orders`,
                data_return: true,
            });
            setOrders(orders);
        } catch (error) {
            console.error("Error fetching cart data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDeleteOrder = async (record: any) => {
        await fetchClient({
            url: `/orders`,
            method: "PUT",
            body: {
                orderId: record.id,
                status: "Cancel",
            },
        });
        await fetchData();
        await socket.emit("client:cancelOrder", record.id)
    };
    useEffect(() => {
        if (!orders) return;
        setFilteredOrders(orders);
        if (!dateRange) return;
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
