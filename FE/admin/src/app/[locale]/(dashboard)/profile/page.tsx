"use client"
import { useEffect, useState } from "react"
import { EditOutlined, EllipsisOutlined, CalendarOutlined, ArrowRightOutlined, UserOutlined, CloseCircleFilled } from '@ant-design/icons';
import { Avatar, Button, Checkbox, ConfigProvider, Form, Image, Popconfirm, Space, Spin, Table, Tag, message } from 'antd';
import type { TableProps } from 'antd';
import useSWR from "swr";
import { useParams } from 'next/navigation'
import fetchClient from "@/lib/fetch-client";
import { UpdatableInput } from "@/components/UpdatableInput/UpdatableInput";
import TimeFormatter from "@/components/TimeFormatter";
import { DetailPageLayout } from "@/components/DetailPageLayout";
import { useForm } from "antd/es/form/Form";
import { useLocale, useTranslations } from "next-intl";
import moment from "moment";
import { useSession } from "next-auth/react";


interface ActivityDataType {
    key: string;
    name: string;
    types: string[];
    date: string;
}
const EmployeeProfile = () => {
    const [editmode, setEditmode] = useState(false)
    const session = useSession()
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState<any>(null)
    const [reload, setReload] = useState(false)
    const [form] = useForm();
    const t_general: any = useTranslations("General")
	const t_customer: any = useTranslations("Customer")
	const t_employee: any = useTranslations("Employee")

   let id = session.data?.user.id

    const columns_activity: TableProps<ActivityDataType>['columns'] = [
        {
            title: t_general('name'),
            dataIndex: 'name',
            key: 'name',
            render: (text) => <a>{text}</a>,
        },
        {
            title: t_general('type'),
            key: 'types',
            dataIndex: 'types',
            render: (_, { types }) => (
                <>
                    {types.map((type) => {
                        let color = type.length > 5 ? 'geekblue' : 'green';
                        if (type === 'loser') {
                            color = 'volcano';
                        }
                        return (
                            <Tag color={color} key={type}>
                                {type.toUpperCase()}
                            </Tag>
                        );
                    })}
                </>
            ),
        },
        {
            title: t_general('date'),
            dataIndex: 'date',
            key: 'date',
            render: (text) => <a><CalendarOutlined style={{ color: "#4A58EC" }} /> {text}</a>,
        }
    ];

    const businessData: ActivityDataType[] = [
        // {
        //     key: '1',
        //     name: 'Send “Happy birthday” automated email',
        //     types: ['Automation'],
        //     date: '2011-09-29',
        // },
    ];

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const data = await fetchClient({
                    url: `/employees/${id}`,
                    data_return: true
                })
                setData(data)
                setLoading(false)
            } catch (error) {
                setLoading(false)
                message.error("Fetch emplyee data faild!");
                throw error;
            }
        }

        fetchData()
    }, [reload])

    const handleUpdateEmployee = async (values: any) => {
        console.log(values)
        setLoading(true)
        try {
            const newEmployeeInfo = await fetchClient({
                method: "PUT",
                url: `/employees/${id}`,
                body: { data: values },
                data_return: true

            })
            setData(newEmployeeInfo)
            setEditmode(false)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            throw error
        }
    }

    const handleUpdateField = async (fieldname: string) => {
        console.log(fieldname)
        if (fieldname) {
            await handleUpdateEmployee({ [fieldname]: form.getFieldValue(fieldname) })
        }
    }

    if (!data) return ""

    return (
        <DetailPageLayout dataCreatedAt={data.createdAt} dataUpdatedAt={data.updatedAt}>
            <Space direction="vertical" className="w-full">
                <Form
                    layout="vertical"
                    onFinish={handleUpdateEmployee}
                    form={form}
                    // form={form}
                    className="w-full bg-white rounded-lg border py-3 px-4"
                >
                    {editmode ?
                        (<Form.Item className="flex">
                            <Space>
                                <Button
                                    className="p-1 px-1 text-white"
                                    style={{
                                        border: "1px solid #DADAD9",
                                        borderRadius: "4px 0px 0px 4px",
                                        backgroundColor: "#4A58EC"
                                    }}
                                    htmlType="submit"
                                    loading={loading}
                                >
                                    {t_general('save')}
                                </Button>
                                <Button
                                    className="p-1 px-1"
                                    style={{
                                        borderWidth: "1px 0px 1px 0px", borderBlockColor: "#DADAD9",
                                        borderStyle: "solid", backgroundColor: "#F9FAFB"
                                    }}
                                    htmlType="reset"
                                    onClick={() => setEditmode(false)}
                                >
                                    {t_general('cancel')}
                                </Button>
                            </Space>

                        </Form.Item>) :

                        <Button onClick={() => setEditmode(true)}>{t_general('edit')}</Button>
                    }

                    <div className="flex gap-5 items-center mt-3">
                        <img
                            style={{ width: "120px", height: "120px" }}
                            src={'https://www.w3schools.com/w3images/avatar2.png'}
                            className="rounded-full"
                        />
                        <div className="flex-1">
                            <div className="mt-3 grid grid-cols-2 gap-4 w-100">
                                <UpdatableInput
                                    name="firstname"
                                    type="input"
                                    defaultValue={data.firstname || ""}
                                    editmode={editmode} label={t_general('firstname')}
                                    onUpdate={handleUpdateField}
                                />

                                <UpdatableInput
                                    name="lastname"
                                    type="input"
                                    defaultValue={data.lastname || ""}
                                    editmode={editmode} label={t_general('lastname')}
                                    onUpdate={handleUpdateField}
                                />

                            </div>
                            <div className="mt-3 grid grid-cols-2 gap-4 w-100">
                                <UpdatableInput
                                    name="gender"
                                    type="select"
                                    options={[{ label: t_general('male'), value: "0" }, { label: t_general('female'), value: "1" }]}
                                    defaultValue={data.gender === "0" ? "Male" : "Female"}
                                    editmode={editmode}
                                    label={t_general('gender')}
                                    onUpdate={handleUpdateField}
                                />
                                <UpdatableInput
                                    name="birthday"
                                    type="date"
                                    defaultValue={moment(data.birthday).format("YYYY-MM-DD")}
                                    editmode={editmode} label={t_general('birthday')}
                                    onUpdate={handleUpdateField}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-4 w-100 items-center">
                        <UpdatableInput
                            name=""
                            disabled
                            type="input"
                            defaultValue={data.username}
                            editmode={editmode}
                            label={t_employee("username")}
                            onUpdate={handleUpdateField}
                        />

                        <UpdatableInput
                            name="role"
                            type="select"
                            options={[{ label: t_employee("manager"), value: "manager" }, { label: t_employee("staff"), value: "staff" }, { value: t_employee("chef"), label: "Chef" }]}
                            defaultValue={data.role}
                            editmode={editmode}
                            label={t_employee("role")}
                            onUpdate={handleUpdateField}
                        />
                        <Form.Item name="isActive" label={t_employee("active")}>
                            <Checkbox defaultChecked={data.isActive} disabled={!editmode}/>
                        </Form.Item>
                        <UpdatableInput
                            name="email"
                            type="input"
                            defaultValue={data.email}
                            editmode={editmode}
                            label={t_general('email')}
                            onUpdate={handleUpdateField}
                        />
                        <UpdatableInput
                            name="phone"
                            type="input"
                            defaultValue={data.phone}
                            editmode={editmode}
                            label={t_general('phone')}
                            onUpdate={handleUpdateField}
                        />
                    </div>
                </Form>

                <div className="bg-white p-2">
                    <header>
                        <b>{t_general('activities')}</b>
                    </header>

                    <div >
                        <Table columns={columns_activity} dataSource={businessData}
                            pagination={{
                                pageSize: 3,
                            }}
                        />
                    </div>
                </div>
            </Space>
        </DetailPageLayout>

    )
}

export default EmployeeProfile
