"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import OrderForm from "@/components/order/orderForm";
import SideBar from "@/components/order/sidebar";
import Progress from "@/components/order/progressBar";
import { Form} from "antd";
import { useSession } from "next-auth/react";
import { createOrder } from "@/app/api/product/order";
export default function Order() {
    const locale = useLocale();
    const [form] = Form.useForm();
    const { data: session, status } = useSession()
    if (status === "loading") return <>Loading.....</>
    if (status === "unauthenticated") return <>Unauthenticated.....</>
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
                discountAmount: 0,
            })
        } catch (err) {
            console.log("Validation failed:", err);
        }
    };
    // Form state
    return (
        <div className='flex flex-col lg:flex-row justify-between gap-5 p-10'>
            <div className='flex flex-col justify-between gap-5 w-full'>
                <Progress current={1} />
                <OrderForm form={form} />
            </div>
            {/* CART STATE */}
            <SideBar onPayOrder={handlePayOrder} />
        </div>
    );
}
