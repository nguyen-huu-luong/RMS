"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
    Button,
    Upload,
    DatePicker,
    Form,
    Input,
    Radio,
    message,
    type FormProps,
} from "antd";
import { useSession } from "next-auth/react";
import { useRouter } from "next-intl/client";
import Loading from "@/components/loading";
import {
    editProfile,
    getProfile,
    uploadImage,
} from "@/app/api/profile/profile";
import type { UploadProps } from "antd";
import useSWR from "swr";
import moment from "moment";
import fetchClient from "@/lib/fetch-client";
type FieldType = {
    firstname?: string;
    lastname?: string;
    email?: string;
    phone?: string;
    birthday: string;
    gender: boolean;
};
const Profile = () => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [edit, setEdit] = useState<boolean>(true);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState<boolean>(false);
    const {
        data: profile,
        error: profileError,
        isLoading: profileLoading,
        mutate,
    } = useSWR(`/customers/${session?.user.id}`, (url) =>
        fetchClient({ url: url, data_return: true })
    );

    const handleUpload = async ({
        file,
        onSuccess,
    }: {
        file?: any;
        onSuccess?: any;
    }) => {
        const data = await uploadImage(file);
        onSuccess("ok");
        await updateImage(data.url);
    };

    const props: UploadProps = {
        name: "image",
        customRequest: handleUpload,
        onChange(info) {
            if (info.file.status === "done") {
                message.success(`Change avatar successfully`);
            } else if (info.file.status === "error") {
                message.error(`Change avatar failed.`);
            }
        },
    };

    const updateImage = async (url: string) => {
        await fetchClient({
            url: `/customers/${session?.user.id}`,
            method: "PUT",
            body: {
                avatar: url,
            },
        });
        mutate();
    };

    const updateInformation = async (data: any) => {
        await fetchClient({
            url: `/customers/${session?.user.id}`,
            method: "PUT",
            body: data,
        });
    };

    const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
        await updateInformation(values);
        mutate();
        setLoading(false);
        setEdit(true);
    };

    const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
        errorInfo
    ) => {
        setLoading(false);
        console.log("Failed:", errorInfo);
    };
    if (status === "loading") return <Loading />;
    if (status === "unauthenticated") router.push("/signin");
    if (profileError) return <div>Failed to load</div>;
    if (profileLoading) return <Loading />;
    if (!profile) return <Loading />;
    return (
        <>
            <div className='bg-primary-white w-full h-auto font-bold text-normal rounded-xl py-2 px-3'>
                User Profile
            </div>
            <div className='bg-primary-white w-full h-auto font-bold text-normal rounded-xl py-2 px-3 flex flex-col gap-2 items-center'>
                <div className='relative w-auto h-auto rounded-full overflow-hidden'>
                    <Image
                        src={
                            !profile.avatar
                                ? "/avatar-placeholder.png"
                                : profile.avatar
                        }
                        alt={"avatar-placeholder"}
                        width={150}
                        height={150}
                        className='aspect-square'
                        unoptimized
                    />
                    <Upload {...props} maxCount={1} showUploadList={false} accept="image/*">
                        <button className='absolute top-1/2 left-1/2 transform -translate-x-1/2  px-2 py-1 border-2 font-medium text-white backdrop-blur-sm rounded-md cursor-pointer'>
                            Change
                        </button>
                    </Upload>
                </div>
                <div className=''>
                    <Form
                        form={form}
                        name='UserInformation'
                        style={{ maxWidth: 800 }}
                        autoComplete='off'
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        disabled={edit}
                    >
                        <Form.Item
                            label='First Name'
                            initialValue={profile.firstname}
                            name='firstname'
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your first name!",
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label='Last Name'
                            initialValue={profile.lastname}
                            name='lastname'
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your last name!",
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label='Email'
                            initialValue={profile.email}
                            name='email'
                        >
                            <Input disabled />
                        </Form.Item>
                        <Form.Item
                            label='Phone'
                            initialValue={profile.phone}
                            name='phone'
                            rules={[
                                {
                                    min: 9,
                                    max: 11,
                                    message: "Invalid phone number!",
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label='Birthday'
                            initialValue={
                                profile.birthday
                                    ? moment(profile.birthday)
                                    : null
                            }
                            name='birthday'
                        >
                            <DatePicker />
                        </Form.Item>
                        <Form.Item
                            label='Gender'
                            initialValue={profile.gender}
                            name='gender'
                        >
                            <Radio.Group>
                                <Radio value={true}>Male</Radio>
                                <Radio value={false}>Female</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Form>{" "}
                    <div className='w-full flex flex-row justify-end gap-2 pb-5'>
                        {!edit ? (
                            <>
                                <Button
                                    onClick={() => {
                                        setLoading(true);
                                        form.submit();
                                    }}
                                    loading={loading}
                                >
                                    Save
                                </Button>
                                <Button
                                    onClick={() => {
                                        setEdit(true);
                                        form.resetFields();
                                    }}
                                >
                                    Cancel
                                </Button>
                            </>
                        ) : (
                            <Button
                                onClick={() => {
                                    setEdit(false);
                                }}
                            >
                                Edit information
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Profile;
