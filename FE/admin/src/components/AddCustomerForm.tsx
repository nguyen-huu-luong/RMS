import React from 'react';
import {
    Button,
    ConfigProvider,
    Form,
    Select,
    Upload,
    message
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import RMSInput from './inputs/RMSInput';
import RMSDatePicker from './inputs/RMSDatePicker';
import axios from 'axios';

interface AddCustomerFormProps {
    afterSubmit: () => void
    afterCancel: () => void
}

const backend_api = `http://${process.env.NEXT_PUBLIC_BACKEND_HOST}:${process.env.NEXT_PUBLIC_BACKEND_PORT}/api`

export const AddCustomerForm: React.FC<AddCustomerFormProps> = (props) => {

    const [form] = Form.useForm();

    const onFinish = async (values: any) => {
        try {
            const response = await axios.post(`${backend_api}/customers`, { data: values }, {
                headers: {
                    Authorization:
                        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJmdWxsTmFtZSI6Ik1hbmFnZXIgTWFuYWdlciIsImVtYWlsIjoiTWFyaW9fS29zc0B5YWhvby5jb20iLCJyb2xlIjoibWFuYWdlciIsImlhdCI6MTcwODM1NjUwNCwiZXhwIjoxNzE0MzU2NTA0fQ.naMCtTR_QKTwTMkqjIL6QaMNnbZdOk7wzuojI_H5RNc",
                }
            });
            console.log('New customer added:', response.data);
            message.success('Customer added successfully');
            form.resetFields();
            props.afterSubmit();
        } catch (error) {
            console.error('Error adding customer:', error);
            message.error('Failed to add customer');
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
            <Form.Item
                name="upload-avatar"
                label="Avatar"
                valuePropName="fileList"
                getValueFromEvent={normFile}
            >
                <Upload name="avatar" action="/upload.do" listType="picture">
                    <Button icon={<UploadOutlined />} />
                </Upload>
            </Form.Item>

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
                    <Form.Item label="Birthday">
                        <RMSDatePicker className='w-full' />
                    </Form.Item>
                </div>
                <div className='w-full'>
                    <Form.Item label="Source">
                        <Select>
                            <Select.Option value="demo">Demo</Select.Option>
                        </Select>
                    </Form.Item>
                </div>
            </div>


            <div className="flex space-x-2">
                <div className='w-full'>
                    <Form.Item label="Source">
                        <Select>
                            <Select.Option value="demo">Demo</Select.Option>
                        </Select>
                    </Form.Item>
                </div>

                <div className='w-full'>
                    <Form.Item label="Source">
                        <Select>
                            <Select.Option value="demo">Demo</Select.Option>
                        </Select>
                    </Form.Item>
                </div>

                <div className='w-full'>
                    <Form.Item label="Source">
                        <Select>
                            <Select.Option value="demo">Demo</Select.Option>
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
