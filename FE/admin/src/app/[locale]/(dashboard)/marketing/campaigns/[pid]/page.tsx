"use client"
import { useState } from "react"
import { EditOutlined, EllipsisOutlined, CalendarOutlined, ArrowRightOutlined, UserOutlined, CloseCircleFilled, PlusOutlined } from '@ant-design/icons';
import { useParams } from 'next/navigation'
import { useSession } from "next-auth/react";
import {
    Button,
    Input,
    Select,
    Modal, Form, DatePicker, InputNumber
} from "antd";

const CampaignDetail = () => {
    const editStyle = { outline: "0", backgroundColor: "#F6FAFD", border: "1px solid #DADAD9", paddingLeft: "5px" }
    const normalStyle = { outline: "0", backgroundColor: "", border: "", paddingLeft: "" }
    const tabStyle_ = ["inline-block p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500",
        "inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
    ]
    const { data: session, status } = useSession();
    const params = useParams<{ locale: string; pid: string }>()


    const [editFlag, setFlag] = useState(true)
    const [style, setStyle] = useState(normalStyle)
    const [checker, setChecker] = useState(0)

    let campaignInfo: any = { name: "Introduce new dish", status: "planning", type: "newletters", start_date: "2022-12-13", budget: "3000000", end_date: "2023-01-13" }
    let statisticInfo: any = { send: 0, clicked: 0, lead_created: 0, lead_converted: 0, total_order: 0, revenue: "+ $124" }
    let targetlistInfo: any = [{ id: 1, name: "Customer" }, { id: 2, name: "Lead" }, { id: 3, name: "Subsriber" }]
    let EmailTemplateInfo: any = [{ id: 1, name: "Template 1" }, { id: 2, name: "Template 2" }, { id: 3, name: "Template 3" }]
    let currentTargetlist: any = [{ name: "Customer Group 0", description: "Description 1", type: "Group 0", count: 10 },
    { name: "Customer Group 1", description: "Description 1", type: "Group 1", count: 10 },
    { name: "Customer Group 2", description: "Description 2", type: "Group 2", count: 10 },
    ]

    let currentEmailMarketing: any = [{ name: "Promotion in April", status: "Completed", date_start: "2022-12-13", email_template: "www.brixtemplates.com" },
    { name: "Promotion in April", status: "Completed", date_start: "2022-12-13", email_template: "www.brixtemplates.com" },
    { name: "Promotion in April", status: "Completed", date_start: "2022-12-13", email_template: "www.brixtemplates.com" },
    ]

    let currentURL: any = [{ name: "April Promo information", url: "https://homecruise.com/news/43242" },
    { name: "April Promo information", url: "https://homecruise.com/news/43242" }]

    const handelEditButton = () => {
        setFlag(false)
        setStyle(editStyle)
    }

    const handleSubmit = async (event: any) => {
        event.preventDefault()
        if (checker == 0) {
            // handle cancel here
        }
        else {
            // handle update here
        }
        setFlag(true)
        setStyle(normalStyle)
    }

    const handleOpenTargetForm = () => {
        setTargetList(true)
    }

    const handleCloseTargetForm = () => {
        setTargetList(false)
    }

    const handleAddTagert = (values: any) => {

    }

    const handleOpenTemplateForm = () => {
        setEmailTemplate(true)
    }

    const handleCloseTemplateForm = () => {
        setEmailTemplate(false)
    }

    const handleAddTemplate = (values: any) => {

    }

    const handleOpenURLForm = () => {
        setURL(true)
    }

    const handleCloseURLForm = () => {
        setURL(false)
    }

    const handleAddURL = (values: any) => {

    }


    const [target_list, setTargetList] = useState(false);
    const [email_template, setEmailTemplate] = useState(false);
    const [url, setURL] = useState(false);

    const [form_target_list] = Form.useForm();
    const [form_email_template] = Form.useForm();
    const [form_url] = Form.useForm();

    return (
        <>

            <div className="text-sm font-medium pb-3" style={{ backgroundColor: "#F8F8F8" }}>
                {editFlag &&

                    <div className="inline-block">
                        <button onClick={handelEditButton} type="button" className="p-1 px-1" style={{ border: "1px solid #DADAD9", borderRadius: "4px 0px 0px 4px", backgroundColor: "#F9FAFB" }} id="bt1"> <EditOutlined /> Edit</button>
                        <button className="p-1 px-1" type="button" style={{ borderWidth: "1px 1px 1px 0px", borderBlockColor: "#DADAD9", borderStyle: "solid", borderRadius: "0px 4px 4px 0px", backgroundColor: "#F9FAFB" }}><EllipsisOutlined /></button>
                    </div>}
                <form onSubmit={(e) => handleSubmit(e)}>
                    {
                        !editFlag &&

                        <div className="inline-block" >
                            <button className="p-1 px-1 text-white" style={{ border: "1px solid #DADAD9", borderRadius: "4px 0px 0px 4px", backgroundColor: "#4A58EC" }} id="bt2" onClick={() => setChecker(1)}>Save</button>
                            <button className="p-1 px-1" style={{ borderWidth: "1px 0px 1px 0px", borderBlockColor: "#DADAD9", borderStyle: "solid", backgroundColor: "#F9FAFB" }} onClick={() => setChecker(0)}>Cancel</button>
                            <button className="p-1 px-1" type="button" style={{ borderWidth: "1px 1px 1px 1px", borderBlockColor: "#DADAD9", borderStyle: "solid", borderRadius: "0px 4px 4px 0px", backgroundColor: "#F9FAFB" }}><EllipsisOutlined /></button>
                        </div>
                    }
                    <div className="mt-3 grid grid-cols-3 gap-4">
                        <div className="col-span-2">
                            <div className="bg-white pl-3 py-2">
                                <div className="mt-2 grid grid-cols-2 gap-2">
                                    <div>
                                        <p className="font-bold">Name</p>
                                        <input className="rounded-md py-1.5 w-40" style={style} readOnly={editFlag} name="username" defaultValue={campaignInfo.name}></input>
                                    </div>
                                    <div className="">
                                        <p className="font-bold ">Status</p>
                                        <select className="rounded-md py-1.5" style={style} disabled={editFlag} name="status" defaultValue={campaignInfo.status}>
                                            <option value="planning">Planning</option>
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>
                                    <div>
                                        <p className="font-bold">Type</p>
                                        <div>
                                            <select className="rounded-md py-1.5" style={style} disabled={editFlag} name="type" defaultValue={campaignInfo.type}>
                                                <option value="newsletter">Newsletter</option>
                                                <option value="email">Email</option>
                                                <option value="welcome">Welcome</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="font-bold ">Start date</p>
                                        <div>
                                            <input className="rounded-md py-1" type="date" style={style} readOnly={editFlag} name="start_date" defaultValue={campaignInfo.start_date}></input>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="font-bold">Budget</p>
                                        <span>VND&nbsp;
                                            <input className="rounded-md py-1.5 w-40" style={style} readOnly={editFlag} name="budget" defaultValue={campaignInfo.budget}></input></span>
                                    </div>
                                    <div className="">
                                        <p className="font-bold ">End date</p>
                                        <div>
                                            <input className="rounded-md py-1" type="date" style={style} readOnly={editFlag} name="end_date" defaultValue={campaignInfo.end_date}></input>
                                        </div>
                                    </div>

                                </div>

                            </div>

                            <div className="bg-white pl-3 py-2 mt-3">
                                <Modal title="Add new target customer" footer={null} open={target_list} onCancel={handleCloseTargetForm}>
                                    <Form form={form_target_list} name="form_item_path" variant="filled" layout="vertical" style={{ maxWidth: 1000 }} onFinish={handleAddTagert}>
                                        <div className="space-x-2">
                                            <div className='flex align-middle relative'>
                                                <div className='relative' style={{ width: "100px" }}>
                                                    <p className='absolute' style={{ top: "5%" }}>Target name:</p>
                                                </div>
                                                <div style={{ width: "90%" }}>
                                                    <Form.Item
                                                        name="target_name"
                                                        rules={[{ required: true, message: 'Please choose target customer !' }]}>
                                                        <Select mode="multiple" allowClear>
                                                            {
                                                                targetlistInfo.map((item: any) => <Select.Option value={item.id}>{item.name}</Select.Option>)
                                                            }
                                                        </Select>
                                                    </Form.Item>
                                                </div>
                                            </div>
                                        </div>

                                        <Form.Item>
                                            <div className='flex justify-end space-x-2'>
                                                <Button type="default" htmlType="reset" onClick={handleCloseTargetForm}>
                                                    Cancel
                                                </Button>
                                                <Button type="primary" htmlType="submit" style={{ backgroundColor: "#4A58EC", color: "white" }}>
                                                    Save
                                                </Button>
                                            </div>
                                        </Form.Item>
                                    </Form>
                                </Modal>
                                <div className='flex justify-between py-1 pr-2 ' style={{ width: "98%" }}>
                                    <div>
                                        <h1 className="font-bold">Target lists</h1>
                                    </div>
                                    <div>
                                        <button onClick={() => handleOpenTargetForm()}>
                                            <PlusOutlined />
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-3">

                                    {
                                        editFlag ?
                                            <>
                                                <div className="mt-2 grid grid-cols-4 gap-2">
                                                    <h5 style={{ color: "#666666" }}>Name</h5>
                                                    <h5 style={{ color: "#666666" }}>Description</h5>
                                                    <h5 style={{ color: "#666666" }}>Type</h5>
                                                    <h5 style={{ color: "#666666" }}>Count</h5>
                                                    {
                                                        currentTargetlist.map((item: any) => {
                                                            return (
                                                                <>
                                                                    <p ><a style={{ fontSize: "13px", color: "#4A58EC" }}>{item.name}</a></p>
                                                                    <p style={{ fontSize: "13px" }}>{item.description}</p>
                                                                    <p style={{ fontSize: "13px" }}>{item.type}</p>
                                                                    <p style={{ fontSize: "13px" }}>{item.count}
                                                                    </p>
                                                                </>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </>
                                            :
                                            <>
                                                <div className="mt-2 grid grid-cols-5 gap-2">
                                                    <h5 style={{ color: "#666666" }}>Name</h5>
                                                    <h5 style={{ color: "#666666" }}>Description</h5>
                                                    <h5 style={{ color: "#666666" }}>Type</h5>
                                                    <h5 style={{ color: "#666666" }}>Count</h5>
                                                    <h5 style={{ color: "#666666" }}>Actions</h5>
                                                    {
                                                        currentTargetlist.map((item: any) => {
                                                            return (
                                                                <>
                                                                    <p ><a style={{ fontSize: "13px", color: "#4A58EC" }}>{item.name}</a></p>
                                                                    <p style={{ fontSize: "13px" }}>{item.description}</p>
                                                                    <p style={{ fontSize: "13px" }}>{item.type}</p>
                                                                    <p style={{ fontSize: "13px" }}>{item.count}</p>
                                                                    <p>
                                                                        <button type="button" style={{ fontSize: "10px", border: "1px solid", borderColor: "#4A58EC", color: "#4A58EC" }} className="px-3 rounded">Edit</button>
                                                                        <button type="button" style={{ fontSize: "10px", border: "1px solid", borderColor: "#DB3A34", color: "#DB3A34" }} className="px-3 rounded ml-2">Delete</button>
                                                                    </p>
                                                                </>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </>
                                    }
                                </div>
                            </div>

                            <div className="bg-white pl-3 py-2 mt-3">
                                <Modal title="Add new email" footer={null} open={email_template} onCancel={handleCloseTemplateForm}>
                                    <Form form={form_email_template} name="form_item_path" variant="filled" layout="vertical" style={{ maxWidth: 1000 }} onFinish={handleAddTemplate}>
                                        <div className="space-x-2">
                                            <div className='flex align-middle relative'>
                                                <div className='relative' style={{ width: "100px" }}>
                                                    <p className='absolute' style={{ top: "5%" }}>Email name:</p>
                                                </div>
                                                <div style={{ width: "90%" }}>
                                                    <Form.Item
                                                        name="email_name"
                                                        rules={[{ required: true, message: 'Please choose email template !' }]}>
                                                        <Select mode="multiple" allowClear>
                                                            {
                                                                EmailTemplateInfo.map((item: any) => <Select.Option value={item.id}>{item.name}</Select.Option>)
                                                            }
                                                        </Select>
                                                    </Form.Item>
                                                </div>
                                            </div>
                                        </div>

                                        <Form.Item>
                                            <div className='flex justify-end space-x-2'>
                                                <Button type="default" htmlType="reset" onClick={handleCloseTemplateForm}>
                                                    Cancel
                                                </Button>
                                                <Button type="primary" htmlType="submit" style={{ backgroundColor: "#4A58EC", color: "white" }}>
                                                    Save
                                                </Button>
                                            </div>
                                        </Form.Item>
                                    </Form>
                                </Modal>
                                <div className='flex justify-between py-1 pr-2 ' style={{ width: "98%" }}>
                                    <div>
                                        <h1 className="font-bold">Email marketings</h1>
                                    </div>
                                    <div>
                                        <button onClick={() => handleOpenTemplateForm()}>
                                            <PlusOutlined />
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <div className="mt-2 grid grid-cols-4 gap-2">
                                        <h5 style={{ color: "#666666" }}>Name</h5>
                                        <h5 style={{ color: "#666666" }}>Status</h5>
                                        <h5 style={{ color: "#666666" }}>Date start</h5>
                                        <h5 style={{ color: "#666666" }}>Email template</h5>
                                        {
                                            currentEmailMarketing.map((item: any) => {
                                                return (
                                                    <>
                                                        <p ><a style={{ fontSize: "13px", color: "#4A58EC" }}>{item.name}</a></p>
                                                        <p style={{ fontSize: "13px" }}>{item.status}</p>
                                                        <p style={{ fontSize: "13px" }}>{item.date_start}</p>
                                                        <p style={{ fontSize: "13px" }}><a style={{ fontSize: "13px", color: "#4A58EC" }}>{item.email_template}</a></p>
                                                    </>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white pl-3 py-2 mt-3">
                                <Modal title="Add new URL" footer={null} open={url} onCancel={handleCloseURLForm}>
                                    <Form form={form_url} name="form_item_path" variant="filled" layout="vertical" style={{ maxWidth: 1000 }} onFinish={handleAddURL}>
                                        <div className="space-x-2 grid grid-cols-8 ">

                                            <div className='relative' style={{ width: "100px" }}>
                                                <p className='absolute' style={{ top: "5%" }}>Name:</p>
                                            </div>
                                            <div style={{ width: "100%" }} className="col-span-7" >
                                                <Form.Item name="tracking_name" required rules={[{ required: true, message: 'Please input the tracking name !' }]}>
                                                    <Input />
                                                </Form.Item>
                                            </div>



                                            <div className='relative' style={{ width: "100px", marginTop: "-10px" }}>
                                                <p className='absolute' style={{ top: "5%" }}>URL:</p>
                                            </div>
                                            <div style={{ width: "100%", marginTop: "-10px" }} className="col-span-7">
                                                <Form.Item name="tracking_url" required rules={[{ required: true, message: 'Please input the tracking URL !' }]}>
                                                    <Input />
                                                </Form.Item>

                                            </div>
                                        </div>

                                        <Form.Item>
                                            <div className='flex justify-end space-x-2'>
                                                <Button type="default" htmlType="reset" onClick={handleCloseURLForm}>
                                                    Cancel
                                                </Button>
                                                <Button type="primary" htmlType="submit" style={{ backgroundColor: "#4A58EC", color: "white" }}>
                                                    Save
                                                </Button>
                                            </div>
                                        </Form.Item>
                                    </Form>
                                </Modal>
                                <div className='flex justify-between py-1 pr-2 ' style={{ width: "98%" }}>
                                    <div>
                                        <h1 className="font-bold">Track URLs</h1>
                                    </div>
                                    <div>
                                        <button onClick={() => handleOpenURLForm()}>
                                            <PlusOutlined />
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <div className="mt-2 grid grid-cols-2 gap-2">
                                        <h5 style={{ color: "#666666" }}>Name</h5>
                                        <h5 style={{ color: "#666666" }}>URL</h5>
                                        {
                                            currentURL.map((item: any) => {
                                                return (
                                                    <>
                                                        <p ><a style={{ fontSize: "13px", color: "#4A58EC" }}>{item.name}</a></p>
                                                        <p style={{ fontSize: "13px" }}><a style={{ fontSize: "13px", color: "#4A58EC" }}>{item.url}</a></p>
                                                    </>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div>
                            <div className="bg-white pl-3 py-2">
                                <p style={{ color: "#666666" }}>Created at</p>
                                <p><CalendarOutlined style={{ color: "#4A58EC" }} /> December 13, 2022 by <span style={{ color: "#4A58EC" }}>Minh Vuong</span></p>
                                <p className="mt-1" style={{ color: "#666666" }}>Last modified</p>
                                <p><CalendarOutlined style={{ color: "#4A58EC" }} /> December 16, 2024  by <span style={{ color: "#4A58EC" }}>Minh Vuong</span></p>
                                <p className="ml-5 mt-2" style={{ color: "#666666" }}><button><ArrowRightOutlined /> View all history </button></p>
                            </div>

                            <div className="bg-white pl-3 py-2 mt-3 pb-10">
                                <h2 className="font-bold">Statistic</h2>
                                <div className="mt-4 ml-2">
                                    <div className="mt-2 grid grid-cols-2 gap-5">
                                        <div>
                                            <p>Sent</p>
                                            <p style={{ color: "#8DF185" }}>{statisticInfo.send}</p>
                                        </div>
                                        <div>
                                            <p>Clicked</p>
                                            <p style={{ color: "#8DF185" }}>{statisticInfo.clicked}</p>
                                        </div>

                                        <div>
                                            <p>Leads created</p>
                                            <p style={{ color: "#8DF185" }}>{statisticInfo.lead_created}</p>
                                        </div>
                                        <div>
                                            <p>Leads converts</p>
                                            <p style={{ color: "#8DF185" }}>{statisticInfo.lead_converted}</p>
                                        </div>

                                        <div>
                                            <p>Total orders</p>
                                            <p style={{ color: "#8DF185" }}>{statisticInfo.total_order}</p>
                                        </div>
                                        <div>
                                            <p>Revenue</p>
                                            <p style={{ color: "#8DF185" }}>{statisticInfo.revenue}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </form>
            </div>
        </>
    )
}

export default CampaignDetail
