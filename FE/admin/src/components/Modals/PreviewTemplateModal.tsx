import { ExpandAltOutlined } from "@ant-design/icons"
import { Button, Modal } from "antd"
import { createStyles } from "antd-style";
import { useState } from "react";
import { CustomModal } from "./MyCustomModal";

export interface IPreviewTemplateModal {
    body: React.ReactNode,
}
export const PreviewTemplateModal: React.FC<IPreviewTemplateModal> = ({ body }) => {
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
        <Button icon={<ExpandAltOutlined />} onClick={showModal} />
        <CustomModal
            open={open}
            onOk={handleOk}
            okType="primary"
            okButtonProps={{ className: "bg-primary" }}
            cancelText="Cancel"
            onCancel={handleCancel}
            footer={null}
            width={1200}
        >
            {body}
        </CustomModal>
    </main >
}