"use client"
import EmailTemplateEditor from "@/components/EmailTemplateComponents";
import TestTextEditor from "@/components/EmailTemplateComponents/RightSidebar/TextAttributes/TestTextEditor";
import EmailTextEditor from "@/components/EmailTextEditor/TextEditor";
import fetchClient from "@/lib/fetch-client";
import useEmailDataStore from "@/store/email";
import { Button, Form, Input, Select, Space, message } from "antd";
import { useForm } from "antd/es/form/Form";
import TextArea from "antd/es/input/TextArea";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const EmailTemplate: React.FC = () => {
    const [editMode, setEditMode] = useState(false);
    const [contentChanged, setContentChanged] = useState(false);
    const { emailData, setEmailData } = useEmailDataStore();
    const [emailInfo, setEmailInfo] = useState<any>()
    const [loading, setLoading] = useState(true)
    const [btnLoading, setBtnLoading] = useState(false)
    const [error, setError] = useState("");
    const [form] = useForm()
    const [editorType, setEditorType] = useState(emailInfo?.type)
    const [content, setContent] = useState(emailInfo?.type === "text" ? emailInfo.content : "")

    const t:any = useTranslations("Marketing.Campaign")

    const params = useParams<{ locale: string; id: string }>()


    useEffect(() => {
        fetchData();
    }, [])


    const fetchData = async () => {
        try {
            setLoading(true);
            const result = await fetchClient({ url: `/message-templates/${params.id}` })
            setEmailInfo(result.data)
            result.data.type === "dnd" && setEmailData(JSON.parse(result.data.content))
            setEditorType(result.data.type)
            setContent(result.data.type === "text" && result.data.content)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log("error", error)
            message.error('Failed to fetch Email template');
        }

        setLoading(false);
    }

    if (loading) {
        return (<>
            <p>Loading</p>
        </>)
    }

    if (error) {
        return (<>
            error
        </>)
    }
    const handleClick = (e: any) => {
        e.preventDefault()
        if (editMode) {
            if (contentChanged) {
                // save to database

            }
            setEditMode(!editMode)
        } else {
            setEditMode(!editMode)
        }
    }

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
            const response = await fetchClient({ url: `/message-templates/${params.id}`, method: "PUT", body: data })
            console.log('Updated email template', response.data);
            message.success('Updated email template successfully');
            setEditMode(!editMode)
            setBtnLoading(false)

        } catch (error) {
            console.error('Error update email  Email template:', error);
            message.error('Failed to update Email template');
            setBtnLoading(false)
        }
    };

    const handleCancel = () => {
        form.resetFields()
        setEmailInfo(emailInfo)
        emailInfo.type === "dnd" && setEmailData(JSON.parse(emailInfo.content))
        setEditMode(false)
    }

    console.log(emailInfo)
    return (
        <div className="w-full" >
            <Form className="p-2" onFinish={handleSave} form={form}>
                <Space>
                    <Form.Item className="m-0">
                        {
                            editMode ? <Button type="primary" loading={btnLoading} className="bg-primary" htmlType="submit">Save</Button> :
                                <Button onClick={handleClick}>Edit</Button>
                        }
                    </Form.Item>

                    {editMode && <Form.Item className="m-0">
                        <Button htmlType="reset" onClick={handleCancel}>Cancel</Button>
                    </Form.Item>}
                </Space>
                <div className="bg-white w-full py-2 px-3 rounded-md border mb-2 space-y-2">
                    <div className="flex items-start space-x-2">
                        <Form.Item
                            label={t("name")}
                            name={"name"}
                            rules={[{ required: true, message: 'Please input the name of email!' }]}
                            className="m-0"
                            initialValue={emailInfo?.name || ""}
                        >
                            <Input disabled={!editMode} placeholder="Enter the email name..." style={{ minWidth: 200 }} defaultValue={emailInfo?.description} />
                        </Form.Item>
                        <Form.Item
                            label={t("description")}
                            name="description"
                            className="m-0"
                            initialValue={emailInfo?.description || ""}
                        >
                            <TextArea disabled={!editMode} placeholder="Enter the email description..." style={{ minWidth: 300 }} defaultValue={emailInfo?.name} />
                        </Form.Item>
                    </div>
                    <div className="flex">
                        <Form.Item label="Editor type" initialValue={editorType} className="m-0">
                            <Select
                                style={{ maxWidth: 300 }} disabled={!editMode}
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
                {editorType === 'dnd' && <EmailTemplateEditor mode={editMode ? "edit" : "preview"} />}
                {editorType === 'text' &&
                    <EmailTextEditor content={content} onContentChange={(str) => setContent(str)} />}
                {/* <ConfigElement /> */}
            </div>
        </div>
    );
};

export default EmailTemplate;
