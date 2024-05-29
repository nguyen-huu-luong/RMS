import { Form, FormInstance, Select, message } from "antd";
import { AxiosError } from "axios";
import { ReactNode, useState } from "react";
import RMSInput from "../inputs/RMSInput";
import RMSDatePicker from "../inputs/RMSDatePicker";
import TextArea from "antd/es/input/TextArea";
import Link from "next/link";

export interface ICreateModal {
    formControl: FormInstance<any>;
    onCreate: (values: any) => Promise<void>;
}

export const CreateNewLeadForm: React.FC<ICreateModal> = ({ formControl, onCreate }) => {
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [boxInformation, setBoxInformation] = useState<ReactNode>(<></>);

    const handleFormSubmit = async (values: any) => {
        setErrorMsg("");
        setBoxInformation(<></>);
        setLoading(true);
        try {
            await onCreate(values);
            message.success("Create lead successfully");
            formControl.resetFields();
        } catch (error) {
            setLoading(false);
            if (!(error instanceof AxiosError)) {
                throw error;
            } else {
                if (error.response && error.response.data.name !== "Conflict") {
                    setErrorMsg(error.response.data.message || "Đã xảy ra lỗi");
                } else {
                    const message = error.response ? error.response.data.message : "";
                    if (message) {
                        const regex = /id=<([^>]*)>/;
                        const match = message.match(regex);
                        if (match) {
                            setBoxInformation(
                                <div className="flex items-center p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400" role="alert">
                                    <span className="font-medium">Found user with email={formControl.getFieldValue("email")}</span>
                                    <Link className="ms-3" href={`/leads/${match[1]}`}>View profile</Link>
                                </div>
                            );
                        }
                    }
                }
            }
        }
        setLoading(false);
    };

    return (
        <>
            <Form variant="filled" form={formControl} layout="vertical" style={{ maxWidth: 1000 }} onFinish={handleFormSubmit}>
                <div className="flex space-x-2">
                    <div className='w-full'>
                        <Form.Item
                            label='Firstname'
                            name='firstname'
                            required
                            rules={[
                                {
                                    required: true,
                                    message: "Please input user firstname!",
                                },
                            ]}
                        >
                            <RMSInput placeholder='Firstname' />
                        </Form.Item>
                    </div>
                    <div className='w-full'>
                        <Form.Item
                            label='Lastname'
                            name='lastname'
                            required
                            rules={[
                                {
                                    required: true,
                                    message: "Please input user lastname!",
                                },
                            ]}
                        >
                            <RMSInput placeholder='Lastname' />
                        </Form.Item>
                    </div>
                </div>

                <Form.Item name="type" initialValue="lead" hidden />

                <div className="flex space-x-2">
                    <div className='w-full'>
                        <Form.Item
                            label='Phone'
                            name='phone'
                            rules={[
                                {
                                    pattern: /^(\+?\d{1,3}[- ]?)?\d{10}$/,
                                    message:
                                        "Please enter a valid phone number!",
                                },
                            ]}
                        >
                            <RMSInput placeholder='Phone' />
                        </Form.Item>
                    </div>
                    <div className='w-full'>
                        <Form.Item
                            label='Email'
                            name='email'
                            required
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your email!",
                                },
                                {
                                    type: "email",
                                    message:
                                        "Please enter a valid email address!",
                                },
                            ]}
                        >
                            <RMSInput placeholder='Email' />
                        </Form.Item>
                    </div>
                </div>

                <div className="flex space-x-2">
                    <div className='w-full'>
                        <Form.Item label="Birthday" name="birthday">
                            <RMSDatePicker className='w-full' />
                        </Form.Item>
                    </div>
                    <div className="w-full">
                        <Form.Item
                            label='Source'
                            name='source'
                            required
                            rules={[
                                {
                                    required: true,
                                    message: "Please choose a source!",
                                },
                            ]}
                        >
                            <Select>
                                <Select.Option value='At Restaurant'>
                                    At Restaurant
                                </Select.Option>
                                <Select.Option value='Tiktok'>
                                    Tiktok
                                </Select.Option>
                                <Select.Option value='Facebook'>
                                    Facebook
                                </Select.Option>
                                <Select.Option value='Subscriptions'>
                                    Subscriptions
                                </Select.Option>
                            </Select>
                        </Form.Item>
                    </div>
                </div>
            </Form>
            {errorMsg && <p className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400">
                Error message response from server: {errorMsg}
            </p>}
            {boxInformation}
        </ >
    );
};