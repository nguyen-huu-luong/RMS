import { ExpandAltOutlined } from "@ant-design/icons"
import { Button, DatePicker, Form, FormInstance, Input, InputNumber, Modal, Popconfirm, Select, message } from "antd"
import { createStyles } from "antd-style";
import { CustomModal } from "../Modals/MyCustomModal";
import { UploadOutlined } from "@ant-design/icons"
import { useState } from "react"
import RMSInput from "../inputs/RMSInput"
import RMSDatePicker from "../inputs/RMSDatePicker"
import useModal from "antd/es/modal/useModal";
import TextArea from "antd/es/input/TextArea";


export interface ICreateModal {
    formControl: FormInstance<any>
    onCreate: (values: any) => Promise<void>,
}
export const CreateNewCustomerModal: React.FC<ICreateModal> = ({ formControl, ...props }) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false)
    const [modal] = useModal()
    const showModal = () => {
        setOpen(true);
    };

    const handleCancel = () => {
        setOpen(false);

    };

    const handleOk = () => {
        formControl.submit()
    }

    const handleFormSubmit = async (values: any) => {
        setLoading(true);
        try {
            await props.onCreate(values);
            message.success("Create custtomer successfully")
            setOpen(false)
            setLoading(false)
        } catch (error) {
            setLoading(false) 
        }
    }

    return <main className="ms-auto">
        <Button onClick={showModal}>New</Button>
        <CustomModal
            open={open}
            title="Add new customer"
            okType="primary"
            okButtonProps={{ className: "bg-primary" }}
            onCancel={handleCancel}
            onOk={handleOk}
            width={800}

            confirmLoading={loading}
            footer={(_, { OkBtn, CancelBtn }) => (
                <>
                    <Popconfirm title="Are you sure to reset all data?" onConfirm={handleCancel}>
                        <Button>Cancel</Button>
                    </Popconfirm>
                    <OkBtn />
                </>
            )}
        >
            <Form variant="filled" form={formControl} layout="vertical" style={{ maxWidth: 1000 }} onFinish={handleFormSubmit}>
                <div className="flex space-x-2">
                    <div className='w-full'>
                        <Form.Item label="Firstname" name="firstname" required>
                            <RMSInput placeholder='Firstname' />
                        </Form.Item>
                    </div>
                    <div className='w-full'>
                        <Form.Item label="Lastname" name="lastname" required>
                            <RMSInput placeholder='Lastname' />
                        </Form.Item>
                    </div>
                </div>

                <Form.Item name="type" initialValue="Customer" hidden>

                </Form.Item>

                <div className="flex space-x-2">
                    <div className='w-full'>
                        <Form.Item label="Phone" name="phone" required>
                            <RMSInput placeholder='Phone' />
                        </Form.Item>
                    </div>
                    <div className='w-full'>
                        <Form.Item label="Email" name="email" required>
                            <RMSInput placeholder='Email' />
                        </Form.Item>
                    </div>
                </div>

                <div className="flex space-x-2">
                    <div className='w-full'>
                        <Form.Item label="Birthday" name="birthday">
                            <RMSDatePicker className='w-full' />
                        </Form.Item>
                    </div>
                    <div className="w-full">
                        <Form.Item
                            label='Source'
                            name='source'
                            required
                            rules={[
                                {
                                    required: true,
                                    message: "Please choose a source!",
                                },
                            ]}
                        >
                            <Select>
                                <Select.Option value='At Restaurant'>
                                    At Restaurant
                                </Select.Option>
                                <Select.Option value='Tiktok'>
                                    Tiktok
                                </Select.Option>
                                <Select.Option value='Facebook'>
                                    Facebook
                                </Select.Option>
                                <Select.Option value='Subcriptions'>
                                    Subcriptions
                                </Select.Option>
                            </Select>
                        </Form.Item>
                    </div>
                </div>

                <div className='w-full'>
                    <Form.Item label="Description" name="description">
                        <TextArea placeholder='Description about this custome' />
                    </Form.Item>
                </div>
            </Form>
        </CustomModal>
    </main >
}