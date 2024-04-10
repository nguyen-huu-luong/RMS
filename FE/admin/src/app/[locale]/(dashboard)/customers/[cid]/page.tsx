"use client"
import { useState } from "react"
import { EditOutlined, EllipsisOutlined, CalendarOutlined, ArrowRightOutlined, UserOutlined, CloseCircleFilled } from '@ant-design/icons';
import { Space, Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import useSWR from "swr";
import fetchClient from "@/lib/fetch-client";
import { useParams } from 'next/navigation'
import { useSession } from "next-auth/react";

const CustomerProfile = () => {
    const editStyle = { outline: "0", backgroundColor: "#F6FAFD", border: "1px solid #DADAD9", paddingLeft: "5px" }
    const normalStyle = { outline: "0", backgroundColor: "", border: "", paddingLeft: "" }
    const tabStyle_ = ["inline-block p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500",
        "inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
    ]
    const { data: session, status } = useSession();
    const params = useParams<{ locale: string; cid: string }>()

    const [tabStyle, setTabStyle] = useState(tabStyle_)
    const [tab, setTab] = useState(0)

    const [editFlag, setFlag] = useState(true)
    const [style, setStyle] = useState(normalStyle)
    const [user, setUser] = useState(null)

    const [checker, setChecker] = useState(0)

    const {
        data: customerInfo,
        error: customerInfoError,
        isLoading: customerInfoLoading
    } = useSWR( [params.cid], ([customerId]) => fetchClient({url: `/customers/${customerId}`, data_return: true}));

    let userInfo: any

    if (customerInfoLoading) {
        return (
            <>
                <p>Loading</p>
            </>
        )
    }
    else {
        if (customerInfo) {
            userInfo = {
                "name": customerInfo.firstname + " " + customerInfo.lastname, "address": customerInfo.address,
                "source": customerInfo.source, "score": customerInfo.score, "gender": String(customerInfo.gender),
                "phone": customerInfo.phone, "birthday": customerInfo.birthday ? customerInfo.birthday.split("T")[0] : customerInfo.birthday, "email": customerInfo.email
            }
        }
    }

    const handelTabClick = (num: number) => {
        setTab(num)
    }

    const handelEditButton = () => {
        setFlag(false)
        setStyle(editStyle)
    }

    const handelCancelButton = () => {
        setFlag(true)
        setStyle(normalStyle)
    }

    const handelSubmit = async (event: any) => {
        event.preventDefault()
        if (checker == 0) {
            event.target.username.value = userInfo.name
            event.target.gender.value = userInfo.gender ? userInfo.gender : "none"
            event.target.birthday.value = userInfo.birthday ? userInfo.birthday : ""
            event.target.source.value = userInfo.source ? userInfo.source : "none"
            event.target.email.value = userInfo.email ? userInfo.email : "None"
            event.target.phone.value = userInfo.phone ? userInfo.phone : "None"
            event.target.address.value = userInfo.address ? userInfo.address : "None"
        }
        else {
            let name = event.target.username.value.split(" ");
            let first_name = name[0]
            let last_name = name.slice(1).reduce((item: any, break_: any) => item + break_ + " ", "")

            let data = {
                "email": event.target.email.value == "None" ? userInfo.email : event.target.email.value,
                "phone": event.target.phone.value == "None" ? userInfo.phone : event.target.phone.value,
                "address": event.target.address.value == "None" ? userInfo.address : event.target.address.value,
                "gender": event.target.gender.value == "none" ? userInfo.gender : event.target.gender.value,
                "source": event.target.source.value == "none" ? userInfo.source : event.target.source.value,
                "birthday": event.target.birthday.value == "" ? userInfo.birthday : event.target.birthday.value,
                "firstname": first_name,
                "lastname": last_name.trim()
            }
            await fetchClient({method: "PUT",url: `/customers/${params.cid}`, body: data,data_return: true})

        }
        setFlag(true)
        setStyle(normalStyle)
    }


    interface OrderDataType {
        key: string;
        id: string;
        status: string[];
        create_at: string;
        amount: string;
    }

    interface ActivityDataType {
        key: string;
        name: string;
        types: string[];
        date: string;
    }

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


    const columns_order: TableProps<OrderDataType>['columns'] = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Status',
            key: 'status',
            dataIndex: 'status',
            render: (_, { status }) => (
                <>
                    {status.map((status_item) => {
                        let color = status_item.length > 5 ? 'geekblue' : 'green';
                        if (status_item === 'loser') {
                            color = 'volcano';
                        }
                        return (
                            <Tag color={color} key={status_item}>
                                {status_item.toUpperCase()}
                            </Tag>
                        );
                    })}
                </>
            ),
        },
        {
            title: 'Created at',
            dataIndex: 'create_at',
            key: 'create_at',
            render: (text) => <><CalendarOutlined style={{ color: "#4A58EC" }} /> {text}</>,
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
        }
    ];

    const orderData: OrderDataType[] = customerInfo?.orderInfo.map((order: any) => {
        return {
            key: order.id,
            id: order.id,
            status: [order.status],
            create_at: order.createdAt,
            amount: String(order.amount),
        }
    })
    const costs = customerInfo?.orderInfo.map((order: any) => { return order.amount })
    const totalCost = costs?.reduce((cost: any, initial: any) => cost + initial, 0)

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

    return (
        <>
            {
                customerInfo ? (<div className="text-sm font-medium" style={{ backgroundColor: "#F8F8F8" }}>
                    {editFlag &&

                        <div className="inline-block">
                            <button onClick={handelEditButton} type="button" className="p-1 px-1" style={{ border: "1px solid #DADAD9", borderRadius: "4px 0px 0px 4px", backgroundColor: "#F9FAFB" }} id="bt1"> <EditOutlined /> Edit</button>
                            <button className="p-1 px-1" type="button" style={{ borderWidth: "1px 1px 1px 0px", borderBlockColor: "#DADAD9", borderStyle: "solid", borderRadius: "0px 4px 4px 0px", backgroundColor: "#F9FAFB" }}><EllipsisOutlined /></button>
                        </div>}
                    <form onSubmit={(e) => handelSubmit(e)}>
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
                                    <h1 className="font-bold">Overview</h1>
                                    <div className="mt-3 grid grid-cols-5 gap-4">
                                        <div style={{ width: "120px", height: "120px" }}>
                                            <img src="https://ps.w.org/user-avatar-reloaded/assets/icon-256x256.png?rev=2540745" />
                                        </div>
                                        <div>
                                            <p className="font-bold">Name</p>
                                            <input className="rounded-md py-1.5 w-40" defaultValue={userInfo.name} style={style} readOnly={editFlag} name="username"></input>
                                        </div>
                                        <div className="ml-5 pl-4">
                                            <p className="font-bold ">Gender</p>
                                            <select className="rounded-md py-1.5" defaultValue={userInfo.gender ? userInfo.gender : "none"} style={style} disabled={editFlag} name="gender">
                                                <option value={"false"}>Female</option>
                                                <option value={"true"}>Male</option>
                                                <option value={"none"}>None</option>
                                            </select>
                                        </div>
                                        <div>
                                            <p className="font-bold">Birthday</p>
                                            <div>
                                                <input className="rounded-md py-1" type="date" defaultValue={userInfo.birthday ? userInfo.birthday : ""} style={style} readOnly={editFlag} name="birthday"></input>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="font-bold ">Source</p>
                                            <select className="rounded-md py-1.5" defaultValue={userInfo.source ? userInfo.source : "none"} style={style} disabled={editFlag} name="source">
                                                <option value={"website 1"}>Website 1</option>
                                                <option value={"website 2"}>Website 2</option>
                                                <option value={"website 3"}>Website 3</option>
                                                <option value={"website 4"}>Website 4</option>
                                                <option value={"none"}>None</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="mt-3 grid grid-cols-4 gap-12">
                                        <div>
                                            <p className="font-bold">Email</p>
                                            <div>
                                                <input type="text" defaultValue={userInfo.email ? userInfo.email : "None"} className="rounded-md py-1" style={style} readOnly={editFlag} name="email"></input>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="font-bold">Phone</p>
                                            <div>
                                                <input type="phone" defaultValue={userInfo.phone ? userInfo.phone : "None"} className="rounded-md py-1 " style={style} readOnly={editFlag} name="phone"></input>
                                            </div>
                                        </div>
                                        <div className="col-span-2 pr-2">
                                            <p className="font-bold">Address</p>
                                            <textarea rows={2} className="w-full rounded-md py-1 resize-none" defaultValue={userInfo.address ? userInfo.address : "None"} readOnly={editFlag} style={style} name="address"></textarea>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white pl-3 py-2 mt-3">
                                    <h1 className="font-bold">Details</h1>
                                    <div className="mt-3">
                                        <p className="font-bold mb-1">Group</p>
                                        <div>
                                            <span className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium text-gray-600 " style={{ backgroundColor: "#E7E9FD", color: "#4A58EC", borderRadius: "30px" }}>
                                                <UserOutlined /> &nbsp;  Group1 &nbsp; <button>  <CloseCircleFilled style={{ color: "black" }} /> </button>
                                            </span>
                                            {!editFlag && <button type="button" className="ml-2 text-xs font-medium me-2 px-1.5 py-0.5 rounded dark:text-gray-400 border border-gray-500" style={{ backgroundColor: "#F9FAFB" }}>Add +</button>}
                                        </div>
                                    </div>


                                    <div className="mt-3 grid grid-cols-3 gap-2">
                                        <div>
                                            <p className="font-bold">Total orders</p>
                                            <p>{customerInfo.orderInfo.length}</p>
                                        </div>

                                        <div>
                                            <p className="font-bold">Paid</p>
                                            <p style={{ color: "#54B435" }}>{totalCost} vnđ</p>
                                        </div>
                                        <div>
                                            <p className="font-bold">Score</p>
                                            <p style={{ color: "#54B435" }}>{userInfo.score ? userInfo.score : 0}</p>
                                        </div>
                                    </div>

                                    <div className="mt-3 pr-2">
                                        <p className="font-bold">Description</p>
                                        <div>
                                            <textarea rows={2} className="w-full rounded-md py-1 resize-none" defaultValue={userInfo.desc ? userInfo.desc : "None"} readOnly={editFlag} style={style}></textarea>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white  py-2 mt-3">
                                    <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
                                        <ul className="flex flex-wrap -mb-px">
                                            <li className="me-2">
                                                <button type="button" className={tabStyle[tab]} onClick={() => handelTabClick(0)}>Orders</button>
                                            </li>
                                            <li className="me-2">
                                                <button type="button" className={tabStyle[1 - tab]} onClick={() => handelTabClick(1)}>Activities</button>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="pl-3 mt-3 pr-3">
                                        {
                                            tab == 0 ? <div> <Table columns={columns_order} dataSource={orderData} /></div>
                                                : <div>
                                                    <div>
                                                        <h3 className="mb-2">Business activities</h3>
                                                        <Table columns={columns_activity} dataSource={businessData} /></div>
                                                    <div>
                                                        <h3 className="mb-2">User activities</h3>
                                                        <Table columns={columns_activity} dataSource={userData} /></div>
                                                </div>
                                        }
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

                                <div className="bg-white pl-3 py-2 mt-3">
                                    <h2 className="font-bold">Recent Activities</h2>
                                    <div className="mt-4">
                                        <div className="flex justify-between">
                                            <div>
                                                <p style={{ color: "#4A58EC" }} className="mb-1"><CalendarOutlined /> Automated send email</p>
                                                <p style={{ color: "#4A58EC" }} className="mb-1"><CalendarOutlined /> Cancel order</p>
                                                <p style={{ color: "#4A58EC" }} className="mb-1"><CalendarOutlined /> Request an order</p>
                                            </div>
                                            <div className="pr-2">
                                                <p className="mb-1">December 13, 2022</p>
                                                <p className="mb-1">December 13, 2022</p>
                                                <p className="mb-1">December 13, 2022</p>
                                            </div>
                                        </div>
                                        <p className="text-center mt-5" style={{ color: "#666666" }}><button type="button" onClick={() => handelTabClick(1)}>Show more......</button></p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </form>
                </div>)
                    :
                    (<p>Loading</p>)
            }
        </>
    )
}

export default CustomerProfile
