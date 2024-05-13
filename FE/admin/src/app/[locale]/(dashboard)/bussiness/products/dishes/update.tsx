"use client"
import { useState } from 'react';
import { Button, Modal, Form, Input, Upload, message, UploadFile, Select, InputNumber } from 'antd';
import type { UploadProps } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import { uploadImage } from '@/app/api/upload';
import fetchClient from '@/lib/fetch-client';

const UpdateProduct = ({ isUpdate, setIsUpdate, setIsReFetch, currentItem, data, category }: { isUpdate: any, setIsUpdate: any, setIsReFetch: any, currentItem: any, data: any, category: any }) => {

    const [form_update_product] = Form.useForm();
    const real_name = currentItem?.name

    form_update_product.setFields([{ name: "product_name", value: currentItem?.name }, { name: "description", value: currentItem?.description },
                                     { name: "category", value: currentItem?.categoryId }, { name: "price", value: currentItem?.price }])

    const handleUpload = async ({
        file,
        onSuccess,
    }: {
        file?: any;
        onSuccess?: any;
    }) => {
        const data = await uploadImage(file, "Dish");
        form_update_product.setFieldValue("image", data.url)
        onSuccess("ok");
    };

    let props: UploadProps

    if (currentItem && (currentItem?.thumbnails != null && currentItem?.thumbnails != "")) {
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
                    url: currentItem?.thumbnails,
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
        form_update_product.resetFields()
        setIsUpdate(false)
    }

    const handleUpdate = async () => {
        const data_body = {
            name: form_update_product.getFieldValue("product_name"),
            description: form_update_product.getFieldValue("description"),
            price: form_update_product.getFieldValue("price"),
            thumbnails: form_update_product.getFieldValue("image"),
            categoryId: form_update_product.getFieldValue("category")
        }
        console.log(data_body)
        await fetchClient({ method: "PUT", url: `/products/${currentItem?.id}`, body: data_body })
        form_update_product.resetFields()
        setIsUpdate(false)
        setIsReFetch((current: any) => !current)
    }

    const handleRemove = async () => {
        form_update_product.setFieldValue("image", "")
    }

    return (
        <>

            <Modal title="Product Information" open={isUpdate} onCancel={handleCancel} destroyOnClose={true} footer={(_, { OkBtn, CancelBtn }) => (<></>)}>
                <Form form={form_update_product} name="basic" onFinish={handleUpdate} >
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
                                            if (temp_value != real_name && data.some((e: any) => e.name == temp_value)) {
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
                                        accept="image/*"
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

export default UpdateProduct