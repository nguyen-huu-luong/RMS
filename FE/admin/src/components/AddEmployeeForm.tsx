import React from 'react';
import {
    Button,
    ConfigProvider,
    Form,
    Input,
    Select,
    Upload,
    message
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import RMSInput from './inputs/RMSInput';
import axios from 'axios';

// const BoldLabelForm = styled(Form)`
//   .ant-form-item-label {
//     label {
//       font-weight: bold;
//     }
//   }
// `; 

interface AddEmployeeFormProps {
    afterSubmit: () => void
    afterCancel: () => void
}

export const AddEmployeeForm: React.FC<AddEmployeeFormProps> = (props) => {

    const [form] = Form.useForm();

    const onFinish = async (values: any) => {
        try {
            const response = await axios.post('http://localhost:3003/api/employees', { data: values }, {
                headers: {
                    Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJmdWxsTmFtZSI6Ik1hbmFnZXIgTWFuYWdlciIsImVtYWlsIjoiTW9ydG9uLk1vcmFyQHlhaG9vLmNvbSIsInJvbGUiOiJtYW5hZ2VyIiwiaWF0IjoxNzEwNjgyMjY5LCJleHAiOjE3MTA2ODI4Njl9.jPycRT81xcOXMtJIePOafNQKy1T9oo3cm4jrTETRA4Q"
                }
            });
            console.log('New employee added:', response.data);
            message.success('Employee added successfully');
            form.resetFields();
            props.afterSubmit();
        } catch (error) {
            console.error('Error adding employee:', error);
            message.error('Failed to add employee');
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
            {/* <Form.Item
                name="upload-avatar"
                label="Avatar"
                valuePropName="fileList"
                getValueFromEvent={normFile}
            >
                <Upload name="avatar" action="/upload.do" listType="picture">
                    <Button icon={<UploadOutlined />} />
                </Upload>
            </Form.Item> */}

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
                    <Form.Item label="Username" name="username" required>
                        <RMSInput placeholder='Username' />
                    </Form.Item>
                </div>

                <div className='w-full' >
                    <Form.Item label="Password" name="password" required>
                        <RMSInput placeholder='Password' />
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
