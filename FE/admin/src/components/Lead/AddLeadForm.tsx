'use client'
import React from 'react';
import {
    Button,
    ConfigProvider,
    DatePicker,
    Form,
    Input,
    Select,
    Space,
    Upload,
    message
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import useToken from 'antd/es/theme/useToken';
import RMSInput from '../inputs/RMSInput';
import RMSDatePicker from '../inputs/RMSDatePicker';
import axios from 'axios';
import { useSession } from 'next-auth/react';

interface AddLeadFormProps {
    afterSubmit: () => void
    afterCancel: () => void
}

export const AddLeadForm: React.FC<AddLeadFormProps> = (props) => {

    const [form] = Form.useForm();
    const { data: session, status } = useSession();

    const onFinish = async (values: any) => {
        try {
            const response = await axios.post('http://localhost:3003/api/customers', { data: {...values, type: "Lead"} }, {
                headers: {
                    Authorization:
                        `Bearer ${session?.user.accessToken}`,
                }
            });
            console.log('New Lead added:', response.data);
            message.success('Lead added successfully');
            form.resetFields();
            props.afterSubmit();
        } catch (error) {
            console.error('Error adding Lead:', error);
            message.error('Failed to add Lead');
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.error('Failed:', errorInfo);
    };
    const normFile = (e: any) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };
    return <ConfigProvider
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
        <Form name="form_item_path" variant="filled" layout="vertical" style={{ maxWidth: 1000 }} onFinish={onFinish} onReset={props.afterCancel}>

            <div className="flex space-x-2">
                <div className='w-full'>
                    <Form.Item label="Firstname" name="firstname" required>
                        <RMSInput placeholder='Firstname' />
                    </Form.Item>
                </div>
                <div className='w-full'>
                    <Form.Item label="Lastname" name="lastname" required>
                        <RMSInput placeholder='Lastname' />
                    </Form.Item>
                </div>
            </div>

            <div className="flex space-x-2">
                <div className='w-full'>
                    <Form.Item label="Phone" name="phone" required>
                        <RMSInput placeholder='Phone' />
                    </Form.Item>
                </div>
                <div className='w-full'>
                    <Form.Item label="Email" name="email">
                        <RMSInput placeholder='Email' />
                    </Form.Item>
                </div>
            </div>

            <div className="flex space-x-2">
                <div className='w-full'>
                    <Form.Item label="Birthday" name="birthday">
                        <RMSDatePicker className='w-full' />
                    </Form.Item>
                </div>
                <div className='w-full'>
                    <Form.Item label="Source" name="source">
                        <Select>
                            <Select.Option value="At Restaurant">At Restaurant</Select.Option>
                            <Select.Option value="Tiktok">Tiktok</Select.Option>
                            <Select.Option value="Facebook">Facebook</Select.Option>
                            <Select.Option value="Subcriptions">Subcriptions</Select.Option>

                        </Select>
                    </Form.Item>
                </div>
            </div>
            <Form.Item>
                <div className='flex justify-end space-x-2'>
                    <Button type="default" htmlType="reset">
                        Cancle
                    </Button>
                    <Button type="primary" htmlType="submit">
                        Save
                    </Button>
                </div>
            </Form.Item>
        </Form>

    </ConfigProvider>
}
