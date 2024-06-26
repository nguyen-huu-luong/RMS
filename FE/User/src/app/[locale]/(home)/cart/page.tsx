"use client";
import { useEffect } from "react";
import Link from "next-intl/link";
import { useLocale, useTranslations } from "next-intl";
import Progress from "@/components/order/progressBar";
import {
    PlusCircleOutlined,
    MinusCircleOutlined,
    CloseCircleFilled,
} from "@ant-design/icons";
import Image from "next/image";
import moneyFormatter from "@/components/function/moneyFormatter";

import useSWR from "swr";
import { cartFetcher, editCart, removeProduct } from "@/app/api/product/cart";
import { useSession } from "next-auth/react";
import { useRouter } from "next-intl/client";
import Loading from "@/components/loading";
import fetchClient from "@/lib/fetch-client";

export default function Cart() {
    const locale = useLocale();
    const t = useTranslations("Cart");
    const { data: session, status } = useSession();
    const router = useRouter();
    useEffect(() => {
        if (status === "loading") return;
        if (status === "unauthenticated") {
            router.push("/signin");
        }
    }, [status, router]);
    const {
        data: cartItems,
        error: cartItemsError,
        isLoading: cartItemsLoading,
        mutate,
    } = useSWR(
        session ? [`/carts`] : null,
        ([url]) => fetchClient({ url: url, data_return: true }),
        {
            keepPreviousData: true,
            onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
                if (retryCount >= 10) return;
                setTimeout(() => revalidate({ retryCount }), 2000);
            },
        }
    );
    if (status === "loading") return <Loading />;
    if (status === "unauthenticated") router.push("/signin");

    // Order step
    const updateQuantity = async (itemId: number, newQuantity: number) => {
        if (newQuantity === 0) {
            await removeItem(itemId);
            return;
        }
        await fetchClient({
            url: `/carts`,
            body: {
                productId: itemId,
                quantity: newQuantity,
            },
            method: "PUT",
        });
        await mutate();
    };
    const removeItem = async (itemId: number) => {
        await fetchClient({ url: `/carts/${itemId}`, method: "DELETE" });
        await mutate();
    };

    if (cartItemsError) return <div>Failed to load</div>;
    if (cartItemsLoading) return <Loading />;
    if (!cartItems) return <Loading />;
    if (cartItems && cartItems.code) {
        return setTimeout(() => mutate(), 1000);
    }
    return cartItems.cart.total === 0 ? (
        <div className='w-full h-auto flex flex-col justify-center items-center gap-5 p-20 bg-primary-white rounded-3xl transition-all duration-300'>
            <div className='w-auto h-auto rounded-lg overflow-hidden'>
                <Image
                    src={"/cart.png"}
                    alt={"Cart"}
                    width={200}
                    height={200}
                    unoptimized
                />
            </div>
            <span className='font-bold'>{t("No")}</span>
            <Link
                href={"/menu"}
                locale={locale}
                className='p-3 w-auto h-auto rounded-lg font-extrabold text-lg border-orange-500 border-2 hover:bg-primary-400 bg-primary text-item-white transition-all duration-300 flex justify-center'
            >
                {t("Continue")}
            </Link>
        </div>
    ) : (
        <div className='flex flex-col lg:flex-row justify-between gap-5 p-10'>
            <div className='flex flex-col justify-between gap-5 w-full'>
                <Progress current={0} />
                <div className='w-full h-auto p-10 rounded-3xl bg-primary-white overflow-x-auto'>
                    <table className='table-auto min-w-full'>
                        <thead>
                            <tr>
                                <th className='text-left p-2 font-extrabold text-lg'>
                                    {t("Dish")}
                                </th>
                                <th className='text-left p-2 font-extrabold text-lg'>
                                    {t("Quantity")}
                                </th>
                                <th className='text-left p-2 font-extrabold text-lg'>
                                    {t("Price")}
                                </th>
                                <th className='text-left p-2 font-extrabold text-lg'>
                                    {t("Total")}
                                </th>
                                <th className='text-left p-2 font-extrabold text-lg text-white'></th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.items.map((item: any) => (
                                <tr key={item.id}>
                                    <td className='text-left p-2 font-medium text-xl '>
                                        {item.name}
                                    </td>
                                    <td className='text-left p-2 font-medium text-xl flex flex-row justify-between w-24'>
                                        <button
                                            className='w-auto h-auto text-primary'
                                            onClick={() => {
                                                updateQuantity(
                                                    item.id,
                                                    item.CartItem.quantity - 1
                                                );
                                            }}
                                        >
                                            <MinusCircleOutlined
                                                style={{
                                                    fontSize: "1.4rem",
                                                }}
                                            />
                                        </button>
                                        <span className='font-bold text-item-black'>
                                            {item.CartItem.quantity}
                                        </span>
                                        <button
                                            className='w-auto h-auto text-primary'
                                            onClick={() =>
                                                updateQuantity(
                                                    item.id,
                                                    item.CartItem.quantity + 1
                                                )
                                            }
                                        >
                                            <PlusCircleOutlined
                                                style={{
                                                    fontSize: "1.4rem",
                                                }}
                                            />
                                        </button>
                                    </td>
                                    <td className='text-left p-2 font-medium text-xl '>
                                        {moneyFormatter(item.price)}
                                    </td>
                                    <td className='text-left p-2 font-medium text-xl '>
                                        {moneyFormatter(item.CartItem.amount)}
                                    </td>
                                    <td className='text-left p-2 font-medium text-xl '>
                                        <button
                                            className='w-auto h-auto text-gray-400'
                                            onClick={() => removeItem(item.id)}
                                        >
                                            <CloseCircleFilled
                                                style={{
                                                    fontSize: "1.4rem",
                                                }}
                                            />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* CART STATE */}
            <div className='w-auto h-auto p-10 rounded-3xl bg-primary-white flex flex-col gap-5 justify-start items-center font-extrabold'>
                <div className='w-full flex flex-row justify-between gap-14 text-lg'>
                    <span className='w-auto whitespace-nowrap'>
                        {t("Amount")}
                    </span>
                    <span className='w-auto whitespace-nowrap text-primary'>
                        {moneyFormatter(cartItems.cart.amount)}
                    </span>
                </div>
                <Link
                    href={"/menu"}
                    locale={locale}
                    className='p-2 w-full h-auto rounded-lg border-orange-500 border-2 hover:bg-primary hover:text-item-white transition-all duration-300 flex justify-center'
                >
                    {t("More")}
                </Link>
                <Link
                    href={"/order"}
                    locale={locale}
                    className='p-2 w-full h-auto rounded-lg border-orange-500 border-2 bg-primary hover:bg-primary-400 text-item-white transition-all duration-300  flex justify-center'
                >
                    {t("Continue_2")}
                </Link>
            </div>
        </div>
    );
}
