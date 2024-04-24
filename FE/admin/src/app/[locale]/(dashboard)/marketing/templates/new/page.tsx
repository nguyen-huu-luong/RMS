"use client"
import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Input, message } from "antd";
import useEmailDataStore, { initialState } from "@/store/email";
import EmailTemplateEditor from "@/components/EmailTemplateComponents";
import fetchClient from "@/lib/fetch-client"

const CreateEmailTemplate: React.FC = () => {
	const { emailData, setEmailData, } = useEmailDataStore();

	useEffect(() => {
		setEmailData(initialState.emailData)
	}, [])


	const handleSave = async (values: any) => {
		console.log(values)
		const data = {
			name: values.name,
			description: "desscription",
			content: JSON.stringify(emailData),
			type: "email"
		}
		try {
			const response = await fetchClient({ method: "POST", url: "/message-templates", body: data })
			console.log('New email template added:', response.data);
			message.success('Email template added successfully');
		} catch (error) {
			console.error('Error adding Email template:', error);
			message.error('Failed to add Email template');
		}
	};

	return (
		<div className="w-full" >
			<Form className="bg-white border p-2 flex space-x-2 items-center" onFinish={handleSave} >
				<Form.Item
					name="name"
					rules={[{ required: true, message: 'Please input the name of email!' }]}
					className="m-0"
				>
					<Input placeholder="Enter the email name..." />
				</Form.Item>
				<Form.Item className="m-0">
					<Button type="primary" className="bg-primary" htmlType="submit">Save</Button>
				</Form.Item>
			</Form>
			<div className="my-4">
				<EmailTemplateEditor mode="edit" />
			</div>
		</div>
	);
};

export default CreateEmailTemplate;