"use client"
import { useEffect, useState } from "react"
import { EditOutlined, EllipsisOutlined, CalendarOutlined, ArrowRightOutlined, UserOutlined, CloseCircleFilled } from '@ant-design/icons';
import { Space, Table, Tag, Upload, message, Tooltip, Pagination, Empty } from 'antd';
import type { PaginationProps, UploadProps } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import { uploadImage } from '@/app/api/upload';
import type { TableProps } from 'antd';
import Loading from "@/components/loading";
import fetchClient from "@/lib/fetch-client";
import { useParams } from 'next/navigation'
import { useSession } from "next-auth/react";
import moment from "moment";
import Link from 'next-intl/link'

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
    const [imageUrl, setImageUrl] = useState('')
    const [checker, setChecker] = useState(0)
    const [customerInfo, setCustomerInfo] = useState<any>()
    const [isLoading, setIsLoading] = useState(true)
    const [customerHistory, setCustomerHistory] = useState<any>([])
    const [recentHistory, setRecentHistory] = useState([])
    const historyTitle: any = {
        "add_to_cart": { "title": "Add To Cart", "color": "geekblue", "link": "../bussiness/products/dishes", "reference": "Product ID:" },
        "view_item": { "title": "View Item", "color": "green", "link": "../bussiness/products/dishes", "reference": "Product ID:" },
        "order": { "title": "Make An Order", "color": "volcano", "link": "../sale/orders", "reference": "Order ID:" }
    }
    const [historyPage, setHistoryPage] = useState(1);
    const onChange: PaginationProps["onChange"] = (page) => {
        setHistoryPage(page);
    }

    const fetchData = async () => {
        setIsLoading(true)
        const data = await fetchClient({ url: `/customers/${params.cid}`, data_return: true })
        const histories = await fetchClient({ url: `/clienthistories/${params.cid}`, data_return: true })
        const newResponse = await Promise.all(
            histories.map(async (item: any) => {
                if (item.productId) {
                    const response = await fetchClient({
                        url: `/products/${item.productId}`,
                        data_return: true,
                    });
                    item.name = response.name;
                    return item;
                }
                item.name = "";
                return item;
            })
        );
        setCustomerInfo(data)
        setCustomerHistory(newResponse)
        setImageUrl(data.avatar)
        setIsLoading(false)

    }

    useEffect(() => {
        fetchData()
    }, [])

    let userInfo: any

    if (isLoading) {
        return (
            <>
                <Loading />
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

    const handleUpload = async ({
        file,
        onSuccess,
    }: {
        file?: any;
        onSuccess?: any;
    }) => {
        const data = await uploadImage(file, "Dish");
        if (data.url) {
            setImageUrl(data.url)
        }
        onSuccess("ok");
    };

    const props: UploadProps = {
        name: "image",
        customRequest: handleUpload,
        onChange(info) {
            if (info.file.status === "done") {
                message.success(`Upload avatar successfully`);
            } else if (info.file.status === "error") {
                message.error(`Change avatar failed.`);
            }
        },
    };

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
            setImageUrl(customerInfo.avatar)
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
                "lastname": last_name.trim(),
                "avatar": imageUrl
            }
            await fetchClient({ method: "PUT", url: `/customers/${params.cid}`, body: data, data_return: true })

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

    interface CustomerHistoryDataType {
        key: string;
        action: string;
        reference: string[];
        createdAt: string;
        orderId: string;
        productId: string
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


    const users_activity: TableProps<CustomerHistoryDataType>['columns'] = [
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            render: (text) =>
                <Tag color={historyTitle[text].color}>
                    {historyTitle[text].title.toUpperCase()}
                </Tag>
        },
        {
            title: 'Reference',
            key: 'reference',
            render: (_, record) => <a style={{ color: "#4A58EC" }} href={historyTitle[record.action].link}>{historyTitle[record.action].reference} {record.orderId ? record.orderId : record.productId}</a>,
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (_, record) => <a><CalendarOutlined style={{ color: "#4A58EC" }} /> {record.createdAt}</a>,
        }
    ];


    const columns_order: TableProps<OrderDataType>['columns'] = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            render: (text) => <a style={{ color: "#4A58EC" }} href="../sale/orders">{text}</a>,
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
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            render: (text) => <p>{text} VND</p>
        },
        {
            title: 'Created at',
            dataIndex: 'create_at',
            key: 'create_at',
            render: (text) => <><CalendarOutlined style={{ color: "#4A58EC" }} /> {text}</>,
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
    const costs = customerInfo?.orderInfo.map((order: any) => {
        if (order.status == 'Done') {
            return order.amount
        }
        else {
            return 0
        }
    })
    const totalCost = costs?.reduce((cost: any, initial: any) => cost + initial, 0)

    const businessData: ActivityDataType[] = [
        {
            key: '1',
            name: 'Send “Happy birthday” automated email',
            types: ['Automation'],
            date: '2011-09-29',
        },
    ];

    console.log(recentHistory)
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
                                        <div className='relative' style={{ width: "120px", height: "120px" }}>
                                            <div style={{ width: "120px", height: "120px" }}>
                                                <img style={{ width: "120px", height: "120px" }} src={imageUrl} className="rounded" />
                                            </div>
                                            <div >
                                                <Upload
                                                    {...props}
                                                    accept="image/*"
                                                    showUploadList={false}
                                                    listType="picture"
                                                    maxCount={1}>
                                                    {!editFlag && <button type="button" className='absolute' style={{ top: "80%", left: "50%", transform: "translateX(-50%)" }}><UploadOutlined style={{ fontWeight: "20px", fontSize: "20px", color: "gray" }} /></button>}
                                                </Upload>
                                            </div>
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
                                                <option value={"Tiktok"}>Tiktok</option>
                                                <option value={"Facebook"}>Facebook</option>
                                                <option value={"Website"}>Website</option>
                                                <option value={"At Restaurant"}>At Restaurant</option>
                                                <option value={"none"}>None</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="mt-3 grid grid-cols-4 gap-12">
                                        <div>
                                            <p className="font-bold">Email</p>
                                            <div>
                                                <input type="text" defaultValue={userInfo.email ? userInfo.email : "None"} className="rounded-md py-1" style={{outline: "0", backgroundColor: "", border: "", paddingLeft: ""}}  name="email"></input>
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
                                            {
                                                customerInfo.group.length > 0 ? (
                                                    <Tooltip placement="top" title={customerInfo.group[0].description} >
                                                        <button className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium text-gray-600 " style={{ backgroundColor: "#E7E9FD", color: "#4A58EC", borderRadius: "30px" }}>
                                                            {/* <UserOutlined /> &nbsp;  Group1 &nbsp; <button>  <CloseCircleFilled style={{ color: "black" }} /> </button> */}
                                                            <UserOutlined /> &nbsp;  {customerInfo.group[0].name} &nbsp;
                                                        </button>
                                                    </Tooltip>
                                                )
                                                    : (
                                                        (<span className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium text-gray-600 " style={{ backgroundColor: "#E7E9FD", color: "#4A58EC", borderRadius: "30px" }}>
                                                            {/* <UserOutlined /> &nbsp;  Group1 &nbsp; <button>  <CloseCircleFilled style={{ color: "black" }} /> </button> */}
                                                            <UserOutlined /> &nbsp;  None &nbsp;
                                                        </span>)
                                                    )
                                            }
                                            {/* {!editFlag && <button type="button" className="ml-2 text-xs font-medium me-2 px-1.5 py-0.5 rounded dark:text-gray-400 border border-gray-500" style={{ backgroundColor: "#F9FAFB" }}>Add +</button>} */}
                                        </div>
                                    </div>


                                    <div className="mt-3 grid grid-cols-3 gap-2">
                                        <div>
                                            <p className="font-bold">Total orders</p>
                                            <p>{customerInfo.orderInfo.length}</p>
                                        </div>

                                        <div>
                                            <p className="font-bold">Paid</p>
                                            <p style={{ color: "#54B435" }}>{totalCost} VND</p>
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

                                                        <Table columns={users_activity} dataSource={customerHistory}
                                                            pagination={{
                                                                pageSize: 3,
                                                            }} /></div>
                                                </div>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className='bg-white pl-3 py-2'>
                                    <p style={{ color: "#666666" }}>
                                        Created at
                                    </p>
                                    <p>
                                        <CalendarOutlined
                                            style={{ color: "#4A58EC" }}
                                        />{" "}
                                        {moment(customerInfo.createdAt).format(
                                            "MMMM D, YYYY"
                                        )}{" "}
                                        by{" "}
                                        <span style={{ color: "#4A58EC" }}>
                                            {userInfo.creatorId
                                                ? "Staff"
                                                : userInfo.name}
                                        </span>
                                    </p>
                                    <p
                                        className='mt-1'
                                        style={{ color: "#666666" }}
                                    >
                                        Last modified
                                    </p>
                                    <p>
                                        <CalendarOutlined
                                            style={{ color: "#4A58EC" }}
                                        />{" "}
                                        {moment(customerInfo.updatedAt).format(
                                            "MMMM D, YYYY"
                                        )}{" "}
                                    </p>
                                </div>

                                <div className='bg-white px-3 py-2 mt-3 '>
                                    <h2 className='font-bold'>
                                        Recent Activities
                                    </h2>
                                    <div className='mt-4'>
                                        <div className='flex flex-col justify-between gap-2'>
                                            {customerHistory.length === 0 ? (
                                                <Empty />
                                            ) : (
                                                <>
                                                    {customerHistory
                                                        .slice(
                                                            (historyPage - 1) *
                                                            2,
                                                            historyPage * 2
                                                        )
                                                        .map((item: any) => {
                                                            return (
                                                                <div
                                                                    key={
                                                                        item.id
                                                                    }
                                                                    className='flex flex-row justify-between items-center text-black'
                                                                >
                                                                    <p>
                                                                        <CalendarOutlined />{" "}
                                                                        {item.action ===
                                                                            "view_item" ? (
                                                                            <>
                                                                                View{" "}
                                                                                <Link
                                                                                    style={{
                                                                                        color: "#4A58EC",
                                                                                    }}
                                                                                    href={`/bussiness/products/dishes`}
                                                                                >
                                                                                    {
                                                                                        item.name
                                                                                    }
                                                                                </Link>
                                                                            </>
                                                                        ) : item.action ===
                                                                            "add_to_cart" ? (
                                                                            <>
                                                                                Add{" "}
                                                                                <Link
                                                                                    style={{
                                                                                        color: "#4A58EC",
                                                                                    }}
                                                                                    href={`/bussiness/products/dishes`}
                                                                                >
                                                                                    {
                                                                                        item.name
                                                                                    }
                                                                                </Link>{" "}
                                                                                to
                                                                                cart
                                                                            </>
                                                                        ) : item.action ===
                                                                            "order" ? (
                                                                            "Order food"
                                                                        ) : (
                                                                            ""
                                                                        )}
                                                                    </p>
                                                                    <p>
                                                                        {moment(
                                                                            item.createdAt
                                                                        ).format(
                                                                            "MMMM D, YYYY"
                                                                        )}
                                                                    </p>
                                                                </div>
                                                            );
                                                        })}
                                                    <div className='w-full h-auto flex justify-center'>
                                                        <Pagination
                                                            current={
                                                                historyPage
                                                            }
                                                            onChange={onChange}
                                                            total={
                                                                customerHistory.length
                                                            }
                                                            pageSize={2}
                                                        />
                                                    </div>
                                                </>
                                            )}
                                        </div>
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
