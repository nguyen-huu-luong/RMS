"use client";
import React, { useEffect, useState } from "react";
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
import Loading from "../loading";

interface EditVoucherFormProps {
    voucherId: number;
    afterSubmit: () => void;
    afterCancel: () => void;
}

export const EditVoucherForm: React.FC<EditVoucherFormProps> = (props) => {
    const [form] = Form.useForm();

    const [voucherData, setVoucherData] = useState<any>({});

    useEffect(() => {
        fetchVoucherData();
    }, [props.voucherId]);

    useEffect(() => {
        if (voucherData){
            form.setFieldsValue(voucherData)
            console.log(voucherData)
        }
    }, [voucherData])

    const fetchVoucherData = async () => {
        try {
            const response = await fetchClient({
                url: `/vouchers/${props.voucherId}`,
                method: "GET",
                data_return: true,
            });
            setVoucherData(response)
        } catch (error) {
            console.error("Error fetching voucher data:", error);
        }
    };

    const onFinish = async (values: any) => {
        try {
            const response = fetchClient({
                url: `/vouchers/${props.voucherId}`,
                body: { data: { ...values } },
                method: "PUT",
            });
            message.success("Voucher Edited successfully");
            form.resetFields();
            props.afterSubmit();
        } catch (error) {
            console.error("Error Editing voucher:", error);
            message.error("Failed to Edit voucher");
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.error("Failed:", errorInfo);
    };
    if (!voucherData) return <Loading />;
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
                onFinishFailed={onFinishFailed}
                onReset={props.afterCancel}
                initialValues={voucherData}
            >
                <div className='flex space-x-2'>
                    <div className='w-full'>
                        <Form.Item
                            shouldUpdate
                            label='Name'
                            name='name'
                            initialValue={voucherData.name}
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
                            shouldUpdate
                            label='Description'
                            name='description'
                            rules={[
                                {
                                    required: true,
                                    message: "Please input the description!",
                                },
                            ]}
                        >
                            <Input placeholder='Description' />
                        </Form.Item>
                    </div>
                </div>

                <div className='flex space-x-2'>
                    <div className='w-full'>
                        <Form.Item
                            shouldUpdate
                            label='Promo Code'
                            name='promo_code'
                            rules={[
                                {
                                    required: true,
                                    message: "Please input the promo code!",
                                },
                            ]}
                        >
                            <Input placeholder='Promo Code' />
                        </Form.Item>
                    </div>

                    <div className='w-full'>
                        <Form.Item
                            shouldUpdate
                            label='Type'
                            name='type'
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
                </div>

                <div className='flex space-x-2'>
                    <div className='w-full'>
                        <Form.Item
                            shouldUpdate
                            label='Amount'
                            name='amount'
                            rules={[
                                {
                                    required: true,
                                    message: "Please input the amount!",
                                },
                            ]}
                        >
                            <Input type='number' placeholder='Amount' />
                        </Form.Item>
                    </div>

                    <div className='w-full'>
                        <Form.Item
                            shouldUpdate
                            label='Maximum Reduce'
                            name='maximum_reduce'
                            rules={[
                                {
                                    required: true,
                                    message: "Please input the maximum reduce!",
                                },
                            ]}
                        >
                            <Input type='number' placeholder='Maximum Reduce' />
                        </Form.Item>
                    </div>
                </div>

                <div className='flex space-x-2'>
                    <div className='w-full'>
                        <Form.Item
                            shouldUpdate
                            label='Quantity'
                            name='quantity'
                            rules={[
                                {
                                    required: true,
                                    message: "Please input the quantity!",
                                },
                            ]}
                        >
                            <Input type='number' placeholder='Quantity' />
                        </Form.Item>
                    </div>

                    <div className='w-full'>
                        <Form.Item
                            shouldUpdate
                            label='Minimum Paid'
                            name='minimum_paid'
                            rules={[
                                {
                                    required: true,
                                    message: "Please input the minimum paid!",
                                },
                            ]}
                        >
                            <Input type='number' placeholder='Minimum Paid' />
                        </Form.Item>
                    </div>
                </div>

                <div className='flex space-x-2'>
                    <div className='w-full'>
                        <Form.Item
                            shouldUpdate
                            label='Begin Date'
                            name='begin_date'
                            rules={[
                                {
                                    required: true,
                                    message: "Please select the begin date!",
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
                            shouldUpdate
                            label='End Date'
                            name='end_date'
                            rules={[
                                {
                                    required: true,
                                    message: "Please select the end date!",
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
                <Form.Item>
                    <div className='flex justify-end space-x-2'>
                        <Button type='default' htmlType='reset'>
                            Cancel
                        </Button>
                        <Button type='primary' htmlType='submit'>
                            Save
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </ConfigProvider>
    );
};
