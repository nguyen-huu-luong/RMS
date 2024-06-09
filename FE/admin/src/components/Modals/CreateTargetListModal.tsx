import { ExpandAltOutlined, PlusCircleFilled, PlusOutlined } from "@ant-design/icons"
import { Button, Form, Input, Modal, Space, message } from "antd"
import { useState } from "react";
import { CustomModal } from "./MyCustomModal";
import TextArea from "antd/es/input/TextArea";
import { CSSProperties } from "styled-components";
import { FaBullseye } from "react-icons/fa";
import { useTranslations } from "next-intl";

interface ICreateTargetListModal {
    onOk: (values: any) => Promise<void>,
    triggerBtnClasseNames?: string
    triggerText?: string,
    showIcon?: boolean,
    className?: string,
    style?: CSSProperties

}
export const CreateTargetListModal: React.FC<ICreateTargetListModal> = ({ onOk, ...props }) => {
    const [open, setOpen] = useState(false);
    const t_general = useTranslations("General")
    const [loading, setLoading] = useState(false)
    const showModal = () => {
        setOpen(true);
    };

    const handleOk = async (values: any) => {
        setLoading(true)
        try {
            await onOk(values)
            message.success("Create targetlist successfully")
            setOpen(false);
            setLoading(false)
        } catch (error) {
            setLoading(false)
            throw error
        }
    };

    const handleCancel = () => {
        setOpen(false);
    };

    return <main style={props.style} className={props.className}>
        <Button className={`${props.triggerBtnClasseNames}`} icon={props.showIcon && <PlusOutlined />} onClick={showModal}>{props.triggerText || t_general("new")}</Button>
        <CustomModal
            open={open}
            okButtonProps={{ className: "bg-primary" }}
            footer={null}
            width={600}
            onCancel={handleCancel}
            destroyOnClose
            title="Create new targetlist"
        >
            <Form
                name="form_group"
                variant="filled"
                layout="vertical"
                style={{ maxWidth: 1000 }}
                onFinish={handleOk}

            >
                <Form.Item label="Name" name="name" required rules={[{ required: true, message: 'Please input the name of new targetlist !' }]}>
                    <Input placeholder='Name' />
                </Form.Item>
                <Form.Item label="Description" name="description">
                    <TextArea placeholder='Targetlist Description' />
                </Form.Item>
                <Form.Item>
                    <Space align="end">
                        <Button type="default" htmlType="reset" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button type="primary" htmlType="submit" style={{ backgroundColor: "#4A58EC", color: "white" }} loading={loading}>
                            Save
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </CustomModal>
    </main >
}