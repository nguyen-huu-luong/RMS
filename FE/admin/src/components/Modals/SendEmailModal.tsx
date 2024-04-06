"use client"
import { EllipsisOutlined, PlusCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Dropdown, Flex, Input, MenuProps, Modal, Space, Tooltip } from "antd";
import React, { useState } from "react";
import { AddCustomerForm } from "../AddCustomerForm";
import { createStyles } from 'antd-style';
import { SendEmailForm } from "../SendEmailForm";
import { CustomModal } from "./MyCustomModal";
// const emailLists = ["ngguyenvana@gmail", "bca@gmail.com", "nncj@gmail.com"]

export interface ISendEmailModal {
    emailLists: string[]
}

export const SendEmailModal: React.FC<ISendEmailModal> = ({ emailLists }) => {
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




    return <main className="bg-white w-full py-2 px-3 rounded-md border relative">
        <Button icon={<PlusCircleOutlined />} onClick={showModal}>
            Send Email
        </Button>
        <CustomModal
            title="Send Email"
            open={open}
            onOk={handleOk}
            okType="primary"
            okButtonProps={{ className: "bg-primary" }}
            cancelText="Cancel"
            onCancel={handleCancel}
            footer={null}
            width={1200}
        >
            <SendEmailForm customerEmailLists={emailLists} closeModal={() => setOpen(false)} />
        </CustomModal>
    </main >
}
