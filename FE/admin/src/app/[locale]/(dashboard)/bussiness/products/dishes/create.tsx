"use client"
import { useState } from 'react';
import { Button, Modal, Form, Input, Upload, message, UploadFile, Select, InputNumber } from 'antd';
import type { UploadProps } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import { uploadImage } from '@/app/api/upload';
import fetchClient from '@/lib/fetch-client';

const CreateProduct = ({ isCreate, setIsCreate, setIsReFetch, data, category }: { isCreate: any, setIsCreate: any, setIsReFetch: any, data: any, category: any }) => {

    const [form_create_product] = Form.useForm();

    const handleUpload = async ({
        file,
        onSuccess,
    }: {
        file?: any;
        onSuccess?: any;
    }) => {
        const data = await uploadImage(file, "Dish");
        form_create_product.setFieldValue("image", data.url)
        onSuccess("ok");
    };

    const props: UploadProps = {
        name: "image",
        customRequest: handleUpload,
        onChange(info) {
            if (info.file.status === "done") {
                message.success(`Change icon successfully`);
            } else if (info.file.status === "error") {
                message.error(`Change icon failed.`);
            }
        },
    };

    const handleCancel = () => {
        form_create_product.resetFields()
        setIsCreate(false)
    }

    const handleCreate = async () => {
        const data_body = {
            name: form_create_product.getFieldValue("product_name"),
            description: form_create_product.getFieldValue("description"),
            price: form_create_product.getFieldValue("price"),
            thumbnails: form_create_product.getFieldValue("image"),
            categoryId: form_create_product.getFieldValue("category")
        }
        console.log(data_body)
        await fetchClient({ method: "POST", url: "/products", body: data_body })
        form_create_product.resetFields()
        setIsCreate(false)
        setIsReFetch((current: any) => !current)
    }

    const handleRemove = async () => {
        form_create_product.setFieldValue("image", "")
    }

    return (
        <>

            <Modal title="Product Information" open={isCreate} onCancel={handleCancel} destroyOnClose={true} footer={(_, { OkBtn, CancelBtn }) => (<></>)}>
                <Form form={form_create_product} name="basic" onFinish={handleCreate} >
                    <div className='relative'>
                        <div className='flex justify-between'>
                            <div style={{ width: "48%" }}>
                                <p>
                                    Name
                                </p>
                                <Form.Item
                                    name="product_name"
                                    rules={[{ required: true, message: 'Please input the product name !' },
                                    {
                                        message: 'This product already exists',
                                        validator: (_, value) => {
                                            const temp_value = value ? value.trim() : ""
                                            if (data.some((e: any) => e.name == temp_value)) {
                                                return Promise.reject("This product already exists");
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
                                    Category
                                </p>
                                <Form.Item
                                    name="category"
                                    rules={[{ required: true, message: 'Please input category !' }]}>
                                    <Select allowClear>
                                        {
                                            category.map((item: any) => <Select.Option value={item.id}>{item.name}</Select.Option>)
                                        }
                                    </Select>
                                </Form.Item>
                            </div>
                        </div>
                        <div>
                            <p>
                                Description
                            </p>
                            <Form.Item name="description"
                                rules={[{ required: true, message: 'Please input the product description !' }]}>
                                <Input />
                            </Form.Item>
                        </div>

                        <div className='flex justify-between'>
                            <div style={{ width: "48%" }}>
                                <p>
                                    Icon
                                </p>
                                <Form.Item name="upload">
                                    <Upload
                                        {...props}
                                        listType="picture"
                                        maxCount={1}
                                        onRemove={handleRemove}
                                    >

                                        <Button style={{ width: "100% !important" }} icon={<UploadOutlined />}>Upload Icon</Button>
                                    </Upload>
                                </Form.Item>
                            </div>
                            <div style={{ width: "48%" }}>
                                <p>
                                    Price
                                </p>
                                <Form.Item
                                    name="price"
                                    rules={[{ required: true, message: 'Please input the price !' }]}>
                                    <InputNumber min={1} style={{ width: "100%" }} />
                                </Form.Item>
                            </div>

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

export default CreateProduct