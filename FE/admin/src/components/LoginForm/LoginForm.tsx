"use client";
import { LockOutlined, MailOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Checkbox, ConfigProvider, Form, Input, message } from "antd";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next-intl/link";
import { useRouter } from "next-intl/client";
import { useState } from "react";
import { useLocale } from "next-intl";
import { signOut } from "next-auth/react";
import variables from "@/app/variables.module.scss";

export const LoginForm: React.FC = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState<boolean>();
    const router = useRouter();
    const locale = useLocale();
    const onFinish = async (values: any) => {
        setLoading(true);
        console.log("Received values of form: ", values);
        let result = await signIn("credentials", {
            ...values,
            redirect: true,
        });
        setLoading(false);
        if (result && !result.ok) {
            if (result.error) {
                const error = JSON.parse(result.error);
                showError(`${error?.name}: ${error.message}`);
                console.log(error);
            }
        } else {
            router.push("/profile");
        }
    };
    const signInGoogle = () => {
        signIn("google", {
            redirect: true,
        });
    };
    const showError = (message?: string) => {
        messageApi.open({
            type: "error",
            content: message || "This is an error message",
        });
    };
    return (
        <>
            {contextHolder}
            <ConfigProvider
                theme={{
                    token: {
                        colorPrimary: `${variables.primaryColor}`,
                        colorTextSecondary: "rgb(255, 247, 237)",
                        colorLinkHover: `${variables.primaryColor}`,
                    },
                    components: {
                        Input: {
                            paddingBlock: 8,
                        },
                        Form: {
                            verticalLabelMargin: 4,
                            itemMarginBottom: 8,
                        },
                    },
                }}
            >
                <Form
                    name='normal_login'
                    className='login-form w-full px-8 py-4 max-w-[400px] bg-white shadow-lg rounded-xl border-0'
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    layout='vertical'
                >
                    <div className='text-center w-full'>
                        <h3 className='text-xl font-bold my-2'>Sign in</h3>
                        <p> Sign in to stay connected</p>
                    </div>
                    <Form.Item
                        name='username'
                        label='Username'
                        rules={[
                            {
                                required: true,
                                message: "Please input your username!",
                            },
                        ]}
                        className='shadow-none py-2'
                    >
                        <Input
                            prefix={
                                <MailOutlined className='site-form-item-icon' />
                            }
                            placeholder='Username'
                        />
                    </Form.Item>
                    <Form.Item
                        name='password'
                        rules={[
                            {
                                required: true,
                                message: "Please input your Password!",
                            },
                        ]}
                        label={<div>Password</div>}
                    >
                        <Input.Password
                            prefix={
                                <LockOutlined className='site-form-item-icon' />
                            }
                            type='password'
                            placeholder='Password'
                        />
                    </Form.Item>
                    <Form.Item>
                        <div className='flex flex-row justify-between items-center'>
                            <Form.Item
                                name='remember'
                                valuePropName='checked'
                                className='m-0'
                            >
                                <Checkbox>Remember me</Checkbox>
                            </Form.Item>

                            <a
                                className='login-form-forgot hover:text-primary'
                                href=''
                            >
                                Forgot password?
                            </a>
                        </div>
                    </Form.Item>
                    <Form.Item>
                        <Button
                            htmlType='submit'
                            type='primary'
                            className='login-form-button bg-primary w-full flex items-center justify-center'
                        >
                            {loading && <ReloadOutlined spin={true} />} Log in
                        </Button>
                    </Form.Item>
                    <div className='flex flex-row items-center space-x-4 my-2'>
                        <div className='h-[1px] w-full bg-primary line'></div>
                        {/* <span>Or</span>
                        <div className='h-[1px] w-full bg-primary line'></div> */}
                    </div>
                    {/* <div className='flex gap-4'>
                        <Button
                            className='w-full flex items-center justify-center'
                            onClick={signInGoogle}
                        >
                            <Image
                                src={"/google-icon.webp"}
                                width={24}
                                height={24}
                                alt=''
                                className='me-2'
                            />
                            <span>Google</span>
                        </Button>
                        <Button className='w-full flex items-center justify-center'>
                            <img
                                src={"/Facebook.png"}
                                width={24}
                                height={24}
                                alt=''
                                className='me-2'
                            />
                            <span>Facebook</span>
                        </Button>
                    </div> */}
                </Form>
            </ConfigProvider>
        </>
    );
};
