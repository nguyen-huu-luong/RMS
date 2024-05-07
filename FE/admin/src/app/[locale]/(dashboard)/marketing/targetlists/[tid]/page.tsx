"use client"
import { DetailPageLayout } from "@/components/DetailPageLayout"
import { AddClientToTargetListModal } from "@/components/Modals/AddClientToTargetListModal"
import { ClientTable } from "@/components/TargetListPageComponents/ClientTable"
import TimeFormatter from "@/components/TimeFormatter"
import { UpdatableInput } from "@/components/UpdatableInput/UpdatableInput"
import fetchClient from "@/lib/fetch-client"
import { EllipsisOutlined } from "@ant-design/icons"
import { Button, ConfigProvider, Form, Input, Popconfirm, Space, message } from "antd"
import { useForm } from "antd/es/form/Form"
import { TableProps } from "antd/es/table"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"


type ColumnsType<T> = TableProps<T>["columns"];

interface CustomerType {
    key: React.Key;
    id: number;
    phone: string;
    fullname: string;
    email: string;
    createdAt: string;
}

interface LeadType {
    key?: React.Key;
    id: number;
    fullname: string;
    status: string,
    email: string;
}

type TargetlistData = {
    id: number,
    name: string,
    description: string,
    type: string,
    createdAt: string,
    updatedAt: string,
    count: {
        total: number,
        leads: number,
        customer: number,
    }
    leads: Array<any>,
    customers: Array<any>
}
const TargetListDetail = () => {
    const [editmode, setEditmode] = useState(false)
    const [data, setData] = useState<TargetlistData>()
    const [loading, setLoading] = useState(false)
    const [selecteds, setSelected] = useState<{ leads: LeadType[], customers: CustomerType[] }>({
        leads: [],
        customers: []
    })

    const params = useParams<{ locale: string; tid: string }>()

    const fetchData = async () => {
        setLoading(true);
        try {

            const targetlistInfo = await fetchClient({
                url: `/targetlists/${params.tid}`,
                data_return: true
            })
            setData(targetlistInfo);
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log(error)
            message.error(error as string)
        }
    }
    useEffect(() => {
        fetchData();
    }, [])


    const handleCancelChange = () => {
        setEditmode(false)
    }

    const handleSaveChange = async (values: any) => {
        await handleUpdateTargetlistInfo(values)
    }

    const [form] = useForm()

    const customerColumns: ColumnsType<CustomerType> = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Fullname",
            dataIndex: "fullname",
            key: "fullname",
            render: (text, row) => <Link style={{ color: "#4A58EC" }} href={`/customers/${row.id}`}>{text}</Link>,
        },
        {
            title: "Phone number",
            dataIndex: "phone",
            key: "phone",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "CreatedAt",
            dataIndex: "createdAt",
            key: "createdAt",
        },
    ];

    const leadColumns: ColumnsType<LeadType> = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
        },
        {
            title: "Fullname",
            dataIndex: "fullname",
            key: "fullname",
            render: (text, row, record) => <Link href={`/customers/${row.id}`}>{text}</Link>
        },
        {
            title: "email",
            dataIndex: "email",
            key: "email",
        },
        
    ];

    const handleUpdateTargetlistInfo = async (values: any) => {
        setLoading(true);
        try {
            const newTargetlist = await fetchClient({
                method: "PUT",
                url: `/targetlists/${params.tid}`,
                body: {
                    data: { ...values }
                },
                data_return: true
            })
            setData(newTargetlist)
            setLoading(false)
            setEditmode(false)
            message.success("Update target list succesfully")
        } catch (error) {
            setLoading(false);
            message.error(error as string)
        }
    }

    const handleAddClientToTargetList = async (rows: CustomerType[] | LeadType[]) => {
        const ids = rows.map(item => item.id);

        const result = await fetchClient({
            method: "PUT",
            url: `/targetlists/${params.tid}`,
            body: {
                data: {
                    clients: {
                        action: "add",
                        ids
                    }
                }
            }
        })

        setData(prev => result.data)
    }

    const handleUpdateField = async (fieldname: string) => {
        const values: { [key: string]: string } = {}
        values[fieldname] = form.getFieldValue(fieldname)

        await handleUpdateTargetlistInfo(values)
    }
    const customers = data && data.customers.map((item, index) => ({ ...item, key: index, fullname: `${item.firstname} ${item.lastname}`, }))
    const leads = data && data.leads.map((item, index) => ({ ...item, key: index, fullname: `${item.firstname} ${item.lastname}`, }))

    if (!data) return ""
    return (
        <DetailPageLayout dataCreatedAt={data.createdAt} dataUpdatedAt={data.updatedAt}>

            <Space direction="vertical" className="w-full">
                <Form
                    layout="vertical"
                    onFinish={handleSaveChange}
                    form={form}
                    className="w-full bg-white rounded-lg border py-3 px-4"
                >
                    {editmode ?
                        (<Form.Item className="flex">
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
                            <Popconfirm title="Your change will not save. Are you sure?">
                                <Button
                                    className="p-1 px-1"
                                    style={{
                                        borderWidth: "1px 0px 1px 0px", borderBlockColor: "#DADAD9",
                                        borderStyle: "solid", backgroundColor: "#F9FAFB"
                                    }}
                                    onClick={handleCancelChange}
                                >
                                    Cancel
                                </Button>
                            </Popconfirm>
                            <button className="p-1 px-1" type="button" style={{ borderWidth: "1px 1px 1px 1px", borderBlockColor: "#DADAD9", borderStyle: "solid", borderRadius: "0px 4px 4px 0px", backgroundColor: "#F9FAFB" }}>
                                <EllipsisOutlined />
                            </button>
                        </Form.Item>) :

                        <Button onClick={() => setEditmode(true)}>Edit</Button>
                    }

                    <div className="mt-2 grid grid-cols-2 gap-5 text-black ">
                        <UpdatableInput
                            name="name"
                            type="input"
                            defaultValue={data.name}
                            editmode={editmode} label={"Name"}
                            onUpdate={handleUpdateField}
                        />

                        <UpdatableInput
                            name="description"
                            type="textarea"
                            defaultValue={data.description}
                            editmode={editmode} label={"Description"}
                            onUpdate={handleUpdateField}
                        />
                        <div>
                            <p>Count</p>
                            <p>{data?.count.total}</p>
                        </div>
                    </div>
                </Form>

                <div className="w-full bg-white rounded-lg border py-3 px-4">
                    <div>
                        <div className="flex justify-between items-center">
                            <h6>Customers</h6>
                            <AddClientToTargetListModal type="customer" onOk={handleAddClientToTargetList} />
                        </div>
                        <div>
                            <ClientTable<CustomerType>
                                columns={customerColumns}
                                dataSource={customers || []}
                                onSelected={
                                    {
                                        handle: (selecteds) => {
                                            setSelected(prev => ({ ...prev, customers: selecteds }))
                                        }
                                    }
                                }
                            />
                        </div>
                    </div>
                </div>

                <div className="w-full bg-white rounded-lg border py-3 px-4">
                    <div>
                        <div className="flex justify-between items-center">
                            <h6>Leads</h6>
                            <AddClientToTargetListModal type="lead" onOk={handleAddClientToTargetList} />
                        </div>
                        <div>
                            <ClientTable<LeadType>
                                columns={leadColumns}
                                dataSource={leads || []}
                                onSelected={
                                    {
                                        handle: (selecteds) => {
                                            setSelected(prev => ({ ...prev, leads: selecteds }))
                                        }
                                    }
                                }
                            />
                        </div>
                    </div>
                </div>
            </Space>
        </DetailPageLayout>)
}

export default TargetListDetail;