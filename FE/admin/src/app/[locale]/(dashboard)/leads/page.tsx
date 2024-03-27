'use client'
import { useState } from "react";
import { Button, Modal, Form, Upload, message } from 'antd';
import UploadOutlined from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { uploadImage } from "@/app/api/upload";

function Home() {
	const [url_image, setURL] = useState("")
	
	const handleUpload = async ({ file, onSuccess }: { file?: any, onSuccess?: any }) => {
		const data = await uploadImage(file)
		onSuccess("ok");
		setURL(data.url)
	}

	const props: UploadProps = {
		name: 'file',
		customRequest: handleUpload,
		onChange(info) {
		if (info.file.status !== 'uploading') {
			console.log(info.file, info.fileList);
		}
		if (info.file.status === 'done') {
			message.success(`${info.file.name} file uploaded successfully`);
		} else if (info.file.status === 'error') {
			message.error(`${info.file.name} file upload failed.`);
		}
		},
	};

	return (
		<>
		<Upload {...props}>
			<Button icon={<UploadOutlined />}>Click to Upload</Button>
		</Upload>
		<p>URL: <a>{url_image}</a></p>
		</>
	);
}

export default Home;