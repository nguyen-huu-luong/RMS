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


interface ActivityDataType {
    key: string;
    name: string;
    types: string[];
    date: string;
}
const EmployeeProfile = () => {
    const params = useParams<{ locale: string; eid: string }>()
    const [editmode, setEditmode] = useState(false)
    const [data, setData] = useState(null)
    const [reload, setReload] = useState(false)
    const [loading, setLoading] = useState(false)

    const columns_activity: TableProps<ActivityDataType>['columns'] = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Type',
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
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (text) => <a><CalendarOutlined style={{ color: "#4A58EC" }} /> {text}</a>,
        }
    ];

    const businessData: ActivityDataType[] = [
        {
            key: '1',
            name: 'Send “Happy birthday” automated email',
            types: ['Automation'],
            date: '2011-09-29',
        },
    ];

    const userData: ActivityDataType[] = [
        {
            key: '1',
            name: 'Request an order',
            types: ['Order'],
            date: '2011-09-29',
        },
    ];

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const data = await fetchClient({
                    url: `/employees/${params.eid}`,
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
    }

    const handleUpdateField = async (fieldname: string) => {

    }

    if (!data) return ""

    return (
        <DetailPageLayout>
            <Space direction="vertical" className="w-full">
                <Form
                    layout="vertical"
                    onFinish={() => { }}
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
                                >
                                    Save
                                </Button>
                                <Button
                                    className="p-1 px-1"
                                    style={{
                                        borderWidth: "1px 0px 1px 0px", borderBlockColor: "#DADAD9",
                                        borderStyle: "solid", backgroundColor: "#F9FAFB"
                                    }}
                                    htmlType="reset"
                                >
                                    Cancel
                                </Button>
                            </Space>

                        </Form.Item>) :

                        <Button onClick={() => setEditmode(true)}>Edit</Button>
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
                                    name="name"
                                    type="input"

                                    defaultValue={"fdfdasf"}
                                    editmode={editmode} label={"Name"}
                                    onUpdate={() => { }}
                                />

                                <UpdatableInput
                                    name="gender"
                                    type="select"
                                    options={[{ label: "Male", value: "0" }, { label: "Female", value: "1" }]}
                                    defaultValue={"Male"}
                                    editmode={editmode}
                                    label={"Gender"}
                                    onUpdate={() => { }}
                                />
                            </div>
                            <div className="mt-3 grid grid-cols-2 gap-4 w-100">
                                <UpdatableInput
                                    name="Birthday"
                                    type="textarea"
                                    defaultValue={new Date().toDateString()}
                                    editmode={editmode} label={"Description"}
                                    onUpdate={() => { }}
                                />

                                <UpdatableInput
                                    name="gender"
                                    type="select"
                                    options={[{ label: "Manager", value: "manager" }, { label: "Staff", value: "staff" }, { value: "chef", label: "Chef" }]}
                                    defaultValue={"Manager"}
                                    editmode={editmode}
                                    label={"Gender"}
                                    onUpdate={() => { }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-4 w-100 items-center">
                        <UpdatableInput
                            name="username"
                            type="input"
                            defaultValue={"da fdf fad"}
                            editmode={editmode}
                            label={"Username"}
                            onUpdate={() => { }}
                        />
                        <Form.Item name="isActive" label="Active">
                            <Checkbox />
                        </Form.Item>
                        <UpdatableInput
                            name="email"
                            type="input"
                            defaultValue={"da fdf fad"}
                            editmode={editmode}
                            label={"Email"}
                            onUpdate={() => { }}
                        />
                        <UpdatableInput
                            name="phone"
                            type="input"
                            defaultValue={"da fdf fad"}
                            editmode={editmode}
                            label={"Phone"}
                            onUpdate={() => { }}
                        />
                    </div>
                </Form>

                <div className="bg-white p-2">
                    <header>
                        <b>Activities</b>
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
