import { ExpandAltOutlined } from "@ant-design/icons"
import { Button, Form, Input, Modal, Space } from "antd"
import { createStyles } from "antd-style";
import { useState } from "react";
import { CustomModal } from "./MyCustomModal";
import TextArea from "antd/es/input/TextArea";

interface ICreateTargetListModel {
    onOk: (values: any) => Promise<void>,

}
export const CreateTargetListModel: React.FC<ICreateTargetListModel> = ({ onOk }) => {
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

    return <main className="bg-white w-full py-2 px-3 rounded-md border relative">
        <Button icon={<ExpandAltOutlined />} onClick={showModal}>New</Button>
        <CustomModal
            open={open}
            okButtonProps={{ className: "bg-primary" }}
            footer={null}
            width={600}
            
        >
            <Form
                name="form_group"
                variant="filled"
                layout="vertical"
                style={{ maxWidth: 1000 }}
                onFinish={handleOk}
            >
                <Form.Item label="Name" name="name" required rules={[{ required: true, message: 'Please input the group name !' }]}>
                    <Input placeholder='Group name' />
                </Form.Item>
                <Form.Item label="Description" name="description" required rules={[{ required: true, message: 'Please input the group description !' }]}>
                    <TextArea placeholder='Group description' />
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