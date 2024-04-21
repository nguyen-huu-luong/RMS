"use client";
import React from "react";
import {
    Button,
    ConfigProvider,
    DatePicker,
    Form,
    Input,
    Select,
    Space,
    Upload,
    message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import styled from "styled-components";
import useToken from "antd/es/theme/useToken";
import RMSInput from "../inputs/RMSInput";
import RMSDatePicker from "../inputs/RMSDatePicker";
import axios from "axios";
import { useSession } from "next-auth/react";
import fetchClient from "@/lib/fetch-client";

interface AddLeadFormProps {
    afterSubmit: () => void;
    afterCancel: () => void;
}

export const AddLeadForm: React.FC<AddLeadFormProps> = (props) => {
    const [form] = Form.useForm();

    const onFinish = async (values: any) => {
        form.validateFields();
        try {
            const response = fetchClient({
                url: "/customers",
                body: { data: { ...values, type: "lead" } },
                method: "POST",
                data_return: true,
            });
            console.log(response);
            message.success("Lead added successfully");
            form.resetFields();
            props.afterSubmit();
        } catch (error) {
            console.error("Error adding Lead:", error);
            message.error("Failed to add Lead");
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
                            label='Firstname'
                            name='firstname'
                            required
                            rules={[
                                {
                                    required: true,
                                    message: "Please input user firstname!",
                                },
                            ]}
                        >
                            <RMSInput placeholder='Firstname' />
                        </Form.Item>
                    </div>
                    <div className='w-full'>
                        <Form.Item
                            label='Lastname'
                            name='lastname'
                            required
                            rules={[
                                {
                                    required: true,
                                    message: "Please input user lastname!",
                                },
                            ]}
                        >
                            <RMSInput placeholder='Lastname' />
                        </Form.Item>
                    </div>
                </div>

                <div className='flex space-x-2'>
                    <div className='w-full'>
                        <Form.Item
                            label='Phone'
                            name='phone'
                            required
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your phone number!",
                                },
                                {
                                    pattern: /^(\+?\d{1,3}[- ]?)?\d{10}$/,
                                    message:
                                        "Please enter a valid phone number!",
                                },
                            ]}
                        >
                            <RMSInput placeholder='Phone' />
                        </Form.Item>
                    </div>
                    <div className='w-full'>
                        <Form.Item
                            label='Email'
                            name='email'
                            required
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your email!",
                                },
                                {
                                    type: "email",
                                    message:
                                        "Please enter a valid email address!",
                                },
                            ]}
                        >
                            <RMSInput placeholder='Email' />
                        </Form.Item>
                    </div>
                </div>

                <div className='flex space-x-2'>
                    <div className='w-full'>
                        <Form.Item label='Birthday' name='birthday'>
                            <RMSDatePicker className='w-full' />
                        </Form.Item>
                    </div>
                    <div className='w-full'>
                        <Form.Item
                            label='Source'
                            name='source'
                            required
                            rules={[
                                {
                                    required: true,
                                    message: "Please choose a source!",
                                },
                            ]}
                        >
                            <Select>
                                <Select.Option value='At Restaurant'>
                                    At Restaurant
                                </Select.Option>
                                <Select.Option value='Tiktok'>
                                    Tiktok
                                </Select.Option>
                                <Select.Option value='Facebook'>
                                    Facebook
                                </Select.Option>
                                <Select.Option value='Subcriptions'>
                                    Subcriptions
                                </Select.Option>
                            </Select>
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
