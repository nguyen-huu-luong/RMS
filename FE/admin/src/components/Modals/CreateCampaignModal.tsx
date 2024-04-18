import { ExpandAltOutlined } from "@ant-design/icons"
import { Button, DatePicker, Form, Input, InputNumber, Modal, Select, message } from "antd"
import { createStyles } from "antd-style";
import { useState } from "react";
import { CustomModal } from "./MyCustomModal";
import fetchClient from "@/lib/fetch-client";

export interface ICreateCampaignModal {
    afterCreated: () => void
}
export const CreateCampaignModal: React.FC<ICreateCampaignModal> = ({ afterCreated }) => {
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

    const handleCreateCampaign = async (values: any) => {
        console.log(values)
        try {
            const result = await fetchClient({
                method: "POST",
                url: "/campaigns",
                body: { ...values, startDate: values["start_date"], endDate: values["end_date"]}
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
                <div className="flex space-x-2">
                    <div className='w-full'>
                        <Form.Item label="Name" name="name" required rules={[{ required: true, message: 'Please input the campaign name !' }]}>
                            <Input placeholder='Campaign name' />
                        </Form.Item>
                    </div>
                    <div className='w-full'>
                        <Form.Item label="Status" name="status" required rules={[{ required: true, message: 'Please select the  campaign status !' }]}>
                            <Select>
                                <Select.Option value="planning">Planning</Select.Option>
                                <Select.Option value="active">Active</Select.Option>
                                <Select.Option value="inactive">Inactive</Select.Option>
                            </Select>
                        </Form.Item>
                    </div>
                </div>

                <div className="flex space-x-2">
                    <div className='w-full'>
                        <Form.Item label="Type" name="type" required rules={[{ required: true, message: 'Please input the campaign type !' }]}>
                            <Select>
                                <Select.Option value="newsletter">Newsletter</Select.Option>
                                <Select.Option value="email">Email</Select.Option>
                                <Select.Option value="welcome">Welcome</Select.Option>
                            </Select>
                        </Form.Item>
                    </div>
                    <div className='w-full'>
                        <Form.Item label="Start date" name="start_date" required rules={[{ required: true, message: 'Please input the start date !' }]}>
                            <DatePicker className='w-full' />
                        </Form.Item>
                    </div>
                </div>

                <div className="flex space-x-2">
                    <div className='w-full'>
                        <Form.Item label="Budget" name="budget" >
                            <InputNumber min={10000} className='w-full' />
                        </Form.Item>
                    </div>
                    <div className='w-full'>
                        <Form.Item label="End date" name="end_date" required rules={[{ required: true, message: 'Please input the end date !' }]}>
                            <DatePicker className='w-full' />
                        </Form.Item>
                    </div>
                </div>

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