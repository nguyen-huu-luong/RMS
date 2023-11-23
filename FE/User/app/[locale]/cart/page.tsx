"use client";
import { useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Steps, ConfigProvider } from "antd";
import {
    PlusCircleOutlined,
    MinusCircleOutlined,
    CloseCircleFilled,
} from "@ant-design/icons";
import Image from "next/image";
import moneyFormatter from "@/app/components/function/moneyFormatter";
import useSWR from "swr";
const cartFetcher = async (url: string) => {
    try {
        const response = await fetch(url, {
            headers: {
              'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQxIiwiZnVsbE5hbWUiOiJtaW5oIHZ1b25nIiwiZW1haWwiOiJ0ZXN0QGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzAwNzIzMTE0LCJleHAiOjE3MDA3MjM3MTR9.k2qYZMqFVx78VpvwcS-bL7Ls_2MSjDM0YGkr8MKDJEk`,
              'Content-Type': 'application/json',
            },
          })
          return response.json();
    } catch (error) {
        console.log(error)
    }

};


export default function Cart() {
    const locale = useLocale();
    const {
        data: cartItems,
        error: cartItemsError,
        isLoading: cartItemsLoading,
    } = useSWR(`${process.env.BASE_URL}/carts/item`, cartFetcher);
    // Order step
    const current: number = 0;
    const steps = [
        {
            title: "CART",
        },
        {
            title: "ORDER",
        },
        {
            title: "PAYMENT",
        },
    ];
    const items = steps.map((item) => ({ key: item.title, title: item.title }));

    // For cart demo
    // const [cart, setCart] = useState<FoodItem[]>([
    //     { id: 1, name: "Pizza", quantity: 1, price: 100000 },
    //     { id: 2, name: "Burger", quantity: 2, price: 50000 },
    //     { id: 3, name: "Salad", quantity: 1, price: 80000 },
    // ]);
    // const removeItem = (itemId: number): void => {
    //     const updatedCart = cart.filter((item) => item.id !== itemId);
    //     setCart(updatedCart);
    // };
    // const getTotal = (): number => {
    //     let total = 0;
    //     cart.forEach((item) => {
    //         total += item.quantity * item.price;
    //     });
    //     return total;
    // };
    // const updateQuantity = (itemId: number, newQuantity: number) => {
    //     if (newQuantity === 0) {
    //         removeItem(itemId);
    //         return;
    //     }
    //     const updatedCart = cart.map((item) =>
    //         item.id === itemId ? { ...item, quantity: newQuantity } : item
    //     );
    //     setCart(updatedCart);
    // };

    // Check if cart is empty
    //const isCartEmpty = cart.length === 0;

    if (cartItemsError) return <div>Failed to load</div>;
    if (cartItemsLoading) return <div>Loading...</div>;
    console.log(cartItems)
    return <></>
    // return isCartEmpty ? (
    //     <div className='w-full h-auto flex flex-col justify-center items-center gap-5 p-20 bg-primary-white rounded-3xl transition-all duration-300'>
    //         <div className='w-auto h-auto rounded-lg overflow-hidden'>
    //             <Image
    //                 src={"/cart.png"}
    //                 alt={"Cart"}
    //                 width={200}
    //                 height={200}
    //                 unoptimized
    //             />
    //         </div>
    //         <span className='font-bold'>
    //             There is no product in your cart now.
    //         </span>
    //         <Link
    //             href={"/menu"}
    //             locale={locale}
    //             className='p-3 w-auto h-auto rounded-lg font-extrabold text-lg border-orange-500 border-2 hover:bg-primary-400 bg-primary text-item-white transition-all duration-300 flex justify-center'
    //         >
    //             CONTINUE BUYING
    //         </Link>
    //     </div>
    // ) : (
    //     <div className='flex flex-col lg:flex-row justify-between gap-5 p-10'>
    //         <div className='flex flex-col justify-between gap-5 w-full'>
    //             <div className='w-full h-auto p-10 rounded-3xl bg-primary-white'>
    //                 <ConfigProvider
    //                     theme={{
    //                         token: {
    //                             colorPrimary: "#EA6A12",
    //                             colorText: "#EA6A12",
    //                             colorPrimaryBorder: "rgb(251, 146, 60)",
    //                             colorSplit: "rgb(255, 247, 237)",
    //                             fontWeightStrong: 600,
    //                         },
    //                     }}
    //                 >
    //                     <Steps className='' current={current} items={items} />
    //                 </ConfigProvider>
    //             </div>
    //             <div className='w-full h-auto p-10 rounded-3xl bg-primary-white overflow-x-auto'>
    //                 <table className='table-auto min-w-full'>
    //                     <thead>
    //                         <tr>
    //                             <th className='text-left p-2 font-extrabold text-lg'>
    //                                 DISH NAME
    //                             </th>
    //                             <th className='text-left p-2 font-extrabold text-lg'>
    //                                 QUANTITY
    //                             </th>
    //                             <th className='text-left p-2 font-extrabold text-lg'>
    //                                 PRICE
    //                             </th>
    //                             <th className='text-left p-2 font-extrabold text-lg'>
    //                                 TOTAL
    //                             </th>
    //                             <th className='text-left p-2 font-extrabold text-lg text-white'>
    //                                 A
    //                             </th>
    //                         </tr>
    //                     </thead>
    //                     <tbody>
    //                         {cart.map((item) => (
    //                             <tr key={item.id}>
    //                                 <td className='text-left p-2 font-medium text-xl '>
    //                                     {item.name}
    //                                 </td>
    //                                 <td className='text-left p-2 font-medium text-xl flex flex-row justify-between w-24'>
    //                                     <button
    //                                         className='w-auto h-auto text-primary'
    //                                         onClick={() =>
    //                                             updateQuantity(
    //                                                 item.id,
    //                                                 item.quantity - 1
    //                                             )
    //                                         }
    //                                     >
    //                                         <MinusCircleOutlined
    //                                             style={{
    //                                                 fontSize: "1.4rem",
    //                                             }}
    //                                         />
    //                                     </button>
    //                                     <span className='font-bold text-item-black'>
    //                                         {item.quantity}
    //                                     </span>
    //                                     <button
    //                                         className='w-auto h-auto text-primary'
    //                                         onClick={() =>
    //                                             updateQuantity(
    //                                                 item.id,
    //                                                 item.quantity + 1
    //                                             )
    //                                         }
    //                                     >
    //                                         <PlusCircleOutlined
    //                                             style={{
    //                                                 fontSize: "1.4rem",
    //                                             }}
    //                                         />
    //                                     </button>
    //                                 </td>
    //                                 <td className='text-left p-2 font-medium text-xl '>
    //                                     {moneyFormatter(item.price)}
    //                                 </td>
    //                                 <td className='text-left p-2 font-medium text-xl '>
    //                                     {moneyFormatter(
    //                                         item.quantity * item.price
    //                                     )}
    //                                 </td>
    //                                 <td className='text-left p-2 font-medium text-xl '>
    //                                     <button
    //                                         className='w-auto h-auto text-gray-400'
    //                                         onClick={() => removeItem(item.id)}
    //                                     >
    //                                         <CloseCircleFilled
    //                                             style={{
    //                                                 fontSize: "1.4rem",
    //                                             }}
    //                                         />
    //                                     </button>
    //                                 </td>
    //                             </tr>
    //                         ))}
    //                     </tbody>
    //                 </table>
    //             </div>
    //         </div>

    //         {/* CART STATE */}
    //         <div className='w-auto h-auto p-10 rounded-3xl bg-primary-white flex flex-col gap-5 justify-start items-center font-extrabold'>
    //             <div className='w-full flex flex-row justify-between gap-14 text-lg'>
    //                 <span className='w-auto whitespace-nowrap'>
    //                     Provisional Amount
    //                 </span>
    //                 <span className='w-auto whitespace-nowrap text-primary'>
    //                     {moneyFormatter(getTotal())}
    //                 </span>
    //             </div>
    //             <Link
    //                 href={"/menu"}
    //                 locale={locale}
    //                 className='p-2 w-full h-auto rounded-lg border-orange-500 border-2 hover:bg-primary hover:text-item-white transition-all duration-300 flex justify-center'
    //             >
    //                 Order more dish
    //             </Link>
    //             <Link
    //                 href={"/order"}
    //                 locale={locale}
    //                 className='p-2 w-full h-auto rounded-lg border-orange-500 border-2 bg-primary hover:bg-primary-400 text-item-white transition-all duration-300  flex justify-center'
    //             >
    //                 Continue
    //             </Link>
    //         </div>
    //     </div>
    // );
}
