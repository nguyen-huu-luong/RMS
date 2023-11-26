"use client";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { ConfigProvider, Radio, Form, Input, Select, Row, Col } from "antd";
import axios from "axios";

// const apiKey = '';
// const origin = '123 Main St, City1, Country1'; // Địa chỉ xuất phát
// const destination = '456 Market St, City2, Country2'; // Địa chỉ đích
// const googleMapsApiUrl = 'https://maps.googleapis.com/maps/api/distancematrix/json';
// const getDistance = async () => {
//   try {
//     const response = await axios.get(googleMapsApiUrl, {
//       params: {
//         origins: origin,
//         destinations: destination,
//         key: apiKey,
//       },
//     });
//     const distance = response.data.rows[0].elements[0].distance.text;
//     console.log('Distance:', distance);
//   } catch (error) {
//     console.error('Error fetching distance:', error);
//   }
// };

import { useState, useEffect, useRef, Dispatch } from "react";
const OrderForm = ({ form }: { form: any }) => {
    const { data: session, status } = useSession();
    if (status === "unauthenticated") {
        redirect("/en/signin");
    }

    const setAddress = () => {
        const formValues = form.getFieldsValue();
        form.setFieldsValue({
            address:
                formValues.deliveryType === "DELIVER"
                    ? formValues.address +
                      ", " +
                      wardList.find(
                          (ward: any) => ward.value === formValues.ward
                      )?.label +
                      ", " +
                      districtList.find(
                          (district: any) =>
                              district.value === formValues.district
                      )?.label +
                      ", " +
                      provinceList.find(
                          (province: any) =>
                              province.value === formValues.province
                      )?.label
                    : "",
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

    //Fetching address
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
                        <div className='mb-4'>
                            <Row gutter={8}>
                                <Col
                                    xs={{ span: 24 }}
                                    sm={{ span: 8 }}
                                    style={{ marginTop: 8 }}
                                >
                                    <Form.Item
                                        name='province'
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please input your province!",
                                            },
                                        ]}
                                    >
                                        <Select
                                            showSearch
                                            placeholder='Province'
                                            style={{ width: "100%" }}
                                            options={provinceList}
                                            optionFilterProp='children'
                                            onChange={(e: any) => {
                                                onProvinceChange(e);
                                                form.setFieldsValue({
                                                    district: undefined,
                                                    ward: undefined,
                                                });
                                            }}
                                            filterOption={filterOption}
                                        ></Select>
                                    </Form.Item>
                                </Col>
                                <Col
                                    xs={{ span: 24 }}
                                    sm={{ span: 8 }}
                                    style={{ marginTop: 8 }}
                                >
                                    <Form.Item
                                        name='district'
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please input your district!",
                                            },
                                        ]}
                                    >
                                        <Select
                                            showSearch
                                            placeholder='District'
                                            style={{ width: "100%" }}
                                            options={districtList}
                                            optionFilterProp='children'
                                            onChange={(e: any) => {
                                                onDistrictChange(e);
                                                form.setFieldsValue({
                                                    ward: undefined,
                                                });
                                            }}
                                            filterOption={filterOption}
                                        ></Select>
                                    </Form.Item>
                                </Col>
                                <Col
                                    xs={{ span: 24 }}
                                    sm={{ span: 8 }}
                                    style={{ marginTop: 8 }}
                                >
                                    <Form.Item
                                        name='ward'
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please input your ward!",
                                            },
                                        ]}
                                    >
                                        <Select
                                            placeholder='Ward'
                                            style={{ width: "100%" }}
                                            options={wardList}
                                            optionFilterProp='children'
                                            onChange={onWardChange}
                                            filterOption={filterOption}
                                        ></Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item
                                name='address'
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input your province!",
                                    },
                                ]}
                            >
                                <Input
                                    placeholder='Detail Address'
                                    style={{ marginTop: 8 }}
                                />
                            </Form.Item>
                        </div>
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
