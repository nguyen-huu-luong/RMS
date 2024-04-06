import { Button, Form, Input, Select, Space, Spin, Upload, message } from "antd"


import { ExpandAltOutlined, UploadOutlined } from "@ant-design/icons";
import React, { useEffect, useRef, useState } from 'react';
const ReactQuill = typeof window === 'object' ?
    require('react-quill')


    : () => false
import 'node_modules/react-quill/dist/quill.snow.css'
import axios from "axios";
import { ChooseTemplateModal } from "./Modals/ChooseTemplateModel";
import fetchClient from "@/lib/fetch-client";



const adminEmail = [
    "admin@admin.com", "rms@gmail.com", "support.rms@gmail.com"
]



export interface ISendEmailFormProps {
    customerEmailLists: string[],
    closeModal: () => void
}

type CustomElement = { type: 'paragraph'; children: CustomText[] }
type CustomText = { text: string }
export const SendEmailForm: React.FC<ISendEmailFormProps> = ({ customerEmailLists, closeModal }) => {
    const [content, setContent] = useState("")
    const quillRef = useRef<typeof ReactQuill>(null);
    const [loading, setLoading] = useState(false)
    const [emailTemplateData, setEmailTemplateData] = useState({
        isUsing: false,
        template: {
            content: "",
            name: "",
            desscription: ""
        }
    })
    const iframeRef = useRef<HTMLIFrameElement | null>(null);



    const loadMjMl = async (emailData: any) => {
        setLoading(true)
        const url = `http://localhost:3000/api/email-editor/generate-mjml`;

        const withHtml = {
            tagName: "mjml",
            attributes: {},
            children: [emailData]
        };

        const respone = await axios(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify(withHtml) // Convert the data to JSON format
        });

        setLoading(false)

        if (iframeRef.current) {
            const iframeDocument =
                iframeRef.current.contentDocument ||
                (iframeRef.current.contentWindow
                    ? iframeRef.current.contentWindow.document
                    : null);

            if (iframeDocument) {
                iframeDocument.open();
                iframeDocument.write(respone.data.html || "");
                iframeDocument.close();
            }
        }
    };

    useEffect(() => {
        if (emailTemplateData.isUsing) {
            loadMjMl(JSON.parse(emailTemplateData.template.content));
        }
    }, [emailTemplateData]);


    const Quill = ReactQuill.Quill;
    var Font = Quill.import("formats/font");
    Font.whitelist = ["Roboto", "Raleway", "Montserrat", "Lato", "Rubik"];
    Quill.register(Font, true);

    const quillModules = {
        toolbar: [
            [{ font: Font.whitelist }],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image'],
            [{ align: [] }],
            [{ color: [] }, { 'background': [] }],
            ['clean']
        ],
    };


    const quillFormats = [
        'header',
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'list',
        'bullet',
        'link',
        'image',
        'align',
        'color',
        'code-block',
    ];


    const handleEditorChange = (newContent: any) => {
        setContent(newContent);
    };
    const onFinish = (values: any) => {
        console.log(values)
        const data = {
            sender: values["senderEmail"],
            receivers: customerEmailLists,
            subject: values["subject"],
            emailCampaignName: values["emailCampaign"],
            html: emailTemplateData.template.content || content,
            type: emailTemplateData.template.content ? "mjml" : "html"
        }

        console.log(data)
        sendEmail(data)
    }


    const sendEmail = async (emailData: any) => {
        try {
            setLoading(true)
            const response = await fetchClient({url: "/send-email", method: "POST", body: {emailData} })
            console.log('sent email', response.data);
            message.success('Sent email successfully');
            setLoading(false)
            closeModal()
        } catch (error) {
            setLoading(false)
            console.error('Error send email  Email template:', error);
            message.error('Failed to send Email');
        }
    }

    const handleUsingEmailTemplate = (template: any) => {
        setEmailTemplateData({
            isUsing: true,
            template
        })
    }

    return (
        <div>
            <Form name="control-ref" onFinish={onFinish}>
                <Form.Item name="senderEmail" label={<b>From</b>} initialValue={adminEmail[0]}>
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
                    <Space wrap>
                        {customerEmailLists.map((item: string, index: number) => {
                            return (<span key={index} className="bg-slate-50 border rounded-2xl px-2">{item}</span>)
                        })}
                    </Space>
                </Form.Item>

                <Form.Item name="emailCampaign" label={<b>Email campaign:</b>} required>
                    <Input />
                </Form.Item>

                <Form.Item name="subject" label={<b>Subject</b>}>
                    <Input />
                </Form.Item>

                <div className="flex justify-end">
                    <ChooseTemplateModal
                        template={emailTemplateData.template}
                        handleChooseEmailTemplate={(emailData) => handleUsingEmailTemplate(emailData)}
                    />
                </div>

                {emailTemplateData.isUsing ? (
                    <div className="border relative">
                        <iframe
                            ref={iframeRef}
                            title="Email preview"
                            className="block w-full"
                        ></iframe>
                    </div>
                )
                    :
                    (
                        <div className="w-full flex items-center">
                            <ReactQuill
                                ref={(el: any) => { quillRef.current = el }}
                                value={content}
                                onChange={handleEditorChange}
                                modules={quillModules}
                                formats={quillFormats}
                                className="w-full h-full mt-10 bg-white"
                            />
                        </div>
                    )}

                <Form.Item
                    name="upload"
                    label="Upload"
                    valuePropName="fileList"
                >
                    <Upload name="logo" action="/upload.do" listType="picture">
                        <Button icon={<UploadOutlined />}>Click to upload</Button>
                    </Upload>
                </Form.Item>

                <Form.Item className="flex justify-end my-3">
                    <Button htmlType="submit" type="primary" className="bg-primary">Send</Button>
                </Form.Item>
            </Form>

            {loading && <div className="absolute inset-0 flex items-center justify-center" >
                <Spin />
            </div>}
        </div>
    )
}