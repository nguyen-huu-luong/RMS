"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next-intl/client";
import Column from "@/components/Chef/column";
import { message } from "antd";
import useSocket from "@/socket";
import fetchClient from "@/lib/fetch-client";
import Loading from "@/components/loading";
import { useLocale, useTranslations } from "next-intl";

function Chef() {
    const router = useRouter();
    const [orders, setOrders] = useState<any>(null);
    const [preparingItems, setPreparingItems] = useState<any>(null);
    const [cookingItems, setCookingItems] = useState<any>(null);
    const [doneItems, setDoneItems] = useState<any>(null);
    const [refetch, setRefetch] = useState<boolean>(false);
    const { data: session, status } = useSession();
    const t_chef: any = useTranslations("Chef")
    const socket = useSocket();
    useEffect(() => {
        if (!socket) return;
        socket.on("order:prepare:fromStaff", (orderId: any) => {
            message.info(`New order #${orderId}`);
            setRefetch((pre: any) => !pre);

        });

        socket.on("table:prepare:fromStaff", (tableId: any) => {
            message.info(`New order from table #${tableId}`);
            setRefetch((pre: any) => !pre);
        });

        return () => {
            socket.off("order:prepare:fromStaff");
        };
    }, [socket]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const ordersData = await fetchClient({
                    url: "/orders/chef",
                    data_return: true,
                });
                const filteredOrderItems = ordersData.orderItems.flatMap(
                    (order: any) =>
                        order.orderItems.filter(
                            (item: any) =>
                                item.OrderItem.status === "Preparing" ||
                                item.OrderItem.status === "Cooking" ||
                                item.OrderItem.status === "Ready"
                        )
                );
                const filteredTableItems = ordersData.tableItems.flatMap(
                    (table: any) =>
                        table.cartItems.filter(
                            (item: any) =>
                                item.CartItem.status === "Preparing" ||
                                item.CartItem.status === "Cooking" ||
                                item.CartItem.status === "Ready"
                        )
                );

                const filteredItems =
                    filteredOrderItems.concat(filteredTableItems);
                const preparingItems = filteredItems
                    .filter(
                        (item: any) =>
                            (item.OrderItem &&
                                item.OrderItem.status === "Preparing") ||
                            (item.CartItem &&
                                item.CartItem.status === "Preparing")
                    ).sort((a: any, b: any) => {
                        const dateA = a.OrderItem
                            ? new Date(a.OrderItem.createdAt)
                            : new Date(a.CartItem.createdAt);
                        const dateB = b.OrderItem
                            ? new Date(b.OrderItem.createdAt)
                            : new Date(b.CartItem.createdAt);
                        return dateA.getTime() - dateB.getTime();
                    });

                const cookingItems = filteredItems
                    .filter(
                        (item: any) =>
                            (item.OrderItem &&
                                item.OrderItem.status === "Cooking") ||
                            (item.CartItem &&
                                item.CartItem.status === "Cooking")
                    ).sort((a: any, b: any) => {
                        const dateA = a.OrderItem
                            ? new Date(a.OrderItem.updatedAt)
                            : new Date(a.CartItem.updatedAt);
                        const dateB = b.OrderItem
                            ? new Date(b.OrderItem.updatedAt)
                            : new Date(b.CartItem.updatedAt);
                        return dateA.getTime() - dateB.getTime();
                    });


                const doneItems = filteredItems
                    .filter(
                        (item: any) =>
                            (item.OrderItem &&
                                item.OrderItem.status === "Ready") ||
                            (item.CartItem && item.CartItem.status === "Ready")
                    ).sort((a: any, b: any) => {
                        const dateA = a.OrderItem
                            ? new Date(a.OrderItem.updatedAt)
                            : new Date(a.CartItem.updatedAt);
                        const dateB = b.OrderItem
                            ? new Date(b.OrderItem.updatedAt)
                            : new Date(b.CartItem.updatedAt);
                        return dateA.getTime() - dateB.getTime();
                    });

                const filteredOrders = ordersData.orderItems.map(
                    (order: any) => ({
                        orderId: order.id,
                        createdAt: order.createdAt,
                        descriptions: order.descriptions,
                        status: order.status,
                    })
                );
                const filteredTables = ordersData.tableItems.map(
                    (table: any) => ({
                        orderId: table.id,
                        createdAt: table.createdAt,
                        descriptions: "",
                        status: "",
                    })
                );
                setOrders(filteredOrders.concat(filteredTables));
                setPreparingItems(preparingItems);
                setCookingItems(cookingItems);
                setDoneItems(doneItems);
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };
        fetchOrders();
    }, [status, router, refetch]);
    if (!orders) return <Loading />;
    return (
        <div className='flex flex-row justify-between gap-10 w-full h-[680px] p-5'>
            <Column
                name={t_chef('to_do')}
                items={preparingItems}
                refetch={setRefetch}
                orders={orders}
                doneItems={doneItems}
                cookingItems={cookingItems}
                preparingItems={preparingItems}
                socket={socket}
            />
            <Column
                name={t_chef('processing')}
                items={cookingItems}
                refetch={setRefetch}
                orders={orders}
                doneItems={doneItems}
                cookingItems={cookingItems}
                preparingItems={preparingItems}
                socket={socket}
            />
            <Column
                name={t_chef('done')}
                items={doneItems}
                refetch={setRefetch}
                orders={orders}
                doneItems={doneItems}
                cookingItems={cookingItems}
                preparingItems={preparingItems}
                socket={socket}
            />
        </div>
    );
}

export default Chef;
