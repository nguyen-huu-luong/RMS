import { ExpandAltOutlined } from "@ant-design/icons"
import { Button, DatePicker, Form, Input, InputNumber, Modal, Select, message } from "antd"
import { createStyles } from "antd-style";
import { useState } from "react";
import fetchClient from "@/lib/fetch-client";
import { CustomModal } from "../Modals/MyCustomModal";

export interface ICreateModal {
    afterCreated: () => void,
    formElement: React.ReactNode,
    createUrl: string
}
export const CreateModal: React.FC<ICreateModal> = ({ afterCreated, formElement, createUrl }) => {
    const [open, setOpen] = useState(false);
    const showModal = () => {
        setOpen(true);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const handleCreateCampaign = async (values: any) => {
        console.log(values)
        try {
            const result = await fetchClient({
                method: "POST",
                url: createUrl,
                body: {
                    data: { ...values }
                }
            })

            setOpen(false)
            afterCreated()

        } catch (error) {
            message.error(error as any)
        }
    }


    return <main className="ms-auto">
        <Button onClick={showModal}>New</Button>
        <CustomModal
            open={open}
            title="Add new campaign"
            okType="primary"
            okButtonProps={{ className: "bg-primary" }}
            cancelText="Cancel"
            onCancel={handleCancel}
            footer={null}
            width={800}
        >
            <Form variant="filled" layout="vertical" style={{ maxWidth: 1000 }} onFinish={handleCreateCampaign}>
                {formElement}
                <Form.Item>
                    <div className='flex justify-end space-x-2'>
                        <Button type="default" htmlType="reset">
                            Clear
                        </Button>
                        <Button type="primary" htmlType="submit" style={{ backgroundColor: "#4A58EC", color: "white" }}>
                            Save
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </CustomModal>
    </main >
}