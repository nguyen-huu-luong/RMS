"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
    Button,
    Upload,
    DatePicker,
    Form,
    Input,
    Radio,
    message,
    Select,
    type FormProps,
} from "antd";
import { useSession } from "next-auth/react";
import { useRouter } from "next-intl/client";
import Loading from "@/components/loading";
import useSWR from "swr";
import moment from "moment";
import fetchClient from "@/lib/fetch-client";
import { useParams } from "next/navigation";
import { AssignVoucherForm } from "@/components/Voucher/AssignVoucher";
type FieldType = {
    firstname?: string;
    lastname?: string;
    email?: string;
    phone?: string;
    birthday: string;
    gender: boolean;
};
const Voucher = () => {
    const [edit, setEdit] = useState<boolean>(true);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState<boolean>(false);
    const params = useParams<{ locale: string; vid: string }>();
    const {
        data: voucher,
        error: voucherError,
        isLoading: voucherLoading,
        mutate,
    } = useSWR(`/vouchers/${params.vid}`, (url) =>
        fetchClient({ url: url, data_return: true })
    );
    const updateInformation = async (data: any) => {
        await fetchClient({
            url: `/vouchers/${params.vid}`,
            method: "PUT",
            body: data,
        });
        setTimeout(async () => {
            await mutate();
            form.resetFields();
        }, 2000);
    };

    const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
        await updateInformation(values);
        setLoading(false);
        setEdit(true);
    };

    const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
        errorInfo
    ) => {
        setLoading(false);
        console.log("Failed:", errorInfo);
    };
    if (voucherError) return <div>Failed to load</div>;
    if (voucherLoading) return <Loading />;
    if (!voucher) return <Loading />;
    return (
        <>
            <div className='flex flex-col justify-start gap-2 w-full h-auto'>
                <div className='w-full flex flex-row justify-end rounded-xl shadow-sm px-5 py-2 bg-white'>
                    {!edit ? (
                        <>
                            <Button
                                onClick={() => {
                                    setLoading(true);
                                    form.submit();
                                }}
                                loading={loading}
                            >
                                Save
                            </Button>
                            <Button
                                onClick={() => {
                                    setEdit(true);
                                    form.resetFields();
                                }}
                            >
                                Cancel
                            </Button>
                        </>
                    ) : (
                        <Button
                            onClick={() => {
                                setEdit(false);
                            }}
                        >
                            Edit information
                        </Button>
                    )}
                </div>
                <div className='bg-primary-white w-full bg-white h-auto font-bold text-normal rounded-xl shadow-sm pt-5 px-5 flex flex-col gap-2 items-center'>
                    <Form
                        form={form}
                        name='voucher infor'
                        autoComplete='off'
                        style={{ width: "100%" }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        disabled={edit}
                    >
                        <div className='flex justify-between gap-6 w-full'>
                            <div className='w-full'>
                                <Form.Item
                                    label='Name'
                                    name='name'
                                    initialValue={voucher.name}
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please input the name!",
                                        },
                                    ]}
                                >
                                    <Input placeholder='Name' />
                                </Form.Item>
                            </div>

                            <div className='w-full'>
                                <Form.Item
                                    label='Description'
                                    name='description'
                                    initialValue={voucher.description}
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please input the description!",
                                        },
                                    ]}
                                >
                                    <Input placeholder='Description' />
                                </Form.Item>
                            </div>
                            <div className='w-full'>
                                <Form.Item
                                    label='Can Redeem'
                                    name='can_redeem'
                                    initialValue={voucher.can_redeem}
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please select whether it can be redeemed or not!",
                                        },
                                    ]}
                                >
                                    <Select placeholder='Select can redeem'>
                                        <Select.Option value={true}>
                                            Yes
                                        </Select.Option>
                                        <Select.Option value={false}>
                                            No
                                        </Select.Option>
                                    </Select>
                                </Form.Item>
                            </div>
                        </div>
                        <div className='flex justify-between gap-6 w-full'>
                            <div className='w-full'>
                                <Form.Item
                                    label='Type'
                                    name='type'
                                    initialValue={voucher.type}
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please select the type!",
                                        },
                                    ]}
                                >
                                    <Select placeholder='Select type'>
                                        <Select.Option value='fixed'>
                                            Fixed
                                        </Select.Option>
                                        <Select.Option value='percentage'>
                                            Percentage
                                        </Select.Option>
                                    </Select>
                                </Form.Item>
                            </div>
                            <div className='w-full'>
                                <Form.Item
                                    label='Amount'
                                    name='amount'
                                    initialValue={voucher.amount}
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please input the amount!",
                                        },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                const typeValue =
                                                    getFieldValue("type");
                                                if (
                                                    typeValue ===
                                                        "percentage" &&
                                                    value > 100
                                                ) {
                                                    return Promise.reject(
                                                        "Percentage amount cannot exceed 100!"
                                                    );
                                                }
                                                return Promise.resolve();
                                            },
                                        }),
                                    ]}
                                >
                                    <Input type='number' placeholder='Amount' />
                                </Form.Item>
                            </div>

                            <div className='w-full'>
                                <Form.Item
                                    label='Maximum Reduce'
                                    name='maximum_reduce'
                                    initialValue={voucher.maximum_reduce}
                                    rules={[
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                const type =
                                                    getFieldValue("type");
                                                if (type === "fixed") {
                                                    return Promise.resolve();
                                                } else if (value <= 0) {
                                                    return Promise.reject(
                                                        "Please input a positive number!"
                                                    );
                                                }
                                                if (value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(
                                                    "Please input the maximum reduce!"
                                                );
                                            },
                                        }),
                                    ]}
                                >
                                    <Input
                                        type='number'
                                        placeholder='Maximum Reduce'
                                    />
                                </Form.Item>
                            </div>
                        </div>

                        <div className='flex justify-between gap-6 w-full'>
                            <div className='w-full'>
                                <Form.Item
                                    label='Quantity'
                                    name='quantity'
                                    initialValue={voucher.quantity}
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please input the quantity!",
                                        },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (value > 0) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(
                                                    "Please input a positive number!"
                                                );
                                            },
                                        }),
                                    ]}
                                >
                                    <Input
                                        type='number'
                                        placeholder='Quantity'
                                    />
                                </Form.Item>
                            </div>
                            <div className='w-full'>
                                <Form.Item
                                    label='Redeemed Number'
                                    name='redeemedNumber'
                                    initialValue={voucher.redeemedNumber}
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please input the quantity!",
                                        },
                                    ]}
                                >
                                    <Input
                                        disabled
                                        type='number'
                                        placeholder='Quantity'
                                    />
                                </Form.Item>
                            </div>
                            <div className='w-full'>
                                <Form.Item
                                    label='Minimum Paid'
                                    name='minimum_paid'
                                    initialValue={voucher.minimum_paid}
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please input the minimum paid!",
                                        },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (value > 0) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(
                                                    "Please input a positive number!"
                                                );
                                            },
                                        }),
                                    ]}
                                >
                                    <Input
                                        type='number'
                                        placeholder='Minimum Paid'
                                    />
                                </Form.Item>
                            </div>
                        </div>

                        <div className='flex space-x-2'>
                            <div className='w-full'>
                                <Form.Item
                                    label='Begin Date'
                                    name='begin_date'
                                    initialValue={moment(voucher.begin_date)}
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please select the begin date!",
                                        },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                const endValue =
                                                    getFieldValue("end_date");
                                                if (
                                                    !value ||
                                                    !endValue ||
                                                    value.isBefore(endValue)
                                                ) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(
                                                    "Begin date must be before end date!"
                                                );
                                            },
                                        }),
                                    ]}
                                >
                                    <DatePicker />
                                </Form.Item>
                            </div>
                            <div className='w-full'>
                                <Form.Item
                                    label='End Date'
                                    name='end_date'
                                    initialValue={moment(voucher.end_date)}
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please select the end date!",
                                        },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                const beginValue =
                                                    getFieldValue("begin_date");
                                                if (
                                                    !value ||
                                                    !beginValue ||
                                                    value.isAfter(beginValue)
                                                ) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(
                                                    "End date must be after begin date!"
                                                );
                                            },
                                        }),
                                    ]}
                                >
                                    <DatePicker />
                                </Form.Item>
                            </div>
                        </div>
                    </Form>
                </div>
                <div className='w-full h-auto rounded-xl shadow-sm bg-white p-5'>
                    <AssignVoucherForm
                        form={form}
                        updateInformation={updateInformation}
                        voucherId={parseInt(params.vid, 10)}
                    />
                </div>
            </div>
        </>
    );
};

export default Voucher;
