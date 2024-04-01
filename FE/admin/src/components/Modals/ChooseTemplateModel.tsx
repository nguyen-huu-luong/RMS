"use client"
import { EllipsisOutlined, PlusCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Dropdown, Flex, Input, MenuProps, Modal, Popconfirm, Space, Tooltip, message } from "antd";
import React, { useEffect, useState } from "react";
import { AddCustomerForm } from "../AddCustomerForm";
import { createStyles } from 'antd-style';
import axios from "axios";
import Link from "next/link";
import { CustomModal } from "./MyCustomModal";
import fetchClient from "@/lib/fetch-client";

export interface IChooseTemplateModal {
    handleChooseEmailTemplate: (emailData: any) => void,
    template?: any
}

export const ChooseTemplateModal: React.FC<IChooseTemplateModal> = ({ handleChooseEmailTemplate, template }) => {
    const [open, setOpen] = useState(false);
    const [templates, setTemplates] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const result = await fetchClient({url: `/message-templates/all`})
                console.log(result.data.data)
                setTemplates(result.data.data)
                setLoading(false)
            } catch (error) {
                setLoading(false)
                console.log("error", error)
                message.error('Failed to fetch Email template');
            }
            setLoading(false);
        }
        fetchData()
    }, [])

    const showModal = () => {
        setOpen(true);
    };

    const handleOk = () => {
        setOpen(false);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const handleClick = (template: any) => {
        console.log(template)
        handleChooseEmailTemplate(template)
        setOpen(false)
    }
    return <main className="bg-white w-full py-2 px-3 rounded-md border">

        {template.content !== "" ? <Space>
            <span> Using template <Link href={`./marketing/templates/${template.id}`}><b>{template.name}</b></Link></span>
            <Button onClick={showModal}>Change</Button>
        </Space> :
            <Button icon={<PlusCircleOutlined />} onClick={showModal}>
                Choose Template
            </Button>
        }

        <CustomModal
            title="Choose template"
            open={open}
            onOk={handleOk}
            okType="primary"
            okButtonProps={{ className: "bg-primary" }}
            cancelText="Cancel"
            onCancel={handleCancel}
            footer={null}
        >
            <Space>
                {templates && templates.map((item: any) => (
                    <Popconfirm
                        title="Confirm"
                        description="Are you sure to using this template?"
                        onConfirm={() => handleClick(item)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <div className="bg-slate-300 rounded px-2 py-1 link">
                            <p className=""><b>{item.name}</b></p>
                            {/* <p className="bg- rounded px-2 py-1">{item.description}</p> */}
                        </div>
                    </Popconfirm>
                ))}
            </Space>
        </CustomModal>
    </main >
}
