"use client";
import React from "react";
import {
    Button,
    ConfigProvider,
    DatePicker,
    Form,
    Input,
    Select,
    message,
} from "antd";
import fetchClient from "@/lib/fetch-client";
import { useTranslations } from "next-intl";

interface AddVoucherFormProps {
    afterSubmit: () => void;
    afterCancel: () => void;
}

export const AddVoucherForm: React.FC<AddVoucherFormProps> = (props) => {
    const [form] = Form.useForm();
    const t = useTranslations("Voucher");

    const onFinish = async (values: any) => {
        try {
            if (values.type === "fixed") {
                values.maximum_reduce = values.amount;
            }
            const response = fetchClient({
                url: "/vouchers",
                body: { data: { ...values } },
                method: "POST",
            });
            message.success(t("success"));
            form.resetFields();
            props.afterSubmit();
        } catch (error) {
            console.error("Error adding voucher:", error);
            message.error("Failed to add voucher");
        }
    };

    return (
        <ConfigProvider
            theme={{
                components: {
                    Form: {
                        itemMarginBottom: 16,
                    },
                    Input: {
                        addonBg: "#F6FAFD",
                        colorFillTertiary: "#F6FAFD",
                    },
                    DatePicker: {
                        colorFillTertiary: "#F6FAFD",
                    },

                    Select: {
                        colorFillTertiary: "#F6FAFD",
                    },
                },
            }}
        >
            <Form
                name='form_item_path'
                variant='filled'
                layout='vertical'
                style={{ maxWidth: 1000 }}
                onFinish={onFinish}
                onReset={props.afterCancel}
            >
                <div className='flex space-x-2'>
                    <div className='w-full'>
                        <Form.Item
                            label={t("name")}
                            name='name'
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
                </div>

                <div className='flex space-x-2'>
                    <div className='w-full'>
                        <Form.Item
                            label={t("can-redeem")}
                            name='can_redeem'
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

                    <div className='w-full'>
                        <Form.Item
                            label={t("type")}
                            name='type'
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
                </div>

                <div className='flex space-x-2'>
                    <div className='w-full'>
                        <Form.Item
                            label={t("amount")}
                            name='amount'
                            rules={[
                                {
                                    required: true,
                                    message: t("amount-required"),
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        const type = getFieldValue("type");
                                        if (value > 0) {
                                            if (type === "percentage") {
                                                if (value > 100) {
                                                    return Promise.reject(
                                                        t("over-100")
                                                    );
                                                }
                                            }
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(t("positve"));
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
                            rules={[
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        const type = getFieldValue("type");
                                        if (type === "fixed") {
                                            return Promise.resolve();
                                        } else if (value <= 0) {
                                            return Promise.reject(t("positve"));
                                        }
                                        if (value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(
                                            t("maximum-reduction-required")
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

                <div className='flex space-x-2'>
                    <div className='w-full'>
                        <Form.Item
                            label={t("quantity")}
                            name='quantity'
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
                                        return Promise.reject(t("positve"));
                                    },
                                }),
                            ]}
                        >
                            <Input type='number' placeholder={t("quantity")} />
                        </Form.Item>
                    </div>

                    <div className='w-full'>
                        <Form.Item
                            label={t("minimum-paid")}
                            name='minimum_paid'
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
                                        return Promise.reject(t("positve"));
                                    },
                                }),
                            ]}
                        >
                            <Input type='number' placeholder={t('minimum-paid')} />
                        </Form.Item>
                    </div>
                </div>

                <div className='flex space-x-2'>
                    <div className='w-full'>
                        <Form.Item
                            label={t('begin-date')}
                            name='begin_date'
                            rules={[
                                {
                                    required: true,
                                    message: t('begin-date-required'),
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
                                            t('begin-date-before-end-date')
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
                            label={t('end-date')}
                            name='end_date'
                            rules={[
                                {
                                    required: true,
                                    message: t('end-date-required'),
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
                                            t('end-date-after-begin-date')
                                        );
                                    },
                                }),
                            ]}
                        >
                            <DatePicker />
                        </Form.Item>
                    </div>
                </div>
                <Form.Item>
                    <div className='flex justify-end space-x-2'>
                        <Button type='default' htmlType='reset'>
                            {t('cancel')}
                        </Button>
                        <Button type='primary' htmlType='submit'>
                            {t('save')}
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </ConfigProvider>
    );
};
