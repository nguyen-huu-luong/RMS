import { UploadOutlined } from "@ant-design/icons"
import { Button, Form, Select, Upload } from "antd"
import { FormInstance, useForm } from "antd/es/form/Form"
import { useState } from "react"
import RMSInput from "../inputs/RMSInput"
import RMSDatePicker from "../inputs/RMSDatePicker"

interface ICreateCustomerFormRProps {
    onCreate: (values:any) => Promise<void>,
    formControl: FormInstance<any>
}

export const CreateCustomerForm: React.FC<ICreateCustomerFormRProps> = ({ ...props }) => {
    const[loading, setLoading] = useState(false)
    const handleSubmit = async (values: any) => {
        setLoading(true)
        await props.onCreate(values) ;
        setLoading(false)

        props.formControl.resetFields()
    }
    return <>
        <Form
            variant="filled"
            layout="vertical"
            onFinish={handleSubmit}
        >
            {/* <Form.Item
                name="upload-avatar"
                label="Avatar"
                valuePropName="fileList"
                getValueFromEvent={normFile}
            >
                <Upload name="avatar" action="/upload.do" listType="picture">
                    <Button icon={<UploadOutlined />} />
                </Upload>
            </Form.Item> */}

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
                <div className='w-full'>
                    <Form.Item label="Source" name="sourse">
                        <Select>
                            <Select.Option value="demo">Demo</Select.Option>
                        </Select>
                    </Form.Item>
                </div>
            </div>

            <div className='w-full'>
                <Form.Item label="Description" name="description">
                    <RMSDatePicker className='w-full' />
                </Form.Item>
            </div>

            {/* <Form.Item>
                <div className='flex justify-end space-x-2'>
                    <Button type="default" htmlType="reset">
                        Clear
                    </Button>
                    <Button 
                        type="primary" 
                        htmlType="submit" 
                        loading={loading}
                        style={{ backgroundColor: "#4A58EC", color: "white" }}
                    >
                        Save
                    </Button>
                </div>
            </Form.Item> */}
        </Form>
    </>
}