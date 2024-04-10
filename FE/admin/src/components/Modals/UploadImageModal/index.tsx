"use client"
import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Modal, Tabs, TabsProps } from "antd";
import React, { useState } from "react";
import UploadFromComputer, { } from "./UploadFromComputer";
import { UnsplashModel } from "./UnsplashModel";




export interface IUploadImageModal {
    upload: (url: string) => void
}
export const UploadImageModal: React.FC<IUploadImageModal> = ({upload}) => {
    const [open, setOpen] = useState(false);
    const [url, setUrl] = useState("")

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Upload from your computer',
            children: <UploadFromComputer />,
        },
        {
            key: '2',
            label: 'Choose in unsplash',
            children: <UnsplashModel onSelectImage={(url:string) => setUrl(url)}/>,
        },
    ];
    const showModal = () => {
        setOpen(true);
    };

    const handleOk = () => {
        upload(url) 
        setOpen(false)
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const onChange = (key: string) => {
        console.log(key);
    };


    return <main className="bg-white w-full py-2 px-3 rounded-md border">
        <Button icon={<PlusCircleOutlined />} onClick={showModal}>
            Choose Image
        </Button>
        <Modal
            title="Upload Image"
            open={open}
            onOk={handleOk}
            okType="primary"
            okButtonProps={{ className: "bg-primary" }}
            cancelText="Cancel"
            onCancel={handleCancel}
            width={1000}
        >
            <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
        </Modal>
    </main >
}
