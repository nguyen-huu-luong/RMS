"use client"
import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";
import React, { useState } from "react";

export const SendSMSModal= () => {
    const [open, setOpen] = useState(false);
    const showModal = () => {
        setOpen(true);
    };

    const handleOk = () => {
        setOpen(false);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    return <main className="bg-white w-full py-2 px-3 rounded-md border">
       <Button icon={<PlusCircleOutlined />} onClick={showModal}>
            Send SMS
        </Button>
        <Modal
            title="Send SMS"
            open={open}
            onOk={handleOk}
            okType="primary"
            okButtonProps={{ className: "bg-primary" }}
            cancelText="Cancel"
            onCancel={handleCancel}
            footer={null}
        >
           Email form
        </Modal>
    </main >
}
