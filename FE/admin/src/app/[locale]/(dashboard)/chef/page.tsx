"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { io } from "socket.io-client";
import { useRouter } from "next-intl/client";
import useSWR from "swr";
import { orderItemsFetcher } from "@/app/api/product/order";
import Column from "@/components/Chef/column";
import { message } from "antd";
import useSocket from "@/socket";
import fetchClient from "@/lib/fetch-client";

function Chef() {
    const router = useRouter();
    const [orders, setOrders] = useState<any>(null);
    const [preparingItems, setPreparingItems] = useState<any>(null);
    const [cookingItems, setCookingItems] = useState<any>(null);
    const [doneItems, setDoneItems] = useState<any>(null);
    const [refetch, setRefetch] = useState<any>(null);
    const { data: session, status } = useSession();
    const [authenticated, setAuthenticated] = useState(false);
    const socket = useSocket();
    useEffect(() => {
        if (!socket) return;
        socket.on("order:prepare:fromStaff", (orderId: any) => {
            message.info(`New order #${orderId}`);
            setRefetch(`New order #${orderId}`);
        });
        return () => {
            socket.off("order:prepare:fromStaff");
        };
    }, [socket]);

    useEffect(() => {
        const fetchOrders = async () => {
            if (status === "loading") return;
            if (status === "unauthenticated") {
                router.push("/signin");
                return;
            }
            try {
                const ordersData = await fetchClient({
                    url: "/orders/chef",
                    data_return: true,
                });
                const filteredItems = ordersData.flatMap((order: any) =>
                    order.orderItems.filter(
                        (item: any) =>
                            item.OrderItem.status === "Preparing" ||
                            item.OrderItem.status === "Cooking" ||
                            item.OrderItem.status === "Ready"
                    )
                );
                const preparingItems = filteredItems.filter(
                    (item: any) => item.OrderItem.status === "Preparing"
                );
                const cookingItems = filteredItems.filter(
                    (item: any) => item.OrderItem.status === "Cooking"
                );
                const doneItems = filteredItems.filter(
                    (item: any) => item.OrderItem.status === "Ready"
                );
                const filteredOrders = ordersData.map((order: any) => ({
                    orderId: order.id,
                    createdAt: order.createdAt,
                    descriptions: order.descriptions,
                    status: order.status,
                }));
                setOrders(filteredOrders);
                setPreparingItems(preparingItems);
                setCookingItems(cookingItems);
                setDoneItems(doneItems);
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };
        fetchOrders();
    }, [status, router, refetch]);
    if (!orders) return "Loading...";
    return (
        <div className='flex flex-row justify-between gap-10 w-full h-[680px] p-5'>
            <Column
                name={"To do"}
                items={preparingItems}
                refetch={setRefetch}
                orders={orders}
                doneItems={doneItems}
                cookingItems={cookingItems}
                preparingItems={preparingItems}
                socket={socket}
            />
            <Column
                name={"Processing"}
                items={cookingItems}
                refetch={setRefetch}
                orders={orders}
                doneItems={doneItems}
                cookingItems={cookingItems}
                preparingItems={preparingItems}
                socket={socket}
            />
            <Column
                name={"Done"}
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
