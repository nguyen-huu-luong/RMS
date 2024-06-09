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
import { useTranslations } from "next-intl";
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
    const t = useTranslations("User_profile");
    const t_form = useTranslations("Login");

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
                {t("Profile")}
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
                    <Upload
                        {...props}
                        maxCount={1}
                        showUploadList={false}
                        accept='image/*'
                    >
                        <button className='absolute top-1/2 left-1/2 transform -translate-x-1/2  px-2 py-1 border-2 font-medium text-white backdrop-blur-sm rounded-md cursor-pointer'>
                            {t("Change")}
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
                            label={t_form('Firstname')}
                            initialValue={profile.firstname}
                            name='firstname'
                            rules={[
                                {
                                    required: true,
                                    message: t_form('Val_first'),
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label={t_form('Lastname')}
                            initialValue={profile.lastname}
                            name='lastname'
                            rules={[
                                {
                                    required: true,
                                    message:t_form('Val_last'),
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
                            label={t_form('Phone')}
                            initialValue={profile.phone}
                            name='phone'
                            rules={[
                                {
                                    min: 9,
                                    max: 11,
                                    message: t_form('Invalid_phone'),
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label={t_form('Birthday')}
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
                            label={t_form('Gender')}
                            initialValue={profile.gender}
                            name='gender'
                        >
                            <Radio.Group>
                                <Radio value={true}>{t_form('Male')}</Radio>
                                <Radio value={false}>{t_form('Female')}</Radio>
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
                                    {t("Save")}
                                </Button>
                                <Button
                                    onClick={() => {
                                        setEdit(true);
                                        form.resetFields();
                                    }}
                                >
                                    {t("Cancel")}
                                </Button>
                            </>
                        ) : (
                            <Button
                                onClick={() => {
                                    setEdit(false);
                                }}
                            >
                                {t("Edit")}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Profile;
