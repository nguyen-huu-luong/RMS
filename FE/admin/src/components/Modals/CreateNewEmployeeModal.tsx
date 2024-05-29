import { Button, Checkbox, DatePicker, Form, FormInstance, Input, InputNumber, Modal, Popconfirm, Select, message } from "antd"
import { CustomModal } from "../Modals/MyCustomModal";
import { useState } from "react"
import RMSInput from "../inputs/RMSInput"
import RMSDatePicker from "../inputs/RMSDatePicker"
import useModal from "antd/es/modal/useModal";
import styled from "styled-components";
import { useLocale, useTranslations } from "next-intl";


export interface ICreateModal {
    formControl: FormInstance<any>
    onCreate: (values: any) => Promise<void>,
}
const FormItemHorizontal = styled(Form.Item)`
  .ant-row.ant-form-item-row {
    flex-direction: row;
  }
  
  .ant-form-item-label {
    white-space: nowrap;
    text-align: end;
    padding: 0;
  }

  .ant-form-item-control {
    flex: 1 1 0;
    min-width: 0;
  }
  
  .ant-form-item-label > label {
    height: 32px;
    
    &::after {
      display: block;
      content: ':';
      position: relative;
      margin-block: 0;
      margin-inline-start: 2px;
      margin-inline-end: 8px;
    }
  }
`

export const CreateaEmployeeModal: React.FC<ICreateModal> = ({ formControl, ...props }) => {
    const t_general: any = useTranslations("General")
    const t_customer: any = useTranslations("Customer")
    const t_employee: any = useTranslations("Employee")
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
            message.success("Create employee successfully")
            setOpen(false)
            setLoading(false)
        } catch (error) {
            setLoading(false)
        }
    }

    return <main className="ms-auto">
        <Button onClick={showModal}>{t_general("new")}</Button>
        <CustomModal
            open={open}
            title={t_employee("add_new_employee")}
            okType="primary"
            okButtonProps={{ className: "bg-primary" }}
            onCancel={handleCancel}
            onOk={handleOk}
            width={800}
            okText={t_general("confirm")}
            confirmLoading={loading}
            footer={(_, { OkBtn, CancelBtn }) => (
                <>
                    <Popconfirm title="Are you sure to reset all data?" onConfirm={handleCancel}>
                        <Button>{t_general("cancel")}</Button>
                    </Popconfirm>
                    <OkBtn />
                </>
            )}
        >
            <Form form={formControl} layout="vertical" style={{ maxWidth: 1000 }} onFinish={handleFormSubmit}>

                <div className="flex space-x-2">
                    <div className='w-full'>
                        <Form.Item 
                            label={t_employee("username")} name="username" required 
                            rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                            <RMSInput />
                        </Form.Item>
                        <div className="w-full">
                            <Form.Item
                                label={t_employee("role")}
                                name='role'
                                required
                                rules={[
                                    {
                                        required: true,
                                        message: "Please choose a role!",
                                    },
                                ]}
                            >
                                <Select className="border-[#ccc]">
                                    <Select.Option value='manager'>
                                    {t_employee("manager")}
                                    </Select.Option>
                                    <Select.Option value='staff'>
                                    {t_employee("staff")}
                                    </Select.Option>
                                    <Select.Option value='chef'>
                                    {t_employee("chef")}
                                    </Select.Option>
                                </Select>
                            </Form.Item>

                        </div>
                    </div>
                    <div className="w-full">
                        <Form.Item
                            name="password"
                            label={t_employee("password")}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                            ]}
                            hasFeedback
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            name="confirm"
                            label={t_employee("confirm_password")}
                            dependencies={['password']}
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: 'Please confirm your password!',
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('The new password that you entered do not match!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>
                    </div>
                </div>
                <div className="flex space-x-2">
                    <div className='w-full'>
                        <Form.Item label={t_general('firstname')} name="firstname" required>
                            <RMSInput placeholder='Firstname' />
                        </Form.Item>
                    </div>
                    <div className='w-full'>
                        <Form.Item label={t_general('lastname')} name="lastname" required>
                            <RMSInput placeholder='Lastname' />
                        </Form.Item>
                    </div>
                </div>

                <div className="flex space-x-2">
                    <div className='w-full'>
                        <Form.Item label={t_general('phone')} name="phone" required>
                            <RMSInput placeholder='Phone' />
                        </Form.Item>
                    </div>
                    <div className='w-full'>
                        <Form.Item label={t_general('email')} name="email" required>
                            <RMSInput placeholder='Email' />
                        </Form.Item>
                    </div>
                </div>

                <div className="flex space-x-2 items-end">
                    <div className='w-full'>
                        <Form.Item label={t_general('birthday')} name="birthday">
                            <DatePicker className='w-full border-[#ccc]' />
                        </Form.Item>
                    </div>
                    <div className="w-full">
                        <FormItemHorizontal label={t_employee('active')} labelAlign="left" name="isActive">
                            <Checkbox />
                        </FormItemHorizontal>
                    </div>
                </div>
            </Form>
        </CustomModal>
    </main >
}