"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import OrderForm from "@/components/order/orderForm";
import SideBar from "@/components/order/sidebar";
import Progress from "@/components/order/progressBar";
import { Form} from "antd";
import { useSession } from "next-auth/react";
import { createOrder } from "@/app/api/product/order";
import useSWR from "swr";
import { cartFetcher } from "@/app/api/product/cart";
import { useRouter } from "next-intl/client";
export default function Order() {
    const locale = useLocale();
    const [form] = Form.useForm();
    const router = useRouter();
    const { data: session, status } = useSession()
    const [amount, setAmount] = useState<number>(0);
    const [voucher, setVoucher] = useState<number>(0);
    const {
        data: cartItems,
        error: cartItemsError,
        isLoading: cartItemsLoading
    } = useSWR(session ? [`http://localhost:3003/api/carts`, session.user.accessToken] : null,  ([url, token]) => cartFetcher(url, token));
    if (status === "loading") return <div>Loading.....</div>
    if (status === "unauthenticated") router.push('/signin');
    const handlePayOrder = async () => {
        try {
            await form.validateFields();
            const formValues = form.getFieldsValue();
            await createOrder(session?.user.accessToken, {
                status: "New order",
                descriptions: formValues.orderNote?formValues.orderNote:"",
                shippingAddress:
                    formValues.deliveryType === "DELIVER"
                        ? formValues.address
                        : "",
                paymentMethod: formValues.paymentMethod,
                discountAmount: amount,
                voucherId: voucher
            })
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
                <OrderForm form={form} />
            </div>
            {/* CART STATE */}
            <SideBar onPayOrder={handlePayOrder} currentCart={cartItems} setAmount={setAmount} setVoucherId={setVoucher}/>
        </div>
    );
}
