"use client";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { ConfigProvider, Radio, Form, Input, Select, Row, Col } from "antd";
import Map from "@/components/map/map";

import { useState, useEffect, useRef, Dispatch } from "react";
const OrderForm = ({ form, setFee }: { form: any; setFee: any }) => {
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
    };

    // Get location
    const [currentProvince, setCurrentProvince] = useState("1");
    const [provinceList, setProvinceList] = useState([
        {
            value: "",
            label: "",
        },
    ]);
    const onProvinceChange = (value: string) => {
        setCurrentProvince(value);
    };
    const [currentDistrict, setCurrentDistrict] = useState("1");
    const [districtList, setDistrictList] = useState([
        {
            value: "",
            label: "",
        },
    ]);
    const onDistrictChange = (value: string) => {
        setCurrentDistrict(value);
    };
    const [currentWard, setCurrentWard] = useState("1");
    const [wardList, setWardList] = useState([
        {
            value: "",
            label: "",
        },
    ]);
    const onWardChange = (value: string) => {
        setCurrentWard(value);
    };
    const filterOption = (
        input: string,
        option?: { label: string; value: string }
    ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
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
                                SHIPPING ADDRESS
                            </span>
                        }
                    >
                        <Radio.Group onChange={handleDelivery}>
                            <Radio value='DELIVER'>
                                <span className='whitespace-nowrap font-bold text-md'>
                                    Deliver to address
                                </span>
                            </Radio>
                            <Radio value='TAKE_AWAY'>
                                <span className='whitespace-nowrap font-bold text-md'>
                                    Receive at restaurant
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
                                            message:
                                                "Please input your address!",
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder='Detail Address'
                                        style={{ marginTop: 8 }}
                                    />
                                </Form.Item>
                                <Form.Item hidden name='shippingCost'>
                                    <Input />
                                </Form.Item>
                            </div>
                            <div className='w-full h-auto rounded-xl overflow-hidden'>
                                <Map form={form} setFee={setFee}></Map>
                            </div>
                        </>
                    ) : (
                        // </Form.Item>
                        <div className='pb-6 font-normal text-lg'>
                            Ground Floor, TOPS Au Co Shopping Center, No. 685 Au
                            Co, Tan Thanh Ward, Tan Phu District, Ho Chi Minh
                            City
                        </div>
                    )}
                    <Form.Item
                        name='orderNotes'
                        label={
                            <span className='whitespace-nowrap font-bold text-lg'>
                                ORDER NOTE
                            </span>
                        }
                    >
                        <Input.TextArea rows={2} />
                    </Form.Item>

                    <Form.Item
                        name='paymentMethod'
                        label={
                            <span className='whitespace-nowrap font-bold text-lg'>
                                PAYMENT METHOD
                            </span>
                        }
                        rules={[
                            {
                                required: true,
                                message: "Please choose your payment method!",
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
                                        <span> CASH </span>
                                    </div>
                                </Radio>
                                <Radio value='MOMO'>
                                    <div className='flex flex-row gap-2 items-center'>
                                        <Image
                                            src='/momo.png'
                                            alt='Momo'
                                            width={30}
                                            height={30}
                                            unoptimized
                                        />
                                        <span> MOMO </span>
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
