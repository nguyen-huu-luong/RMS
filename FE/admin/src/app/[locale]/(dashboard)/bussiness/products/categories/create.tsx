import { Button, Modal, Form, Input, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const CreateCategory = ({ isCreate, setIsCreate }: { isCreate: any, setIsCreate: any }) => {

    const [form_create_category] = Form.useForm();

    const handleCancel = () => {
        setIsCreate(false)
        form_create_category.resetFields()
    }

    const handleCreate = () => {

    }

    return (
        <>

            <Modal title="Category Information" open={isCreate} onCancel={handleCancel} footer={(_, { OkBtn, CancelBtn }) => (<></>)}>
                <Form form={form_create_category} name="basic" onFinish={handleCreate}>
                    <div className='relative'>
                        <div className='flex justify-between'>
                            <div style={{ width: "48%" }}>
                                <p>
                                    Name
                                </p>
                                <Form.Item
                                    name="customer_name"
                                    rules={[{ required: true, message: 'Please input the customer name !' }]}>
                                    <Input />
                                </Form.Item>
                            </div>
                            <div style={{ width: "48%" }}>
                                <p>
                                    Description
                                </p>
                                <Form.Item
                                    name="phone_number"
                                    rules={[{ required: true, message: 'Please input phone number !' }]}>
                                    <Input />
                                </Form.Item>
                            </div>
                        </div>
                        <div style={{ marginTop: "-15px" }}>
        
                                <Upload
                                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                    listType="picture"
                                    maxCount={1}
                                >
                                    <Button icon={<UploadOutlined />}>Upload Icon</Button>
                                </Upload>
                        </div>
                    </div>
                    <div >
                        <Form.Item >
                            <div className='flex justify-end mt-3' style={{ width: "100%" }}>
                                <div className='pr-3'>
                                    <Button style={{ backgroundColor: "#989898", color: "white" }} onClick={handleCancel}>CANCEL</Button>
                                </div>
                                <div>
                                    <Button style={{ backgroundColor: "#4A58EC", color: "white" }} htmlType="submit">CONFIRM</Button>
                                </div>
                            </div>
                        </Form.Item>
                    </div>
                </Form>
            </Modal>

        </>
    )
}

export default CreateCategory