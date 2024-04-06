"use client"

import { emailTemplateFetcher } from "@/app/api/email";
import EmailTemplateEditor from "@/components/EmailTemplateComponents";
import EditMode from "@/components/EmailTemplateComponents/DropContainer/edit-mode";
import fetchClient from "@/lib/fetch-client";
import useEmailDataStore from "@/store/email";
import { Button, Form, Input, message } from "antd";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";

const EmailTemplate: React.FC = () => {
    const [editMode, setEditMode] = useState(false);
    const [contentChanged, setContentChanged] = useState(false);
    const { emailData, setEmailData } = useEmailDataStore();
    const [emailInfo, setEmailInfo] = useState<any>()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("");

    const params = useParams<{ locale: string; id: string }>()


    useEffect(() => {
        fetchData();
    }, [])


    const fetchData = async () => {
        try {
            setLoading(true);
            const result = await fetchClient({ url: `/message-templates/${params.id}` })
            setEmailInfo(result.data)
            setEmailData(JSON.parse(result.data.content))
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
            description: "desscription",
            content: JSON.stringify(emailData),
            type: "email"
        }
        try {
            const response = await fetchClient({ url: `/message-templates/${params.id}`, method: "PUT", body: data })
            console.log('Updated email template', response.data);
            message.success('Updated email template successfully');
            setEditMode(!editMode)
        } catch (error) {
            console.error('Error update email  Email template:', error);
            message.error('Failed to update Email template');
        }
    };

    console.log(emailInfo)
    return (
        <div className="w-full bg-white" >
            <div className="bg-white w-full py-2 px-3 rounded-md border">
                <Form className="bg-white border p-2 flex space-x-2 items-center" onFinish={handleSave} >
                    <Form.Item
                        name="name"
                        rules={[{ required: true, message: 'Please input the name of email!' }]}
                        className="m-0"
                        initialValue={emailInfo?.name || ""}
                    >
                        <Input placeholder="Enter the email name..." value={emailInfo?.name || ""} />
                    </Form.Item>
                    <Form.Item className="m-0">
                        {
                            editMode ? <Button type="primary" className="bg-primary" htmlType="submit">Save</Button> :
                                <Button onClick={handleClick}>Edit</Button>
                        }
                    </Form.Item>
                </Form>
            </div>
            <EmailTemplateEditor mode={editMode ? "edit" : "preview"} />
            {/* <ConfigElement /> */}
        </div>
    );
};

export default EmailTemplate;
