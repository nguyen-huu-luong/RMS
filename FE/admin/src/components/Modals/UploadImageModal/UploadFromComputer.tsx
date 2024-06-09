"use client"
import React from 'react';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { message, Upload } from 'antd';
import axios from 'axios'
import { uploadImage } from '@/app/api/upload';

const { Dragger } = Upload;

interface IUploadFromComputerProps {
    onUploadedImage: (url:string) => void
}

const UploadFromComputer: React.FC<IUploadFromComputerProps> = ({onUploadedImage}) => {

    const handleUploadImage = async ({
        file,
        onSuccess,
    }: {
        file?: any;
        onSuccess?: any;
    }) => {
        try {
            // const url = "http://localhost:3000/api/upload"
            const data = await uploadImage(file);
            console.log(data)
            if (data.url) {
                onUploadedImage(data.url)
                onSuccess("ok");
            } else   throw new Error("Not Found iamge url")
        } catch (error) {
            throw error
        }
    };
    const props: UploadProps = {
        name: 'file',
        customRequest: handleUploadImage,

        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    return (
        <Dragger {...props}>
            <p className="ant-upload-drag-icon">
                <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">
                Support for a single or bulk upload. Strictly prohibited from uploading company data or other
                banned files.
            </p>
        </Dragger>)

    };

export default UploadFromComputer;