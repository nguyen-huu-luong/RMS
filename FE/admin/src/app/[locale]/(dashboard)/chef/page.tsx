"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { io } from "socket.io-client";
import { useRouter } from "next-intl/client";
import useSWR from "swr";
import { orderItemsFetcher } from "@/app/api/product/order";
import Column from "@/components/Chef/column";
function Chef() {
    const router = useRouter();
    const [orders, setOrders] = useState<any>(null);
    const [preparingItems, setPreparingItems] = useState<any>(null);
    const [cookingItems, setCookingItems] = useState<any>(null);
    const [doneItems, setDoneItems] = useState<any>(null);
    const [refetch, setRefetch] = useState<any>(null);
    const { data: session, status } = useSession();
    useEffect(() => {
        const fetchOrders = async () => {
            if (status === "loading") return;
            if (status === "unauthenticated") {
                router.push("/signin");
                return;
            }
            try {
                const ordersData = await orderItemsFetcher(
                    "http://localhost:3003/api/orders/chef",
                    session?.user.accessToken
                );
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
                    status: order.status
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
    }, [status, router, session?.user.accessToken, refetch]);
    if (!orders) return "Loading...";
    return (
        <div className='flex flex-row justify-between gap-10 w-full h-[680px] p-5'>
            <Column
                name={"To do"}
                items={preparingItems}
                token={session?.user.accessToken}
                refetch={setRefetch}
                orders={orders}
                doneItems={doneItems}
                cookingItems={cookingItems}
                preparingItems={preparingItems}
            />
            <Column
                name={"Processing"}
                items={cookingItems}
                token={session?.user.accessToken}
                refetch={setRefetch}
                orders={orders}
                doneItems={doneItems}
                cookingItems={cookingItems}
                preparingItems={preparingItems}
            />
            <Column
                name={"Done"}
                items={doneItems}
                token={session?.user.accessToken}
                refetch={setRefetch}
                orders={orders}
                doneItems={doneItems}
                cookingItems={cookingItems}
                preparingItems={preparingItems}
            />
        </div>
    );
}

export default Chef;
