"use client";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { Session } from "next-auth/core/types";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button, ConfigProvider, DatePicker, Form, Input, Radio } from "antd";
import { useSession } from "next-auth/react";
import { useRouter } from "next-intl/client";
import Loading from "@/components/loading";
const Profile = () => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [edit, setEdit] = useState<boolean>(true);
    const [form] = Form.useForm();
    if (status === "loading") return <Loading />;
    if (status === "unauthenticated") router.push("/signin");
    return (
        <>
            <div className='bg-primary-white w-full h-auto font-bold text-normal rounded-xl py-2 px-3'>
                User Profile
            </div>
            <div className='bg-primary-white w-full h-auto font-bold text-normal rounded-xl py-2 px-3 flex flex-col gap-2 items-center'>
                <div className='relative w-auto h-auto rounded-full overflow-hidden'>
                    <Image
                        src={"/avatar-placeholder.png"}
                        alt={"avatar-placeholder"}
                        width={150}
                        height={150}
                        unoptimized
                    />
                    {!edit ? (
                        <div className='absolute top-2/3 left-1/2 transform -translate-x-1/2  px-2 py-1 border-2 font-light text-white backdrop-blur-sm rounded-md cursor-pointer'>
                            Change
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
                <div className=''>
                    <Form
                        form={form}
                        name='UserInformation'
                        style={{ maxWidth: 800 }}
                        autoComplete='off'
                        disabled={edit}
                    >
                        <Form.Item
                            label='First Name'
                            initialValue={session?.user.firstname}
                            name='first_name'
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label='Last Name'
                            initialValue={session?.user.lastname}
                            name='last_name'
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label='Email'
                            initialValue={session?.user.email}
                            name='email'
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label='Phone'
                            initialValue={session?.user.phone}
                            name='phone'
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label='Birthday'
                            initialValue={session?.user.birthday}
                            name='birthday'
                        >
                            <DatePicker />
                        </Form.Item>
                        <Form.Item
                            label='Gender'
                            initialValue={session?.user.gender}
                            name='gender'
                        >
                            <Radio.Group>
                                <Radio value={true}>Male</Radio>
                                <Radio value={false}>Female</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Form>
                    <div className='w-full flex flex-row justify-end gap-2 pb-5'>
                        {!edit ? (
                            <Button onClick={() => setEdit(false)}>Save</Button>
                        ) : (
                            <Button onClick={() => setEdit(false)}>
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
