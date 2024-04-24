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

interface AddVoucherFormProps {
    afterSubmit: () => void;
    afterCancel: () => void;
}

export const AddVoucherForm: React.FC<AddVoucherFormProps> = (props) => {
    const [form] = Form.useForm();

    const onFinish = async (values: any) => {
        try {
            const response = fetchClient({
                url: "/vouchers",
                body: { data: { ...values } },
                method: "POST",
            });
            message.success("Voucher added successfully");
            form.resetFields();
            props.afterSubmit();
        } catch (error) {
            console.error("Error adding voucher:", error);
            message.error("Failed to add voucher");
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.error("Failed:", errorInfo);
    };
    const normFile = (e: any) => {
        console.log("Upload event:", e);
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
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
                            label='Name'
                            name='name'
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
                            label='Can Redeem'
                            name='can_redeem'
                            rules={[
                                {
                                    required: true,
                                    message:
                                        "Please select whether it can be redeemed or not!",
                                },
                            ]}
                        >
                            <Select placeholder='Select can redeem'>
                                <Select.Option value={true}>Yes</Select.Option>
                                <Select.Option value={false}>No</Select.Option>
                            </Select>
                        </Form.Item>
                    </div>

                    <div className='w-full'>
                        <Form.Item
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
                            Cancle
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
