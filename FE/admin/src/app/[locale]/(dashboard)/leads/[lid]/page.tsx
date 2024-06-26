"use client";
import { useEffect, useState } from "react";
import {
    EditOutlined,
    EllipsisOutlined,
    CalendarOutlined,
    ArrowRightOutlined,
    UserOutlined,
    CloseCircleFilled,
    MessageOutlined,
    UploadOutlined,
} from "@ant-design/icons"; 
import { Pagination, Space, Table, Tag, Upload, message } from "antd";
import type { PaginationProps, TableProps, UploadProps } from "antd";
import { Empty } from "antd";
import useSWR from "swr";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import fetchClient from "@/lib/fetch-client";
import Loading from "@/components/loading";
import moment from "moment";
import Link from "next-intl/link";
import { useRouter } from "next-intl/client";
import { useLocale, useTranslations } from "next-intl";
import { uploadImage } from "@/app/api/upload";

const LeadProfile = () => {
    const router = useRouter()
    const editStyle = {
        outline: "0",
        backgroundColor: "#F6FAFD",
        border: "1px solid #DADAD9",
        paddingLeft: "5px",
    };
    const normalStyle = {
        outline: "0",
        backgroundColor: "",
        border: "",
        paddingLeft: "",
    };
    const tabStyle_ = [
        "inline-block p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500",
        "inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300",
    ];
    const params = useParams<{ locale: string; lid: string }>();
    const [tabStyle, setTabStyle] = useState(tabStyle_);
    const [tab, setTab] = useState(0);
    const [editFlag, setFlag] = useState(true);
    const [style, setStyle] = useState(normalStyle);
    const [user, setUser] = useState(null);
    const [checker, setChecker] = useState(0);
    const [history, setHistory] = useState<any>([]);
    const [historyPage, setHistoryPage] = useState(1);
    const [imageUrl, setImageUrl] = useState(null);
    const [creator, setCreator] = useState("")
    const t_general: any = useTranslations("General")
	const t_customer: any = useTranslations("Customer")
    const onChange: PaginationProps["onChange"] = (page) => {
        setHistoryPage(page);
    };
    const {
        data: leadInfo,
        error: leadInfoError,
        isLoading: leadInfoLoading,
    } = useSWR(params.lid, (lid) =>
        fetchClient({ url: `/customers/${lid}`, data_return: true })
    );

    let userInfo: any;
    useEffect(() => {
        const fetchData = async () => {
            if (leadInfo) {
                try {
                    const response = await fetchClient({
                        url: `/clienthistories/${params.lid}`,
                        data_return: true,
                    });
                    const newResponse = await Promise.all(
                        response.map(async (item: any) => {
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
                    if (leadInfo.creatorId){
                        const creator = await fetchClient({
                            url: `/employees/${leadInfo.creatorId}`,
                            data_return: true,
                        }); 
                        setCreator(creator.firstname + " " + creator.lastname) 
                    }
                    setHistory(newResponse);
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            }
        };
        fetchData();
    }, [leadInfo]);

    if (leadInfoLoading) {
        return (
            <>
                <Loading />
            </>
        );
    } else {
        if (leadInfo) {
            userInfo = {
                name: leadInfo.firstname + " " + leadInfo.lastname,
                address: leadInfo.address,
                source: leadInfo.source,
                score: leadInfo.score,
                gender: String(leadInfo.gender),
                phone: leadInfo.phone,
                birthday: leadInfo.birthday
                    ? leadInfo.birthday.split("T")[0]
                    : leadInfo.birthday,
                email: leadInfo.email,
                createdAt: leadInfo.createdAt,
                creatorId: leadInfo.creatorId,
            };
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
            setImageUrl(data.url);
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
        setTab(num);
    };

    const handelEditButton = () => {
        setFlag(false);
        setStyle(editStyle);
    };

    const handelCancelButton = () => {
        setFlag(true);
        setStyle(normalStyle);
    };

    const handelSubmit = async (event: any) => {
        event.preventDefault();
        if (checker == 0) {
            event.target.username.value = userInfo.name;
            event.target.gender.value = userInfo.gender
                ? userInfo.gender
                : "none";
            event.target.birthday.value = userInfo.birthday
                ? userInfo.birthday
                : "";
            event.target.source.value = userInfo.source
                ? userInfo.source
                : "none";
            event.target.email.value = userInfo.email ? userInfo.email : "None";
            event.target.phone.value = userInfo.phone ? userInfo.phone : "None";
            event.target.address.value = userInfo.address
                ? userInfo.address
                : "None";
            setImageUrl(leadInfo.avatar);
        } else {
            let name = event.target.username.value.split(" ");
            let first_name = name[0];
            let last_name = name
                .slice(1)
                .reduce((item: any, break_: any) => item + break_ + " ", "");

            let data = {
                email:
                    event.target.email.value == "None"
                        ? userInfo.email
                        : event.target.email.value,
                phone:
                    event.target.phone.value == "None"
                        ? userInfo.phone
                        : event.target.phone.value,
                address:
                    event.target.address.value == "None"
                        ? userInfo.address
                        : event.target.address.value,
                gender:
                    event.target.gender.value == "none"
                        ? userInfo.gender
                        : event.target.gender.value,
                source:
                    event.target.source.value == "none"
                        ? userInfo.source
                        : event.target.source.value,
                birthday:
                    event.target.birthday.value == ""
                        ? userInfo.birthday
                        : event.target.birthday.value,
                firstname: first_name,
                lastname: last_name.trim(),
                avatar: imageUrl,
            };
            await fetchClient({
                url: `/customers/${params.lid}`,
                method: "PUT",
                body: data,
            });
        }
        setFlag(true);
        setStyle(normalStyle);
    };

    interface ActivityDataType {
        key: string;
        name: string;
        types: string[];
        date: string;
    }

    const columns_activity: TableProps<ActivityDataType>["columns"] = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            render: (text) => <a>{text}</a>,
        },
        {
            title: "Type",
            key: "types",
            dataIndex: "types",
            render: (_, { types }) => (
                <>
                    {types.map((type) => {
                        let color = type.length > 5 ? "geekblue" : "green";
                        if (type === "loser") {
                            color = "volcano";
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
            title: "Date",
            dataIndex: "date",
            key: "date",
            render: (text) => (
                <a>
                    <CalendarOutlined style={{ color: "#4A58EC" }} /> {text}
                </a>
            ),
        },
    ];

    const businessData: ActivityDataType[] = [
        {
            key: "1",
            name: "Send “Happy birthday” automated email",
            types: ["Automation"],
            date: "2011-09-29",
        },
    ];

    const userData: ActivityDataType[] = [
        {
            key: "1",
            name: "Request an order",
            types: ["Order"],
            date: "2011-09-29",
        },
    ];
    return (
        <>
            {leadInfo ? (
                <div
                    className='text-sm font-medium'
                    style={{ backgroundColor: "#F8F8F8" }}
                >
                    {editFlag && (
                        <div className='inline-block'>
                            <button
                                onClick={handelEditButton}
                                type='button'
                                className='p-1 px-1'
                                style={{
                                    border: "1px solid #DADAD9",
                                    borderRadius: "4px 0px 0px 4px",
                                    backgroundColor: "#F9FAFB",
                                }}
                                id='bt1'
                            >
                                {" "}
                                <EditOutlined /> {t_general('edit')}
                            </button>
                            <button
                                className='p-1 px-1'
                                type='button'
                                style={{
                                    borderWidth: "1px 1px 1px 0px",
                                    borderBlockColor: "#DADAD9",
                                    borderStyle: "solid",
                                    borderRadius: "0px 4px 4px 0px",
                                    backgroundColor: "#F9FAFB",
                                }}
                                onClick={() =>
                                    router.push(`/chat?id=${leadInfo.id}`)
                                }
                            >
                                <MessageOutlined />
                            </button>
                        </div>
                    )}
                    <form onSubmit={(e) => handelSubmit(e)}>
                        {!editFlag && (
                            <div className='inline-block'>
                                <button
                                    className='p-1 px-1 text-white'
                                    style={{
                                        border: "1px solid #DADAD9",
                                        borderRadius: "4px 0px 0px 4px",
                                        backgroundColor: "#4A58EC",
                                    }}
                                    id='bt2'
                                    onClick={() => setChecker(1)}
                                >
                                    {t_general('save')}
                                </button>
                                <button
                                    className='p-1 px-1'
                                    style={{
                                        borderWidth: "1px 0px 1px 0px",
                                        borderBlockColor: "#DADAD9",
                                        borderStyle: "solid",
                                        backgroundColor: "#F9FAFB",
                                    }}
                                    onClick={() => setChecker(0)}
                                >
                                    {t_general('cancel')}
                                </button>
                                <button
                                    className='p-1 px-1'
                                    type='button'
                                    style={{
                                        borderWidth: "1px 1px 1px 1px",
                                        borderBlockColor: "#DADAD9",
                                        borderStyle: "solid",
                                        borderRadius: "0px 4px 4px 0px",
                                        backgroundColor: "#F9FAFB",
                                    }}
                                >
                                    <EllipsisOutlined />
                                </button>
                            </div>
                        )}
                        <div className='mt-3 grid grid-cols-3 gap-4'>
                            <div className='col-span-2'>
                                <div className='bg-white pl-3 py-2'>
                                    <h1 className='font-bold'>{t_customer('overview')}</h1>
                                    <div className='mt-3 grid grid-cols-5 gap-4'>
                                    <div
                                            className='relative'
                                            style={{
                                                width: "120px",
                                                height: "120px",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: "120px",
                                                    height: "120px",
                                                }}
                                            >
                                                <img
                                                    style={{
                                                        width: "120px",
                                                        height: "120px",
                                                    }}
                                                    src={imageUrl ? imageUrl : leadInfo.avatar}
                                                    className='rounded'
                                                />
                                            </div>
                                            <div>
                                                <Upload
                                                    {...props}
                                                    accept='image/*'
                                                    showUploadList={false}
                                                    listType='picture'
                                                    maxCount={1}
                                                >
                                                    {!editFlag && (
                                                        <button
                                                            type='button'
                                                            className='absolute'
                                                            style={{
                                                                top: "80%",
                                                                left: "50%",
                                                                transform:
                                                                    "translateX(-50%)",
                                                            }}
                                                        >
                                                            <UploadOutlined
                                                                style={{
                                                                    fontWeight:
                                                                        "20px",
                                                                    fontSize:
                                                                        "20px",
                                                                    color: "gray",
                                                                }}
                                                            />
                                                        </button>
                                                    )}
                                                </Upload>
                                            </div>
                                        </div>
                                        <div>
                                            <p className='font-bold'>{t_general('name')}</p>
                                            <input
                                                className='rounded-md py-1.5 w-40'
                                                defaultValue={userInfo.name}
                                                style={style}
                                                readOnly={editFlag}
                                                name='username'
                                            ></input>
                                        </div>
                                        <div className='ml-5 pl-4'>
                                            <p className='font-bold '>{t_general('gender')}</p>
                                            <select
                                                className='rounded-md py-1.5'
                                                defaultValue={
                                                    userInfo.gender
                                                        ? userInfo.gender
                                                        : "none"
                                                }
                                                style={style}
                                                disabled={editFlag}
                                                name='gender'
                                            >
                                                <option value={"false"}>
                                                {t_general('female')}
                                                </option>
                                                <option value={"true"}>
                                                {t_general('male')}
                                                </option>
                                                <option value={"none"}>
                                                    None
                                                </option>
                                            </select>
                                        </div>
                                        <div>
                                            <p className='font-bold'>
                                            {t_general('birthday')}
                                            </p>
                                            <div>
                                                <input
                                                    className='rounded-md py-1'
                                                    type='date'
                                                    defaultValue={
                                                        userInfo.birthday
                                                            ? userInfo.birthday
                                                            : ""
                                                    }
                                                    style={style}
                                                    readOnly={editFlag}
                                                    name='birthday'
                                                ></input>
                                            </div>
                                        </div>

                                        <div>
                                            <p className='font-bold '>{t_general('source')}</p>
                                            <select
                                                className='rounded-md py-1.5'
                                                defaultValue={
                                                    userInfo.source
                                                        ? userInfo.source
                                                        : "none"
                                                }
                                                style={style}
                                                disabled={editFlag}
                                                name='source'
                                            >
                                                <option value={"Tiktok"}>
                                                    Tiktok
                                                </option>
                                                <option value={"Facebook"}>
                                                    Facebook
                                                </option>
                                                <option value={"Website"}>
                                                    Website
                                                </option>
                                                <option value={"At Restaurant"}>
                                                    At Restaurant
                                                </option>
                                                <option value={"none"}>
                                                    None
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className='mt-3 grid grid-cols-4 gap-12'>
                                        <div>
                                            <p className='font-bold'>{t_general('email')}</p>
                                            <div>
                                                <input
                                                    type='text'
                                                    defaultValue={
                                                        userInfo.email
                                                            ? userInfo.email
                                                            : "None"
                                                    }
                                                    className='rounded-md py-1'
                                                    style={{outline: "0", backgroundColor: "", border: "", paddingLeft: ""}}
                                                    name='email'
                                                ></input>
                                            </div>
                                        </div>

                                        <div>
                                            <p className='font-bold'>{t_general('phone')}</p>
                                            <div>
                                                <input
                                                    type='phone'
                                                    defaultValue={
                                                        userInfo.phone
                                                            ? userInfo.phone
                                                            : "None"
                                                    }
                                                    className='rounded-md py-1 '
                                                    style={style}
                                                    readOnly={editFlag}
                                                    name='phone'
                                                ></input>
                                            </div>
                                        </div>
                                        <div className='col-span-2 pr-2'>
                                            <p className='font-bold'>{t_general('address')}</p>
                                            <textarea
                                                rows={2}
                                                className='w-full rounded-md py-1 resize-none'
                                                defaultValue={
                                                    userInfo.address
                                                        ? userInfo.address
                                                        : "None"
                                                }
                                                readOnly={editFlag}
                                                style={style}
                                                name='address'
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className='bg-white pl-3 py-2'>
                                    <p style={{ color: "#666666" }}>
                                    {t_general('created_at')}
                                    </p>
                                    <p>
                                        <CalendarOutlined
                                            style={{ color: "#4A58EC" }}
                                        />{" "}
                                        {moment(leadInfo.createdAt).format(
                                            "MMMM D, YYYY"
                                        )}{" "}
                                        by{" "}
                                        <span style={{ color: "#4A58EC" }}>
                                            {leadInfo.creatorId
                                                ? creator
                                                : userInfo.name}
                                        </span>
                                    </p>
                                    <p
                                        className='mt-1'
                                        style={{ color: "#666666" }}
                                    >
                                        {t_general('last_modified')}
                                    </p>
                                    <p>
                                        <CalendarOutlined
                                            style={{ color: "#4A58EC" }}
                                        />{" "}
                                        {moment(leadInfo.updatedAt).format(
                                            "MMMM D, YYYY"
                                        )}{" "}
                                    </p>
                                </div>

                                <div className='bg-white px-3 py-2 mt-3 '>
                                    <h2 className='font-bold'>
                                    {t_general('recent_activities')}
                                    </h2>
                                    <div className='mt-4'>
                                        <div className='flex flex-col justify-between gap-2'>
                                            {history.length === 0 ? (
                                                <Empty />
                                            ) : (
                                                <>
                                                    {history
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
                                                                                {t_general('view')}{" "}
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
                                                                               {t_general('add')}{" "}
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
                                                                                {t_customer('to_cart')}
                                                                            </>
                                                                        ) : item.action ===
                                                                          "order" ? (
                                                                            <>{t_customer('order_food')}</>
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
                                                                history.length
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
                </div>
            ) : (
                <p>Loading</p>
            )}
        </>
    );
};

export default LeadProfile;
