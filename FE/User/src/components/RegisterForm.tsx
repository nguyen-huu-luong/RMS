"use client";
import React from "react";
import { Form, Input, Button, Radio, ConfigProvider, DatePicker } from "antd";
import axios, { AxiosError } from "axios";
import { register } from "module";
// import SignIn from '../[locale]/(auth)/signin/page';
import { signIn } from "next-auth/react";
import { useForm } from "antd/es/form/Form";

const RegistrationForm = () => {
    const [form] = useForm()
    const resgisterUser = async (data: any) => {
        return await axios({
            url: "http://localhost:3003/api/users/signup",
            method: "POST",
            data,
        });
    };

    const onFinish = async (values: any) => {
        console.log("Received values:", values);
        const { email, firstname, lastname, birthday, password, gender } =
            values;
        try {
            const result = await resgisterUser({
                email,
                password,
                firstname,
                lastname,
                birthday,
                gender: gender === "male" ? 1 : 0,
            });
            if (result) {
                console.log(result.data);
                signIn("credentials", { email, password, redirect: true });
            }
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                const {code, name, message} = error.response.data ;
                if (name === "Conflict") {
                    form.setFields([{name: "email", errors: ["Email đã tồn tại"]}])
                } 
                else {
                    message.error(`From Server: Code = ${code}, name = ${name}, message: ${message}`)
                }
            }
            console.log(error);
        }
    };

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: "#EA6A12",
                    colorTextSecondary: "rgb(255, 247, 237)",
                    colorLinkHover: "#EA6A12",
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
                form={form}
                name='registration-form'
                className='login-form w-full px-8 py-4 max-w-[400px] bg-white shadow-lg rounded-xl border-0'
                onFinish={onFinish}
                scrollToFirstError
                layout='vertical'
            >
                <div className='text-center w-full'>
                    <h3 className='text-xl font-bold my-2'>Sign up</h3>
                    <p> Sign up an account</p>
                </div>
                <Form.Item
                    name='email'
                    label='Email'
                    rules={[
                        {
                            type: "email",
                            message: "Email không hợp lệ!",
                        },
                        {
                            required: true,
                            message: "Vui lòng nhập email!",
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <div className='flex justify-between gap-2'>
                    <Form.Item
                        name='gender'
                        label='Gender'
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng chọn giới tính!",
                            },
                        ]}
                    >
                        <Radio.Group>
                            <Radio value='male'>Male</Radio>
                            <Radio value='female'>Female</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item
                        name='birthday'
                        label='Birthday'
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập ngày sinh!",
                            },
                        ]}
                    >
                        <DatePicker style={{ width: "100%" }} />
                    </Form.Item>
                </div>

                <div className='flex gap-2'>
                    <Form.Item
                        name='firstname'
                        label='First Name'
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tên!",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name='lastname'
                        label='Last Name'
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập họ!",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </div>

                <Form.Item
                    name='password'
                    label='Password'
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng nhập mật khẩu!",
                        },
                    ]}
                    hasFeedback
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    name='confirm'
                    label='Confirm Password'
                    dependencies={["password"]}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng xác nhận mật khẩu!",
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (
                                    !value ||
                                    getFieldValue("password") === value
                                ) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(
                                    "Mật khẩu xác nhận không khớp!"
                                );
                            },
                        }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item>
                    <Button
                        type='primary'
                        htmlType='submit'
                        className='bg-primary w-full mt-2'
                    >
                        Sign Up
                    </Button>
                </Form.Item>
            </Form>
        </ConfigProvider>
    );
};

export default RegistrationForm;
