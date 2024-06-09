"use client"
import { useState } from 'react';
import { Button, Modal, Form, Input, Upload, message, UploadFile } from 'antd';
import type { UploadProps } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import { uploadImage } from '@/app/api/upload';
import fetchClient from '@/lib/fetch-client';
import { useLocale, useTranslations } from "next-intl";

const CreateCategory = ({ isCreate, setIsCreate, setIsReFetch, data }: { isCreate: any, setIsCreate: any, setIsReFetch: any, data: any }) => {

    const [form_create_category] = Form.useForm();
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
        form_create_category.setFieldValue("image", data.url)
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
        form_create_category.resetFields()
        setIsCreate(false)
    }

    const handleCreate = async () => {
        const data_body = {
            name: form_create_category.getFieldValue("category_name"),
            description: form_create_category.getFieldValue("description"),
            thumnails: form_create_category.getFieldValue("image")
        }
        console.log(data_body)
        await fetchClient({ method: "POST", url: "/categories", body: data_body })
        form_create_category.resetFields()
        setIsCreate(false)
        setIsReFetch((current: any) => !current)
    }

    const handleRemove = async () => {
        form_create_category.setFieldValue("image", "")
    }

    return (
        <>

            <Modal title={t_product('category_information')} open={isCreate} onCancel={handleCancel} destroyOnClose={true} footer={(_, { OkBtn, CancelBtn }) => (<></>)}>
                <Form form={form_create_category} name="basic" onFinish={handleCreate}>
                    <div className='relative'>
                        <div className='flex justify-between'>
                            <div style={{ width: "48%" }}>
                                <p>
                                {t_general('name')}
                                </p>
                                <Form.Item
                                    name="category_name"
                                    rules={[{ required: true, message: 'Please input the category name !' },
                                    {
                                        message: 'This category already exists',
                                        validator: (_, value) => {
                                            const temp_value = value ? value.trim() : "" 
                                            if ( data.some((e: any) => e.name == temp_value)) {
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
                                {t_general('description')}
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
                                    accept="image/*"
                                    listType="picture"
                                    maxCount={1}
                                    onRemove={handleRemove}
                                >
                                    <Button icon={<UploadOutlined />}>{t_product('upload_icon')}</Button>
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

export default CreateCategory