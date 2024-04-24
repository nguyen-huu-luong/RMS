import { ExpandAltOutlined, PlusCircleFilled, PlusOutlined } from "@ant-design/icons"
import { Button, Form, Input, Modal, Space } from "antd"
import { useState } from "react";
import { CustomModal } from "./MyCustomModal";
import TextArea from "antd/es/input/TextArea";
import { CSSProperties } from "styled-components";

interface ICreateTargetListModal {
    onOk: (values: any) => Promise<void>,
    triggerBtnClasseNames?: string
    className?: string,
    style?: CSSProperties

}
export const CreateTargetListModal: React.FC<ICreateTargetListModal> = ({ onOk, ...props }) => {
    const [open, setOpen] = useState(false);
    const showModal = () => {
        setOpen(true);
    };

    const handleOk = async (values: any) => {
        await onOk(values)
        setOpen(false);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    return <main style={props.style} className={props.className}>
        <Button className={props.triggerBtnClasseNames} icon={<PlusOutlined />} onClick={showModal} />
        <CustomModal
            open={open}
            okButtonProps={{ className: "bg-primary" }}
            footer={null}
            width={600}
            onCancel={handleCancel}
        >
            <Form
                name="form_group"
                variant="filled"
                layout="vertical"
                style={{ maxWidth: 1000 }}
                onFinish={handleOk}
                
            >
                <Form.Item label="Name" name="name" required rules={[{ required: true, message: 'Please input the group name !' }]}>
                    <Input placeholder='Name' />
                </Form.Item>
                <Form.Item label="Subject" name="description" required rules={[{ required: true, message: 'Please input the group description !' }]}>
                    <TextArea placeholder='Subject' />
                </Form.Item>
                <Form.Item>
                    <Space align="end">
                        <Button type="default" htmlType="reset" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button type="primary" htmlType="submit" style={{ backgroundColor: "#4A58EC", color: "white" }}>
                            Save
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </CustomModal>
    </main >
}