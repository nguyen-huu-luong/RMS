"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import OrderForm from "@/components/order/orderForm";
import SideBar from "@/components/order/sidebar";
import Progress from "@/components/order/progressBar";
import { Form } from "antd";
import { useSession } from "next-auth/react";
import { useCreateOrder } from "@/app/api/product/order";
import useSWR from "swr";
import { cartFetcher } from "@/app/api/product/cart";
import { useRouter } from "next-intl/client";
import Map from "@/components/map/map";

export default function Order() {
    const locale = useLocale();
    const [form] = Form.useForm();
    const router = useRouter();
    const { data: session, status } = useSession();
    const [amount, setAmount] = useState<number>(0);
    const [voucher, setVoucher] = useState<number>(0);
    const [fee, setFee] = useState<any>(0);
    const {
        data: cartItems,
        error: cartItemsError,
        isLoading: cartItemsLoading,
    } = useSWR(
        session
            ? [`http://localhost:3003/api/carts`, session.user.accessToken]
            : null,
        ([url, token]) => cartFetcher(url, token)
    );
    if (status === "loading") return <div>Loading.....</div>;
    if (status === "unauthenticated") router.push("/signin");
    const handlePayOrder = async () => {
        try {
            await form.validateFields();
            const formValues = form.getFieldsValue();
            const payMethod = formValues.paymentMethod;
            const dataBody = {
                status: "New order",
                descriptions: formValues.orderNotes
                    ? formValues.orderNotes
                    : "",
                shippingAddress:
                    formValues.deliveryType === "DELIVER"
                        ? formValues.address
                        : "",
                shippingCost:
                    formValues.deliveryType === "DELIVER"
                        ? fee
                        : 0,
                paymentMethod: formValues.paymentMethod,
                discountAmount: amount,
                voucherId: voucher,
            };
            const data = await useCreateOrder(
                session?.user.accessToken,
                dataBody,
                formValues.paymentMethod
            );

            if (payMethod == "CASH") {
                router.push("/payment?method=CASH");
            } else {
                localStorage.setItem("orderInfo", "1");
                router.push(data["payUrl"]);
            }
        } catch (err) {
            console.log("Validation failed:", err);
        }
    };
    if (cartItemsError) return <div>Failed to load</div>;
    if (cartItemsLoading) return <div>Loading...</div>;
    // Form state
    return (
        <div className='flex flex-col lg:flex-row justify-between gap-5 p-10'>
            <div className='flex flex-col justify-between gap-5 w-full'>
                <Progress current={1} />
                <OrderForm form={form} setFee={setFee} />
            </div>
            {/* CART STATE */}
            <SideBar
                onPayOrder={handlePayOrder}
                currentCart={cartItems}
                setAmount={setAmount}
                setVoucherId={setVoucher}
                fee={fee}
            />
        </div>
    );
}
