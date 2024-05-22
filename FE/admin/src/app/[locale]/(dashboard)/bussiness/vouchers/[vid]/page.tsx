"use client";
import React, { useEffect, useState } from "react";
import { Button, DatePicker, Form, Input, Select, type FormProps } from "antd";
import Loading from "@/components/loading";
import useSWR from "swr";
import moment from "moment";
import fetchClient from "@/lib/fetch-client";
import { useParams } from "next/navigation";
import { AssignVoucherForm } from "@/components/Voucher/AssignVoucher";
import { useTranslations } from "next-intl";
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
    const t = useTranslations("Voucher");
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
    if (voucherError) return <Loading />;
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
                                {t("save")}
                            </Button>
                            <Button
                                onClick={() => {
                                    setEdit(true);
                                    form.resetFields();
                                }}
                            >
                                {t("cancel")}
                            </Button>
                        </>
                    ) : (
                        <Button
                            onClick={() => {
                                setEdit(false);
                            }}
                        >
                            {t("edit")}
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
                                    label={t("name")}
                                    name='name'
                                    initialValue={voucher.name}
                                    rules={[
                                        {
                                            required: true,
                                            message: t("name-required"),
                                        },
                                    ]}
                                >
                                    <Input placeholder={t("name")} />
                                </Form.Item>
                            </div>

                            <div className='w-full'>
                                <Form.Item
                                    label={t("description")}
                                    name='description'
                                    initialValue={voucher.description}
                                    rules={[
                                        {
                                            required: true,
                                            message: t("description-required"),
                                        },
                                    ]}
                                >
                                    <Input placeholder={t("description")} />
                                </Form.Item>
                            </div>
                            <div className='w-full'>
                                <Form.Item
                                    label={t("can-redeem")}
                                    name='can_redeem'
                                    initialValue={voucher.can_redeem}
                                    rules={[
                                        {
                                            required: true,
                                            message: t("can-redeem-required"),
                                        },
                                    ]}
                                >
                                    <Select placeholder={t("can-redeem")}>
                                        <Select.Option value={true}>
                                            {t("yes")}
                                        </Select.Option>
                                        <Select.Option value={false}>
                                            {t("no")}
                                        </Select.Option>
                                    </Select>
                                </Form.Item>
                            </div>
                        </div>
                        <div className='flex justify-between gap-6 w-full'>
                            <div className='w-full'>
                                <Form.Item
                                    label={t("type")}
                                    name='type'
                                    initialValue={voucher.type}
                                    rules={[
                                        {
                                            required: true,
                                            message: t("type-required"),
                                        },
                                    ]}
                                >
                                    <Select placeholder={t("type")}>
                                        <Select.Option value='fixed'>
                                            {t("fixed")}
                                        </Select.Option>
                                        <Select.Option value='percentage'>
                                            {t("percentage")}
                                        </Select.Option>
                                    </Select>
                                </Form.Item>
                            </div>
                            <div className='w-full'>
                                <Form.Item
                                    label={t("amount")}
                                    name='amount'
                                    initialValue={voucher.amount}
                                    rules={[
                                        {
                                            required: true,
                                            message: t("amount-required"),
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
                                                        t("over-100")
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
                                    label={t("maximum-reduction")}
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
                                                        t("positve")
                                                    );
                                                }
                                                if (value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(
                                                    t(
                                                        "maximum-reduction-required"
                                                    )
                                                );
                                            },
                                        }),
                                    ]}
                                >
                                    <Input
                                        type='number'
                                        placeholder={t("maximum-reduction")}
                                    />
                                </Form.Item>
                            </div>
                        </div>

                        <div className='flex justify-between gap-6 w-full'>
                            <div className='w-full'>
                                <Form.Item
                                    label={t("quantity")}
                                    name='quantity'
                                    initialValue={voucher.quantity}
                                    rules={[
                                        {
                                            required: true,
                                            message: t("quantity-required"),
                                        },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (value > 0) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(
                                                    t("positve")
                                                );
                                            },
                                        }),
                                    ]}
                                >
                                    <Input
                                        type='number'
                                        placeholder={t("quantity")}
                                    />
                                </Form.Item>
                            </div>
                            <div className='w-full'>
                                <Form.Item
                                    label={t("redeem")}
                                    name='redeemedNumber'
                                    initialValue={voucher.redeemedNumber}
                                >
                                    <Input
                                        disabled
                                        type='number'
                                        placeholder={t("redeem")}
                                    />
                                </Form.Item>
                            </div>
                            <div className='w-full'>
                                <Form.Item
                                    label={t("minimum-paid")}
                                    name='minimum_paid'
                                    initialValue={voucher.minimum_paid}
                                    rules={[
                                        {
                                            required: true,
                                            message: t("minimum-paid-required"),
                                        },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (value > 0) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(
                                                    t("positve")
                                                );
                                            },
                                        }),
                                    ]}
                                >
                                    <Input
                                        type='number'
                                        placeholder={t("minimum-paid")}
                                    />
                                </Form.Item>
                            </div>
                        </div>

                        <div className='flex space-x-2'>
                            <div className='w-full'>
                                <Form.Item
                                    label={t("begin-date")}
                                    name='begin_date'
                                    initialValue={moment(voucher.begin_date)}
                                    rules={[
                                        {
                                            required: true,
                                            message: t("begin-date-required"),
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
                                                    t(
                                                        "begin-date-before-end-date"
                                                    )
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
                                    label={t("end-date")}
                                    name='end_date'
                                    initialValue={moment(voucher.end_date)}
                                    rules={[
                                        {
                                            required: true,
                                            message: t("end-date-required"),
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
                                                    t(
                                                        "end-date-after-begin-date"
                                                    )
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
