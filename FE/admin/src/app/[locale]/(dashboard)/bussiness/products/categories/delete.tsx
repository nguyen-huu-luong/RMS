"use client"
import { useState } from 'react';
import { Button, Modal, Form, Input, Upload, message, UploadFile } from 'antd';
import type { UploadProps } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import { uploadImage } from '@/app/api/upload';
import fetchClient from '@/lib/fetch-client';

const DeleteItem = ({ isDelete, setIsDelete, currentItem, setIsReFetch }: { isDelete: any, setIsDelete: any, currentItem: any, setIsReFetch: any }) => {
    const handleDelete =  async () => {
        await fetchClient({ url: `/categories/${currentItem.id}`, method: "DELETE" })
        setIsReFetch((current: any) => !current)
        setIsDelete(false)
    }
    return (
        <>
            <Modal open={isDelete} onCancel={() => setIsDelete(false)} destroyOnClose={true} footer={(_, { OkBtn, CancelBtn }) => (<></>)}>
                <Form>
                    <div>
                        <p className='mt-5 text-center' style={{ fontSize: "18px" }}>Are you sure to delete this category?</p>
                    </div>
                    <div >
                        <Form.Item >
                            <div className='flex justify-center mt-6' style={{ width: "100%" }}>
                                <div className='pr-3'>
                                    <Button style={{ backgroundColor: "#989898", color: "white" }} htmlType="button" onClick={() => setIsDelete(false)}>CANCEL</Button>
                                </div>
                                <div>
                                    <Button style={{ backgroundColor: "#DB3A34", color: "white" }} htmlType="button" onClick={handleDelete}>CONFIRM</Button>
                                </div>
                            </div>
                        </Form.Item>
                    </div>
                </Form>
            </Modal>
        </>
    )
}

export default DeleteItem