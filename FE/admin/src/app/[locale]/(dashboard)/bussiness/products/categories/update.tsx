"use client"
import { useState } from 'react';
import { Button, Modal, Form, Input, Upload, message, UploadFile } from 'antd';
import type { UploadProps } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import { uploadImage } from '@/app/api/upload';
import fetchClient from '@/lib/fetch-client';

const UpdateCategory = ({ isUpdate, setIsUpdate, setIsReFetch, currentItem, data }: { isUpdate: any, setIsUpdate: any, setIsReFetch: any,  currentItem:any,data: any }) => {

    const [form_update_category] = Form.useForm();
    const real_name = currentItem?.name
    
    form_update_category.setFields([{name: "category_name", value: currentItem?.name}, {name: "description", value: currentItem?.description }])

    const handleUpload = async ({
        file,
        onSuccess,
    }: {
        file?: any;
        onSuccess?: any;
    }) => {
        const data = await uploadImage(file, "Dish");
        form_update_category.setFieldValue("image", data.url)
        onSuccess("ok");
    };

    let props: UploadProps

    if(currentItem && (currentItem?.thumnails != null && currentItem?.thumnails != "")) {
        console.log(currentItem?.thumnails)
        const pros_temp: UploadProps = {
            name: "image",
            customRequest: handleUpload,
            onChange(info) {
                if (info.file.status === "done") {
                    message.success(`Change icon successfully`);
                } else if (info.file.status === "error") {
                    message.error(`Change icon failed.`);
                }
            },
            defaultFileList: [
                {
                  uid: '1',
                  name: 'icon.png',
                  status: 'done',
                  url: currentItem?.thumnails,
                },
            ]
        };
        props = pros_temp
    }
    else {
        const pros_temp: UploadProps = {
            name: "image",
            customRequest: handleUpload,
            onChange(info) {
                if (info.file.status === "done") {
                    message.success(`Change icon successfully`);
                } else if (info.file.status === "error") {
                    message.error(`Change icon failed.`);
                }
            }
        };
        props = pros_temp
    }

    const handleCancel = () => {
        form_update_category.resetFields()
        setIsUpdate(false)
    }

    const handleUpdate = async () => {
        const data_body = {
            name: form_update_category.getFieldValue("category_name"),
            description: form_update_category.getFieldValue("description"),
            thumnails: form_update_category.getFieldValue("image")
        }
        console.log(data_body)
        await fetchClient({ method: "PUT", url: `/categories/${currentItem?.id}`, body: data_body })
        form_update_category.resetFields()
        setIsUpdate(false)
        setIsReFetch((current: any) => !current)
    }

    const handleRemove = async () => {
        form_update_category.setFieldValue("image", "")
    }

    return (
        <>

            <Modal title="Category Information Detail" open={isUpdate} onCancel={handleCancel} destroyOnClose={true} footer={(_, { OkBtn, CancelBtn }) => (<></>)}>
                <Form form={form_update_category} name="basic"  onFinish={handleUpdate}>
                    <div className='relative'>
                        <div className='flex justify-between'>
                            <div style={{ width: "48%" }}>
                                <p>
                                    Name
                                </p>
                                <Form.Item
                                    name="category_name"
                                    rules={[{ required: true, message: 'Please input the category name !' },
                                    {
                                        message: 'This category already exists',
                                        validator: (_, value) => {
                                            const temp_value = value.trim() 
                                            if (temp_value != real_name && data.some((e: any) => e.name == temp_value)) {
                                                return Promise.reject("This category already exists");
                                            } else {
                                                return Promise.resolve();
                                            }
                                        }
                                    }
                                    ]}>
                                    <Input />
                                </Form.Item>
                            </div>
                            <div style={{ width: "48%" }}>
                                <p>
                                    Description
                                </p>
                                <Form.Item
                                    name="description"
                                    rules={[{ required: true, message: 'Please input category description !' }]}>
                                    <Input />
                                </Form.Item>
                            </div>
                        </div>
                        <div style={{ marginTop: "-2px" }}>
                            <Form.Item name="upload">
                                <Upload
                                    {...props}
                                    listType="picture"
                                    maxCount={1}
                                    onRemove={handleRemove}
                                >
                                    <Button icon={<UploadOutlined />}>Upload Icon</Button>
                                </Upload>
                            </Form.Item>
                        </div>
                        <div className='hidden'>
                            <Form.Item
                                name="image">
                                <Input />
                            </Form.Item>
                        </div>
                    </div>
                    <div >
                        <Form.Item >
                            <div className='flex justify-end mt-3' style={{ width: "100%" }}>
                                <div className='pr-3'>
                                    <Button style={{ backgroundColor: "#989898", color: "white" }} htmlType="button" onClick={handleCancel}>CANCEL</Button>
                                </div>
                                <div>
                                    <Button style={{ backgroundColor: "#4A58EC", color: "white" }} htmlType="submit">CHANGE</Button>
                                </div>
                            </div>
                        </Form.Item>
                    </div>
                </Form>
            </Modal>

        </>
    )
}

export default UpdateCategory