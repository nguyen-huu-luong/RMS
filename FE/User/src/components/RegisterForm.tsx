"use client";
import React from "react";
import { Form, Input, Button, Radio, ConfigProvider, DatePicker } from "antd";
import axios, { AxiosError } from "axios";
import { register } from "module";
// import SignIn from '../[locale]/(auth)/signin/page';
import { signIn } from "next-auth/react";
import { useForm } from "antd/es/form/Form";
import { useTranslations } from "next-intl";

const backend_api = `http://${process.env.NEXT_PUBLIC_BACKEND_HOST}:${process.env.NEXT_PUBLIC_BACKEND_PORT}/api`

const RegistrationForm = () => {
    const t = useTranslations('Login')
    const [form] = useForm()
    const resgisterUser = async (data: any) => {
        return await axios({
            url: `${backend_api}/users/signup`,
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
                gender,
                source: "Website"
            });
            if (result) {
                console.log(result.data);
                signIn("credentials", { email, password, redirect: true });
            }
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                const {code, name, message} = error.response.data ;
                if (name === "Conflict") {
                    form.setFields([{name: "email", errors: [t('Email_existed')]}])
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
                    <h3 className='text-xl font-bold my-2'>{t('Signup')}</h3>
                    <p> {t('Signup_account')}</p>
                </div>
                <Form.Item
                    name='email'
                    label='Email'
                    rules={[
                        {
                            type: "email",
                            message: t('Invalid_email'),
                        },
                        {
                            required: true,
                            message: t('No_email'),
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <div className='flex justify-between gap-2'>
                    <Form.Item
                        name='gender'
                        label={t('Gender')}
                        rules={[
                            {
                                required: true,
                                message: t('Val_gender'),
                            },
                        ]}
                    >
                        <Radio.Group>
                            <Radio value={true}>{t('Male')}</Radio>
                            <Radio value={false}>{t('Female')}</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item
                        name='birthday'
                        label={t('Birthday')}
                        rules={[
                            {
                                required: true,
                                message: t('Val_birthday'),
                            },
                        ]}
                    >
                        <DatePicker style={{ width: "100%" }} />
                    </Form.Item>
                </div>

                <div className='flex gap-2'>
                    <Form.Item
                        name='firstname'
                        label={t('Firstname')}
                        rules={[
                            {
                                required: true,
                                message:t('Val_first'),
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name='lastname'
                        label={t('Lastname')}
                        rules={[
                            {
                                required: true,
                                message: t('Val_last'),
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </div>

                <Form.Item
                    name='password'
                    label={t('Password')}
                    rules={[
                        {
                            required: true,
                            message:t('No_password'),
                        },
                    ]}
                    hasFeedback
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    name='confirm'
                    label={t('Confirm_password')}
                    dependencies={["password"]}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: t('Val_password'),
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
                                   t('Invalid_password')
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
                        {t('Login')}
                    </Button>
                </Form.Item>
            </Form>
        </ConfigProvider>
    );
};

export default RegistrationForm;
