"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import {
    Steps,
    ConfigProvider,
    Radio,
    Form,
    Input,
    Select,
    Row,
    Col,
} from "antd";

type FORM_ORDER = {
    isTakenAway: boolean;
    province: string;
    district: string;
    ward: string;
    orderNotes: string;
    paymentMethod: string;
    totalAmount: number;
};

export default function Order() {
    const locale = useLocale();
    const current: number = 1;
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

    // For voucher demo
    // const [modal, setModal] = useState<boolean>(false);
    // const openModal = () => {
    //     setModal(true);
    // };
    // const closeModal = () => {
    //     setModal(false);
    // };
    // const vouchers: {
    //     name: string;
    //     code: string;
    //     amount: number;
    //     description: string;
    //     category: string;
    // }[] = [
    //     {
    //         name: "Voucher 1",
    //         code: "VCH123",
    //         amount: 50000,
    //         description: "Discount on selected items",
    //         category: "pizza",
    //     },
    //     {
    //         name: "Voucher 2",
    //         code: "VCH456",
    //         amount: 20000,
    //         description: "Special discount for members",
    //         category: "pizza",
    //     },
    //     {
    //         name: "Voucher 3",
    //         code: "VCH789",
    //         amount: 30000,
    //         description: "Limited time offer",
    //         category: "drink",
    //     },
    //     {
    //         name: "Voucher 10",
    //         code: "VCHXYZ",
    //         amount: 25000,
    //         description: "Weekend sale",
    //         category: "drink",
    //     },
    //     {
    //         name: "Voucher 10",
    //         code: "VCHXaYZ",
    //         amount: 25000,
    //         description: "Weekend sale",
    //         category: "drink",
    //     },
    // ];

    // Form state
    const [formState, setFormState] = useState<FORM_ORDER>({
        isTakenAway: false,
        province: "",
        district: "",
        ward: "",
        orderNotes: "",
        paymentMethod: "",
        totalAmount: 0,
    });
    const [form] = Form.useForm();
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

    useEffect(() => {
        const fetchProvince = async () => {
            try {
                const response = await fetch(
                    "https://provinces.open-api.vn/api/p/"
                );
                const result = await response.json();
                const options = result.map(
                    (item: { name: any; code: any }) => ({
                        value: item.code,
                        label: item.name,
                    })
                );
                setProvinceList(options);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        const fetchDistrict = async () => {
            try {
                const response = await fetch(
                    `https://provinces.open-api.vn/api/p/${currentProvince}?depth=2`
                );
                const result = await response.json();
                const options = result.districts.map(
                    (item: { name: any; code: any }) => ({
                        value: item.code,
                        label: item.name,
                    })
                );
                setDistrictList(options);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        const fetchWard = async () => {
            try {
                const response = await fetch(
                    `https://provinces.open-api.vn/api/d/${currentDistrict}?depth=2`
                );
                const result = await response.json();
                const options = result.wards.map(
                    (item: { name: any; code: any }) => ({
                        value: item.code,
                        label: item.name,
                    })
                );
                setWardList(options);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchProvince();
        fetchDistrict();
        fetchWard();
    }, [currentProvince, currentDistrict]);
    return (
        <div className='flex flex-col lg:flex-row justify-between gap-5 p-10'>
            <div className='flex flex-col justify-between gap-5 w-full'>
                <div className='w-full h-auto p-10 rounded-3xl bg-primary-white'>
                    <ConfigProvider
                        theme={{
                            token: {
                                colorPrimary: "#EA6A12",
                                colorText: "#EA6A12",
                                colorPrimaryBorder: "rgb(251, 146, 60)",
                                colorSplit: "rgb(255, 247, 237)",
                                fontWeightStrong: 600,
                            },
                        }}
                    >
                        <Steps className='' current={current} items={items} />
                    </ConfigProvider>
                </div>
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
                                        <span className='whitespace-nowrap font-bold text-lg'>
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
                                <Form.Item
                                    name='address'
                                    label={
                                        <span className='whitespace-nowrap font-bold text-md'>
                                            Address
                                        </span>
                                    }
                                >
                                    <Row gutter={8}>
                                        <Col
                                            xs={{ span: 24 }}
                                            sm={{ span: 8 }}
                                            style={{ marginTop: 8 }}
                                        >
                                            <Select
                                                showSearch
                                                placeholder='Province'
                                                style={{ width: "100%" }}
                                                options={provinceList}
                                                optionFilterProp='children'
                                                onChange={onProvinceChange}
                                                filterOption={filterOption}
                                            ></Select>
                                        </Col>
                                        <Col
                                            xs={{ span: 24 }}
                                            sm={{ span: 8 }}
                                            style={{ marginTop: 8 }}
                                        >
                                            <Select
                                                showSearch
                                                placeholder='District'
                                                style={{ width: "100%" }}
                                                options={districtList}
                                                optionFilterProp='children'
                                                onChange={onDistrictChange}
                                                filterOption={filterOption}
                                            ></Select>
                                        </Col>
                                        <Col
                                            xs={{ span: 24 }}
                                            sm={{ span: 8 }}
                                            style={{ marginTop: 8 }}
                                        >
                                            <Select
                                                placeholder='Ward'
                                                style={{ width: "100%" }}
                                                options={wardList}
                                                optionFilterProp='children'
                                                onChange={onWardChange}
                                                filterOption={filterOption}
                                            ></Select>
                                        </Col>
                                    </Row>

                                    <Input
                                        placeholder='Detail Address'
                                        style={{ marginTop: 8 }}
                                    />
                                </Form.Item>
                            ) : (
                                <div className='pb-6 font-normal text-lg'>
                                    Ground Floor, TOPS Au Co Shopping Center,
                                    No. 685 Au Co, Tan Thanh Ward, Tan Phu
                                    District, Ho Chi Minh City
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
                                                <span> CASH </span>
                                            </div>
                                        </Radio>
                                    </div>
                                </Radio.Group>
                            </Form.Item>
                        </Form>
                    </ConfigProvider>
                </div>
            </div>

            {/* CART STATE */}
            <div className='w-auto h-auto p-10 rounded-3xl bg-primary-white flex flex-col gap-5 justify-start items-center font-extrabold'>
                <div className='w-full flex flex-row justify-between gap-10'>
                    <span className='w-auto whitespace-nowrap'>
                        Discount Code
                    </span>
                    <span className='relative w-auto whitespace-nowrap '>
                        <span className='w-full cursor-pointer text-primary'>
                            Choose Code
                        </span>
                        {/* {modal && (
                            <VoucherPicker
                                params={{
                                    vouchers: vouchers,
                                    closeModal: closeModal,
                                }}
                            />
                        )} */}
                    </span>
                </div>
                <span className='font-normal'>
                    You haven't added any discount codes.
                </span>
                <div className='w-full flex flex-col justify-between gap-2 font-normal'>
                    <div className='w-full flex flex-row justify-between gap-10'>
                        <span className='w-auto whitespace-nowrap'>
                            Pre-discount ammount
                        </span>
                        <span className='relative w-auto whitespace-nowrap '>
                            <span className='w-full cursor-pointe'>
                                120000Đ
                            </span>
                        </span>
                    </div>
                    <div className='w-full flex flex-row justify-between gap-10'>
                        <span className='w-auto whitespace-nowrap'>
                            Discount ammount
                        </span>
                        <span className='relative w-auto whitespace-nowrap '>
                            <span className='w-full cursor-pointer'>
                                120000Đ
                            </span>
                        </span>
                    </div>
                    <div className='w-full flex flex-row justify-between gap-10'>
                        <span className='w-auto whitespace-nowrap'>
                            Shipping cost
                        </span>
                        <span className='relative w-auto whitespace-nowrap '>
                            <span className='w-full cursor-pointer'>
                                120000Đ
                            </span>
                        </span>
                    </div>
                </div>
                <div className='w-full flex flex-row justify-between gap-10'>
                    <span className='w-auto whitespace-nowrap'>
                        Total ammount
                    </span>
                    <span className='relative w-auto whitespace-nowrap '>
                        <span className='w-full cursor-pointer text-primary'>
                            120000Đ
                        </span>
                    </span>
                </div>
                <Link
                    className='p-2 w-full h-auto rounded-lg border-orange-500 border-2 bg-primary hover:bg-primary-400 text-item-white transition-all duration-300  flex justify-center'
                    href={"/payment"}
                    locale={locale}
                >
                    Pay & Order
                </Link>
                <Link
                    className='p-2 w-full h-auto rounded-lg border-orange-500 border-2 hover:bg-primary hover:text-item-white transition-all duration-300 flex justify-center'
                    href={"/cart"}
                    locale={locale}
                >
                    Back to cart
                </Link>
            </div>
        </div>
    );
}
