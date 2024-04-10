"use client";

import { useLocale } from "next-intl";
import { useState, useEffect } from "react";
import OrderForm from "@/components/order/orderForm";
import SideBar from "@/components/order/sidebar";
import Progress from "@/components/order/progressBar";
import { Form } from "antd";
import { useSession } from "next-auth/react";
import { useCreateOrder } from "@/app/api/product/order";
import { useRouter } from "next-intl/client";
import Loading from "@/components/loading";
import fetchClient from "@/lib/fetch-client";

export default function Order() {
    const locale = useLocale();
    const [form] = Form.useForm();
    const router = useRouter();
    const { data: session, status } = useSession();
    const [amount, setAmount] = useState<number>(0);
    const [voucher, setVoucher] = useState<number>(0);
    const [fee, setFee] = useState<any>(0);
    useEffect(() => {
        if (status === "loading") return;
        if (status === "unauthenticated") {
            router.push("/signin");
        }
    }, [status, router]);
    if (status === "loading") return <Loading />;
    if (status === "unauthenticated") router.push("/signin");
    const handlePayOrder = async () => {
        try {
            await form.validateFields();
            const formValues = form.getFieldsValue();
            const payMethod = formValues.paymentMethod;
            const dataBody = {
                status: "Pending",
                descriptions: formValues.orderNotes
                    ? formValues.orderNotes
                    : "",
                shippingAddress:
                    formValues.deliveryType === "DELIVER"
                        ? formValues.address
                        : "",
                shippingCost: formValues.deliveryType === "DELIVER" ? fee : 0,
                paymentMethod: formValues.paymentMethod,
                discountAmount: amount,
                voucherId: voucher,
            };
            const data = await fetchClient({
                url: `/orders?method=${formValues.paymentMethod}`,
                method: "POST",
                body: dataBody,
            });

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
                setAmount={setAmount}
                setVoucherId={setVoucher}
                fee={fee}
                token={session?.user.accessToken}
            />
        </div>
    );
}
