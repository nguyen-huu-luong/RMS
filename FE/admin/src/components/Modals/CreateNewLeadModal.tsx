import { CloseOutlined, ExpandAltOutlined, InfoCircleFilled } from "@ant-design/icons"
import { Button, DatePicker, Form, FormInstance, Input, InputNumber, Modal, Popconfirm, Select, Tooltip, message } from "antd"
import { createStyles } from "antd-style";
import { CustomModal } from "./MyCustomModal";
import { UploadOutlined } from "@ant-design/icons"
import { ReactNode, useState } from "react"
import RMSInput from "../inputs/RMSInput"
import RMSDatePicker from "../inputs/RMSDatePicker"
import useModal from "antd/es/modal/useModal";
import TextArea from "antd/es/input/TextArea";
import { AxiosError } from "axios";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";


export interface ICreateModal {
    formControl: FormInstance<any>
    onCreate: (values: any) => Promise<void>,
}
export const CreateNewLeadModal: React.FC<ICreateModal> = ({ formControl, ...props }) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false)
    const [modal] = useModal()
    const [errorMsg, setErrorMsg] = useState("")
    const [boxInformation, setBoxInformation] = useState<ReactNode>(<></>)
    const t_general: any = useTranslations("General")
	const t_lead: any = useTranslations("Lead")
    const showModal = () => {
        setOpen(true);
    };

    const handleCancel = () => {
        formControl.resetFields()
        setBoxInformation(<></>)
        setOpen(false);
    };

    const handleOk = () => {
        formControl.submit()
    }

    const handleFormSubmit = async (values: any) => {
        setErrorMsg("")
        setBoxInformation(<></>)
        setLoading(true);
        try {
            await props.onCreate(values);
            message.success("Create lead successfully")
            setOpen(false)
            setLoading(false)
            formControl.resetFields()
        } catch (error) {
            setLoading(false)
            if (!(error instanceof AxiosError)) {
                throw error
            } else {
                if (error.response && error.response.data.name !== "Conflict") {
                    setErrorMsg(error.response.data.message || "Đã xảy ra lỗi")
                } else {
                    const message = error.response ? error.response.data.message : ""
                    if (message) {
                        const regex = /id=<([^>]*)>/;
                        const match = message.match(regex);
                        if (match) {
                            setBoxInformation(
                                <div className="flex items-center p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400" role="alert">
                                    <InfoCircleFilled className="me-3"/>
                                    <span className="font-medium">Found user with email={formControl.getFieldValue("email")}</span>
                                    <Link className="ms-3" href={`/leads/${match[1]}`}>View profile</Link>

                                    <Tooltip title="Close this message">
                                        <CloseOutlined className="ms-auto my-2" onClick={() => setBoxInformation(<></>)}/>
                                    </Tooltip>
                                   
                                </div>  
                            )
                        }
                    }
                }
            }
            // throw error;
        }
    }

    return <main className="ms-auto">
        <Button className="bg-white" onClick={showModal}>{t_general('new')}</Button>
        <CustomModal
            open={open}
            title={t_lead('add_new_lead')}
            okType="primary"
            okButtonProps={{ className: "bg-primary" }}
            onCancel={handleCancel}
            onOk={handleOk}
            okText={!errorMsg ? t_general("confirm") : "Try again"}
            width={800}
            confirmLoading={loading}
            destroyOnClose
            footer={(_, { OkBtn, CancelBtn }) => (
                <>
                    <Popconfirm title="Are you sure to reset all data?" onConfirm={handleCancel}>
                        <Button>{t_general('cancel')}</Button>
                    </Popconfirm>
                    <OkBtn />
                </>
            )}
        >
            <Form variant="filled" form={formControl} layout="vertical" style={{ maxWidth: 1000 }} onFinish={handleFormSubmit}>
                <div className="flex space-x-2">
                    <div className='w-full'>
                        <Form.Item
                            label={t_general('firstname')}
                            name='firstname'
                            required
                            rules={[
                                {
                                    required: true,
                                    message: "Please input user firstname!",
                                },
                            ]}
                        >
                            <RMSInput placeholder='Firstname' />
                        </Form.Item>
                    </div>
                    <div className='w-full'>
                        <Form.Item
                            label={t_general('lastname')}
                            name='lastname'
                            required
                            rules={[
                                {
                                    required: true,
                                    message: "Please input user lastname!",
                                },
                            ]}
                        >
                            <RMSInput placeholder='Lastname' />
                        </Form.Item>
                    </div>
                </div>

                <Form.Item name="type" initialValue="lead" hidden>

                </Form.Item>

                <div className="flex space-x-2">
                    <div className='w-full'>
                        <Form.Item
                            label={t_general('phone')}
                            name='phone'
                            rules={[
                                {
                                    pattern: /^(\+?\d{1,3}[- ]?)?\d{10}$/,
                                    message:
                                        "Please enter a valid phone number!",
                                },
                            ]}
                        >
                            <RMSInput placeholder='Phone' />
                        </Form.Item>
                    </div>
                    <div className='w-full'>
                        <Form.Item
                            label={t_general('email')}
                            name='email'
                            required
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your email!",
                                },
                                {
                                    type: "email",
                                    message:
                                        "Please enter a valid email address!",
                                },
                            ]}
                        >
                            <RMSInput placeholder='Email' />
                        </Form.Item>
                    </div>
                </div>

                <div className="flex space-x-2">
                    <div className='w-full'>
                        <Form.Item label={t_general('birthday')} name="birthday">
                            <RMSDatePicker className='w-full' />
                        </Form.Item>
                    </div>
                    <div className="w-full">
                        <Form.Item
                            label={t_general('source')}
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
                    <Form.Item label={t_general('address')} name="address">
                        <TextArea placeholder='Description about this custome' />
                    </Form.Item>
                </div>
            </Form>
            {errorMsg && <p className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400">
                Error message response from server: {errorMsg}
            </p>}
            {boxInformation}
        </CustomModal>
    </main >
}