import { Button, Form, Input, Select, Space, Upload } from "antd"

import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/js/plugins/align.min.js';
import 'froala-editor/js/plugins/char_counter.min.js';

import FroalaEditorComponent from 'react-froala-wysiwyg';
import { UploadOutlined } from "@ant-design/icons";


const adminEmail = [
    "admin@admin.com", "rms@gmail.com", "support.rms@gmail.com"
]



export interface ISendEmailFormProps {
    customerEmailLists: string[]
}

export const SendEmailForm: React.FC<ISendEmailFormProps> = ({ customerEmailLists }) => {
    const onFinish = (value: any) => {
        console.log(value)
    }

    return (
        <Form name="control-ref" onFinish={onFinish}>
            <Form.Item name="senderEmail" label={<b>From</b>}>
                <Select
                    allowClear
                    defaultValue={adminEmail[0]}
                >
                    {
                        adminEmail.map((item: string, index: number) => (
                            <Select.Option value={item} key={index}>{item}</Select.Option>
                        ))
                    }
                </Select>
            </Form.Item >

            <Form.Item label={<b>To</b>}>
                <Space>
                    {customerEmailLists.map((item: string, index: number) => {
                        return (<span key={index} className="bg-slate-50 border rounded-2xl px-2">{item}</span>)
                    })}
                </Space>
            </Form.Item>

            <Form.Item label={<b>Email campaign:</b>}>
                <Input />
            </Form.Item>

            <Form.Item label={<b>Subject</b>}>
                <Input />
            </Form.Item>

            <div className="flex justify-end">
                <Button>Choose a temnplate</Button>
            </div>
            <FroalaEditorComponent tag='textarea' />

            <Form.Item
                name="upload"
                label="Upload"
                valuePropName="fileList"
            >
                <Upload name="logo" action="/upload.do" listType="picture">
                    <Button icon={<UploadOutlined />}>Click to upload</Button>
                </Upload>
            </Form.Item>
        </Form>
    )
}