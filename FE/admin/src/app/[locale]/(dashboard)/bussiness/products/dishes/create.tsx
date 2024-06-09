"use client"
import { useState } from 'react';
import { Button, Modal, Form, Input, Upload, message, UploadFile, Select, InputNumber } from 'antd';
import type { UploadProps } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import { uploadImage } from '@/app/api/upload';
import fetchClient from '@/lib/fetch-client';
import { useLocale, useTranslations } from "next-intl";

const CreateProduct = ({ isCreate, setIsCreate, setIsReFetch, data, category }: { isCreate: any, setIsCreate: any, setIsReFetch: any, data: any, category: any }) => {

    const [form_create_product] = Form.useForm();
    const t_product: any = useTranslations("Product")
    const t_general: any = useTranslations("General")

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

            <Modal title={t_product('product_information')} open={isCreate} onCancel={handleCancel} destroyOnClose={true} footer={(_, { OkBtn, CancelBtn }) => (<></>)}>
                <Form form={form_create_product} name="basic" onFinish={handleCreate} >
                    <div className='relative'>
                        <div className='flex justify-between'>
                            <div style={{ width: "48%" }}>
                                <p>
                                    {t_general('name')}
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
                                    {t_product('category')}
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
                                {t_general('description')}
                            </p>
                            <Form.Item name="description"
                                rules={[{ required: true, message: 'Please input the product description !' }]}>
                                <Input />
                            </Form.Item>
                        </div>

                        <div className='flex justify-between'>
                            <div style={{ width: "48%" }}>
                                <p>
                                {t_product('icon')}
                                </p>
                                <Form.Item name="upload">
                                    <Upload
                                        {...props}
                                        accept="image/*"
                                        listType="picture"
                                        maxCount={1}
                                        onRemove={handleRemove}
                                    >

                                        <Button style={{ width: "100% !important" }} icon={<UploadOutlined />}>{t_product('upload_icon')}</Button>
                                    </Upload>
                                </Form.Item>
                            </div>
                            <div style={{ width: "48%" }}>
                                <p>
                                {t_general('price')}
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
                                    <Button style={{ backgroundColor: "#989898", color: "white" }} htmlType="button" onClick={handleCancel}>{t_general('cancel').toUpperCase()}</Button>
                                </div>
                                <div>
                                    <Button style={{ backgroundColor: "#4A58EC", color: "white" }} htmlType="submit">{t_general('confirm').toUpperCase()}</Button>
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