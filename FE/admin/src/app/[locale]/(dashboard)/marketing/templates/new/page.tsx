"use client"
import EmailTemplateEditor from "@/components/EmailTemplateComponents";
import TestTextEditor from "@/components/EmailTemplateComponents/RightSidebar/TextAttributes/TestTextEditor";
import EmailTextEditor from "@/components/EmailTextEditor/TextEditor";
import fetchClient from "@/lib/fetch-client";
import useEmailDataStore from "@/store/email";
import { Button, Form, Input, Select, Space, message } from "antd";
import { useForm } from "antd/es/form/Form";
import TextArea from "antd/es/input/TextArea";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const EmailTemplate: React.FC = () => {
    const { emailData, setEmailData } = useEmailDataStore();
    const [emailInfo, setEmailInfo] = useState<any>()
    const [loading, setLoading] = useState(true)
    const [btnLoading, setBtnLoading] = useState(false)
    const [error, setError] = useState("");
    const [form] = useForm()
    const [editorType, setEditorType] = useState("text")
    const [content, setContent] = useState("")

    const handleSave = async (values: any) => {
        console.log(values)
        const data = {
            name: values.name,
            description: values.description,
            type: editorType,
            content: editorType === "text" ? content : JSON.stringify(emailData),
        }
        setBtnLoading(true)
        try {
            const response = await fetchClient({ url: `/message-templates`, method: "POST", body: data })
            // console.log('Updated email template', response.data);
            message.success('Updated email template successfully');
            setBtnLoading(false)

        } catch (error) {
            console.error('Error update email  Email template:', error);
            message.error('Failed to update Email template');
            setBtnLoading(false)
        }
    };

    console.log(emailInfo)
    return (
        <div className="w-full" >
            <Form className="p-2" onFinish={handleSave} form={form}>
                <Space>
                    <Form.Item className="m-0">
                        {
                           <Button type="primary" loading={btnLoading} className="bg-primary" htmlType="submit">Save</Button>
                        }
                    </Form.Item>

                </Space>
                <div className="bg-white w-full py-2 px-3 rounded-md border mb-2 space-y-2">
                    <div className="flex items-start space-x-2">
                        <Form.Item
                            name="name"
                            label={"Name"}
                            rules={[{ required: true, message: 'Please input the name of email!' }]}
                            className="m-0"
                            initialValue={emailInfo?.name || ""}
                        >
                            <Input placeholder="Enter the email name..." style={{ minWidth: 200 }} defaultValue={emailInfo?.description} />
                        </Form.Item>
                        <Form.Item
                            label="Description"
                            name="description"
                            className="m-0"
                            initialValue={emailInfo?.description || ""}
                        >
                            <TextArea placeholder="Enter the email description..." style={{ minWidth: 300 }} defaultValue={emailInfo?.name} />
                        </Form.Item>
                    </div>
                    <div className="flex">
                        <Form.Item label="Editor type" initialValue={editorType} className="m-0">
                            <Select
                                style={{ maxWidth: 300 }}
                                value={editorType}
                                onChange={(value) => setEditorType(value)}
                            >
                                <Select.Option value="dnd">Drop and Drag</Select.Option>
                                <Select.Option value="text">Text Editor</Select.Option>
                            </Select>
                        </Form.Item>
                    </div>
                </div>
            </Form>
            <div className="p-2">
                {editorType === 'dnd' && <EmailTemplateEditor mode={"edit"} />}
                {editorType === 'text' &&
                    <EmailTextEditor content={content} onContentChange={(str:string) => setContent(str)} />}
                {/* <ConfigElement /> */}
            </div>
        </div>
    );
};

export default EmailTemplate;
