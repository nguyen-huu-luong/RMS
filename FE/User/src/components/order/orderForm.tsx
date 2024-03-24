"use client";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { ConfigProvider, Radio, Form, Input, Select, Row, Col } from "antd";
import Map from "@/components/map/map";

import { useState, useEffect, useRef, Dispatch } from "react";
import { useTranslations } from "next-intl";
const OrderForm = ({ form, setFee }: { form: any; setFee: any }) => {
    const t = useTranslations("Order");
    const { data: session, status } = useSession();
    if (status === "unauthenticated") {
        redirect("/en/signin");
    }

    const setAddress = () => {
        const formValues = form.getFieldsValue();
        form.setFieldsValue({
            address:
                formValues.deliveryType === "DELIVER" ? formValues.address : "",
        });
    };
    const [delivery, setDelivery] = useState("DELIVER");
    const handleDelivery = (e: any) => {
        setDelivery(e.target.value);
        if (e.target.value === "TAKE_AWAY") setFee(0);
    };

    return (
        <div className='w-full h-auto p-10 rounded-3xl bg-primary-white'>
            <ConfigProvider
                theme={{
                    components: {
                        Form: {
                            itemMarginBottom: 12,
                        },
                    },
                    token: {
                        colorPrimary: "#EA6A12",
                    },
                }}
            >
                <Form
                    form={form}
                    layout='vertical'
                    onChange={setAddress}
                    initialValues={{
                        deliveryType: "DELIVER",
                    }}
                >
                    <Form.Item
                        name='deliveryType'
                        label={
                            <span className='whitespace-nowrap font-bold text-lg'>
                                {t("Ship")}
                            </span>
                        }
                    >
                        <Radio.Group onChange={handleDelivery}>
                            <Radio value='DELIVER'>
                                <span className='whitespace-nowrap font-bold text-md'>
                                    {t("Deliver")}
                                </span>
                            </Radio>
                            <Radio value='TAKE_AWAY'>
                                <span className='whitespace-nowrap font-bold text-md'>
                                    {t("Receive")}
                                </span>
                            </Radio>
                        </Radio.Group>
                    </Form.Item>

                    {delivery === "DELIVER" ? (
                        <>
                            <div className='mb-4'>
                                <Form.Item
                                    name='address'
                                    rules={[
                                        {
                                            required: true,
                                            message: t("Address_warn"),
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder={t("Address_plh")}
                                        style={{ marginTop: 8 }}
                                    />
                                </Form.Item>
                                <Form.Item hidden name='shippingCost'>
                                    <Input />
                                </Form.Item>
                            </div>
                            <div className='w-full h-auto rounded-xl overflow-hidden z-0'>
                                <Map form={form} setFee={setFee}></Map>
                            </div>
                        </>
                    ) : (
                        // </Form.Item>
                        <div className='pb-6 font-normal text-lg'>
                            {t("Address")}
                        </div>
                    )}
                    <Form.Item
                        name='orderNotes'
                        label={
                            <span className='whitespace-nowrap font-bold text-lg'>
                                {t("Note")}
                            </span>
                        }
                    >
                        <Input.TextArea rows={2} />
                    </Form.Item>

                    <Form.Item
                        name='paymentMethod'
                        label={
                            <span className='whitespace-nowrap font-bold text-lg'>
                                {t("Method")}
                            </span>
                        }
                        rules={[
                            {
                                required: true,
                                message: t('Method_warn'),
                            },
                        ]}
                    >
                        <Radio.Group>
                            <div className='flex flex-col sm:flex-row items-center'>
                                <Radio value='CASH'>
                                    <div className='flex flex-row gap-2 items-center'>
                                        <Image
                                            src='/cash.png'
                                            alt='Cash'
                                            width={30}
                                            height={30}
                                            unoptimized
                                        />
                                        <span> {t("Cash")}</span>
                                    </div>
                                </Radio>
                                <Radio value='MOMO'>
                                    <div className='flex flex-row gap-2 items-center w-auto'>
                                        <Image
                                            src='/momo.png'
                                            alt='Momo'
                                            width={30}
                                            height={30}
                                            unoptimized
                                        />
                                        <span> {t("Momo")}</span>
                                    </div>
                                </Radio>
                            </div>
                        </Radio.Group>
                    </Form.Item>
                </Form>
            </ConfigProvider>
        </div>
    );
};

export default OrderForm;
