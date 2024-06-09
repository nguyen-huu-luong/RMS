"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import useSWR from "swr";
import FoodItem from "@/components/Product/item";
import { Pagination, ConfigProvider, Drawer } from "antd";
import type { PaginationProps } from "antd";
import PriceItem from "@/components/Product/price_item";
import { Modal } from "antd";
import { Radio, Form, Input, Button, DatePicker } from "antd";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next-intl/client";
import Link from "next-intl/link";
import fetchClient from "@/lib/fetch-client";
import Loading from "@/components/loading";
import useSocket from "@/socket";
import { message, notification } from "antd";
import { useLocale, useTranslations } from "next-intl";
import moment from "moment";

function Home() {
    const params = useParams<{ locale: string; tid: string }>();
    const [items, setItems] = useState<any>([]);
    const [currentCategory, setCurrentCategory] = useState<string>("Pizza");
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [finish, setFinish] = useState(false);
    const [ready, setReady] = useState<Boolean>(false);
    const [form] = Form.useForm();
    const { data: session, status } = useSession();
    const [checker, setChecker] = useState(true);
    const [item_status, updateItemStaus] = useState(true);
    const dateFormat = "YYYY-MM-DD";
    const router = useRouter();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [notifications, setNotifications] = useState<any>();
    const [table, setTable] = useState<any>()
    const [foods, setFood] = useState<any>()
    const [cart_items, setCart_Items] = useState<any>()
    const [categories, setCategories] = useState<any>()
    const [isLoading, setIsLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1);
    const [loadingButton, setLoadingButton] = useState(false)
    const [api_notification, contextHolder] = notification.useNotification();
    const t_general: any = useTranslations("General")
	const t_reservation: any = useTranslations("Reservation")
    const [category, setCategory] = useState<string>(
        currentCategory !== null ? currentCategory : "Pizza"
    );
    const dishColor: any = { "Preparing": "text-yellow-500", "Cooking": "text-green-500", "Ready": "text-blue-500" }

    const socket = useSocket();

    const showDrawer = () => {
        setDrawerOpen(true);
    };

    const onClose = () => {
        setDrawerOpen(false);
    };

    const showModal = () => {
        const current_items = cart_items.items
        console.log(current_items)
        if (current_items.some((e: any) => e.status != "Ready")) {
            api_notification.warning({
                message: 'Order Warning',
                description:
                    'There are some items in processing',
                onClick: () => {
                    console.log('Notification Clicked!');
                },
            });
        }
        else {
            setOpen(true);
        }
    };

    const handleUpdateTable = async () => {
        try {
            let table_status: string;
            if (table.status == "Free") {
                table_status = "Occupied";
            } else {
                table_status = "Free";
            }
            setTable({ ...table, status: table_status })

            await fetchClient({
                method: "PUT",
                url: `/tables/detail?id=${table.id}`,
                body: { status: table_status },
            });
            setChecker((current_value) => !current_value);
        }
        catch (err) {
            console.log(err)
        }
    };

    const fetchFood = async () => {
        try {
            const data = await fetchClient({ url: `/products/all`, data_return: true })
            setFood(data)
        }
        catch (err) {
            console.log(err)
        }
    }

    const fetchTable = async () => {
        try {
            const data = await fetchClient({ url: `/tables/detail?id=${params.tid}`, data_return: true })
            setTable(data)
        }
        catch (err) {
            console.log(err)
        }
    }

    const fetchCartItems = async () => {
        try {
            const data = await fetchClient({ url: `/tables/cart/${params.tid}`, data_return: true })
            console.log(data)
            setCart_Items(data)
        }
        catch (err) {
            console.log(err)
        }
    }

    const fetchCategory = async () => {
        try {
            const data = await fetchClient({ url: `/categories/all`, data_return: true })
            setCategories(data)
        }
        catch (err) {
            console.log(err)
        }
    }

    const fetchNotification = async () => {
        try {
            const data = await fetchClient({ url: `/pos_notifications/all`, data_return: true })
            setNotifications(data)
        }
        catch (err) {
            console.log(err)
        }
    }

    const onChange: PaginationProps["onChange"] = (page) => {
        setCurrentPage(page);
    };

    const getTotalAmount = () => {
        let total = 0;
        if (cart_items) {
            cart_items.items?.forEach((item: any) => {
                total += item.amount;
            });
        }

        items.forEach((item: any) => {
            total += item.quantity * item.price;
        });
        return total;
    };

    const handleOrder = async (values: any) => {
        try {
            let data_body = {
                email: values.email.trim(),
                firstname: values.first_name.trim(),
                lastname: values.last_name.trim(),
                pay_method: values.paymentMethod,
                phone: values.phone_number.trim(),
                birthday: values.birthday.format("YYYY-MM-DD"),
                type: "customer"
            };

            const data_return = await fetchClient({
                method: "POST",
                url: `/tables/order/${params.tid}`,
                body: data_body,
                data_return: true,
            });
            let table_status = "Free";
            if (data_body.pay_method == "CASH") {
                setTable({ ...table, status: table_status })
                await fetchClient({
                    method: "PUT",
                    url: `/tables/detail?id=${table.id}`,
                    body: { status: table_status },
                });
                router.push(
                    `/sale/reservations/payment?method=CASH?tid=${params.tid}`
                );
            } else {
                localStorage.setItem('orderInfo', "1")
                router.push(data_return.payUrl);
            }
            setChecker((current_value) => !current_value);
        } catch (err) {
            console.log(err);
        }
    };

    const addItem = async () => {
        try {
            if (table.status == "Free") {
                setTable({ ...table, status: "Occupied" })
                await fetchClient({
                    method: "PUT",
                    url: `/tables/detail?id=${table.id}`,
                    body: { status: "Occupied" },
                });
            }
            let data = await fetchClient({
                method: "PUT",
                url: `/tables/cart/${params.tid}`,
                body: items,
                data_return: true,
            });
            setCart_Items({ ...cart_items, items: data.items, products: data.products })
            setItems([]);
            setChecker((current_value) => !current_value);
            await socket.emit("staff:table:prepare", params.tid);
        } catch (err) {
            console.log(err);
        }
    };

    const handleCancelOrder = () => {
        setItems([]);
    };

    const getCustomerInfo = async () => {
        let email = form.getFieldValue('email')
        email = email.trim()
        if (email == "") {}
        else {
            const data: any = await  fetchClient({url: `/customers/all?email=${email}`, data_return: true})
            if (data.data.length != 0) {
                const customer: any = data.data[0]
                console.log(customer)
                form.setFieldsValue({"first_name": customer.firstname, "last_name": customer.lastname, "phone_number": customer.phone, "birthday": moment(customer.birthday)})
            }
        }
    }

    useEffect(() => {
        try {
            if (!socket) return;
            socket.on(
                "tableItem:finish:fromChef",
                async (tableId: string, name: string) => {
                    await fetchCartItems()
                    await fetchNotification()
                    message.info(`Finish ${name} for table ${tableId}`);
                }
            );
            return () => {
                socket.off("tableItem:finish:fromChef");
            };
        }
        catch (err) {
            console.log(err)
        }
    }, [socket]);

    useEffect(() => {
        setIsLoading(true)
        const fetchData = async () => {
            await fetchTable()
            await fetchCategory()
            await fetchFood()
            await fetchCartItems()
            await fetchNotification()
        };
    
        fetchData();
        setIsLoading(false)
    }, [])

    if (isLoading) {
        return <Loading />;
    }
    return (
        <div className='h-full relative overflow-hidden pb-10' >
            {contextHolder}
            <ConfigProvider
                theme={{
                    token: {
                        colorBgMask: "transparent",
                    },
                }}
            >
                <Drawer
                    title={t_reservation('notification')}
                    placement='right'
                    closable={false}
                    onClose={onClose}
                    open={drawerOpen}
                    getContainer={false}
                >
                    <div className='w-full h-full overflow-y-auto flex flex-col justify-start gap-2'>
                        {notifications && notifications.map((item: any) => {
                            return (
                                <div
                                    key={item.id}
                                    className='font-normal text-lg text-black'
                                >
                                    <span className='font-bold'>
                                        &#91;{`Table #${item.table}`}&#93;
                                    </span>
                                    - {item.content} -{" "}
                                    {moment(item.createdAt).format("hh:mm A")}
                                </div>
                            );
                        })}
                    </div>
                </Drawer>
            </ConfigProvider>

            {table && (
                <div
                    className='w-full bg-white flex flex-row justify-between items-center rounded pr-2 gap-5'
                    style={{ height: "40px" }}
                >
                    <div className='w-full flex items-center rounded h-full'>
                        <div className='w-full ml-3'>
                            {table.status == "Free" ? (
                                <button
                                    type='button'
                                    className='p-1 px-2 text-sm rounded border-0'
                                    style={{
                                        color: "white",
                                        backgroundColor: "#4A58EC",
                                    }}
                                    onClick={handleUpdateTable}
                                >
                                    {t_reservation('use')}
                                </button>
                            ) : (
                                <button
                                    onClick={handleUpdateTable}
                                    type='button'
                                    className='p-1 px-2 text-sm rounded border-0'
                                    style={{
                                        color: "white",
                                        backgroundColor: "#EA6A12",
                                    }}
                                >
                                    {t_reservation('free')}
                                </button>
                            )}
                        </div>
                    </div>
                    <div
                        className='w-full h-full flex flex-row items-center justify-end cursor-pointer'
                        onClick={showDrawer}
                    >
                        <div>
                            {notifications && notifications.length > 0 ? (
                                <div className='font-normal text-lg text-black'>
                                    <span className='font-bold'>
                                        &#91;
                                        {`Table #${notifications[0].table}`}
                                        &#93;{" "}
                                    </span>
                                    - {notifications[0].content} -{" "}
                                    {moment(notifications[0].createdAt).format(
                                        "hh:mm A"
                                    )}
                                </div>
                            ) : (
                                ""
                            )}
                        </div>
                    </div>
                </div>
            )}
            <div
                className='flex w-full gap-5 pb-3'
                style={{ height: "100%", paddingTop: "10px" }}
            >
                <Modal
                    title={t_reservation('make_payment')}
                    open={open}
                    confirmLoading={confirmLoading}
                    footer={(_, { OkBtn, CancelBtn }) => <></>}
                    onCancel={() => setOpen(false)}
                >
                    <Form form={form} layout='vertical' onFinish={handleOrder}>
                        <div className="flex justify-between">
                            <div style={{ width: "49%" }}>
                                <Form.Item
                                    name='first_name'
                                    label={
                                        <span className='whitespace-nowrap font-bold text-md'>
                                            {t_general('firstname')}
                                        </span>
                                    }
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please input customer's name!",
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder='First Name'
                                        style={{ marginTop: 8 }}
                                    />
                                </Form.Item>
                            </div>
                            <div style={{ width: "49%" }}>
                                <Form.Item
                                    name='last_name'
                                    label={
                                        <span className='whitespace-nowrap font-bold text-md'>
                                            {t_general('lastname')}
                                        </span>
                                    }
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please input customer's name!",
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder='Last Name'
                                        style={{ marginTop: 8 }}
                                    />
                                </Form.Item>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <div style={{ width: "49%" }}>
                                <Form.Item
                                    name='birthday'
                                    label={
                                        <span className='whitespace-nowrap font-bold text-md'>
                                            {t_general('birthday')}
                                        </span>
                                    }
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please input customer's birthday!",
                                        },
                                    ]}
                                >
                                    <DatePicker
                                        style={{ marginTop: 8, width: "100%" }}
                                        format={
                                            dateFormat
                                        }
                                    />
                                </Form.Item>
                            </div>
                            <div style={{ width: "49%" }}>
                                <Form.Item
                                    name='phone_number'
                                    label={
                                        <span className='whitespace-nowrap font-bold text-md'>
                                            {t_general('phone')}
                                        </span>
                                    }
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please input customer's phone number!",
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder='Phone number'
                                        style={{ marginTop: 8 }}
                                    />
                                </Form.Item>
                            </div>
                        </div>
                        <div className="flex justify-between">
                        <div style={{width: "85%"}}>
                                <Form.Item
                                    name='email'
                                    label={
                                        <span className='whitespace-nowrap font-bold text-md'>
                                            {t_general('email')}
                                        </span>
                                    }
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please input customer's email!",
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder='Email'
                                        style={{ marginTop: 8 }}
                                    />
                                </Form.Item>
                        </div>

                        <div >
                                <Form.Item>
                                    <p style={{visibility: "hidden", marginTop: "16px"}}>Check</p>
                                <Button  style={{
                                        color: "white",
                                        backgroundColor: "#EA6A12",
                                        
                                    }} className="flex-auto"  htmlType='button' onClick={getCustomerInfo}>Check</Button>
                                </Form.Item>   
                                </div>
                                </div>
                        <Form.Item
                            name='paymentMethod'
                            label={
                                <span className='whitespace-nowrap font-bold text-md'>
                                    {t_reservation('payment_method')}
                                </span>
                            }
                            rules={[
                                {
                                    required: true,
                                    message:
                                        "Please choose your payment method!",
                                },
                            ]}
                        >
                            <Radio.Group>
                                <div className='flex flex-col sm:flex-row items-center'>
                                    <Radio value='CASH'>
                                        <div className='flex flex-row gap-2 items-center'>
                                            <Image
                                                src={require("@/images/cash.png")}
                                                alt='Cash'
                                                width={30}
                                                height={30}
                                                unoptimized
                                            />
                                            <span> CASH </span>
                                        </div>
                                    </Radio>
                                    <Radio value='MOMO'>
                                        <div className='flex flex-row gap-2 items-center'>
                                            <Image
                                                src={require("@/images/momo.png")}
                                                alt='Momo'
                                                width={30}
                                                height={30}
                                                unoptimized
                                            />
                                            <span> MOMO </span>
                                        </div>
                                    </Radio>
                                </div>
                            </Radio.Group>
                        </Form.Item>
                        <div>
                            <Form.Item>
                                <div
                                    className='flex justify-end'
                                    style={{ width: "100%" }}
                                >
                                    <div className='pr-3'>
                                        <Button
                                            style={{
                                                backgroundColor: "#DB3A34",
                                                color: "white",
                                            }}
                                            htmlType='button'
                                            onClick={() => setOpen(false)}
                                        >
                                            {t_general('cancel')}
                                        </Button>
                                    </div>
                                    <div>
                                        <Button
                                            style={{
                                                backgroundColor: "#4A58EC",
                                                color: "white",
                                            }}
                                            htmlType='submit'
                                        >
                                            {t_general('confirm')}
                                        </Button>
                                    </div>
                                </div>
                            </Form.Item>
                        </div>
                    </Form>
                </Modal>
                <div className='rounded-xl bg-white basis-1/4 h-full p-5 text-black flex flex-col justify-between'>
                    {!finish ? (
                        <>
                            {cart_items && cart_items.items?.length != 0 ? (
                                <>
                                    <div
                                        className=' overflow-y-auto'
                                        style={{ maxHeight: "200px" }}
                                    >
                                        {cart_items.items.map((item: any) => {
                                            return (
                                                <>

                                                    <div
                                                        key={
                                                            cart_items
                                                                .products[
                                                                item
                                                                    .productId
                                                            ].name
                                                        }
                                                        className={`duration-300 transition-all ease-in-out w-auto ${dishColor[item.status]}`}
                                                    >
                                                        <PriceItem
                                                            params={{
                                                                food: {
                                                                    name: cart_items
                                                                        .products[
                                                                        item
                                                                            .productId
                                                                    ].name,
                                                                    price: cart_items
                                                                        .products[
                                                                        item
                                                                            .productId
                                                                    ].price,
                                                                    quantity:
                                                                        item.quantity,
                                                                },
                                                            }}
                                                        />
                                                    </div>

                                                </>
                                            );
                                        })}
                                    </div>
                                </>
                            ) : (
                                <div className='text-black'>
                                    {t_reservation('un_order')}
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            {" "}
                            <Link
                                locale={params.locale}
                                href={"/sale/reservations"}
                                className='p-2 w-full h-auto rounded-lg border-orange-500 border-2 bg-menu hover:bg-orange-400 text-white transition-all duration-300  flex justify-center tex-md font-bold cursor-pointer'
                            >
                                Back to reservation page
                            </Link>
                        </>
                    )}

                    {items.length != 0 && (
                        <div>
                            <hr />
                            <div
                                className='mt-1 overflow-y-auto'
                                style={{ maxHeight: "170px" }}
                            >
                                {items.map((item: any) => {
                                    return (
                                        <div
                                            key={`Food ${item.category} ${item.id}`}
                                            className='duration-300 transition-all ease-in-out w-auto'
                                        >
                                            <PriceItem
                                                params={{ food: item }}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                            <div className='text-center mt-2'>
                                <button
                                    className='px-2 py-1 rounded bg-red-600 text-white'
                                    onClick={handleCancelOrder}
                                >
                                    {t_general('cancel')}
                                </button>
                                <Button
                                    className='bg-menu px-1 py-1 border-t-menu rounded  text-white ml-4'
                                    onClick={addItem}
                                >
                                    {t_reservation('order')}
                                </Button>
                            </div>
                        </div>
                    )}

                    {cart_items && cart_items.items?.length != 0 && (
                        <div className='h-auto flex flex-col gap-2 justify-between'>
                            <div className='font-bold text-md py-2 border-t-menu border-t-2'>
                                {t_general('total')}: {getTotalAmount()}VNĐ
                            </div>
                            <div>
                                <div
                                    onClick={showModal}
                                    className='p-2 w-full h-auto rounded-lg border-orange-500 border-2 bg-menu hover:bg-orange-400 text-white transition-all duration-300  flex justify-center tex-md font-bold cursor-pointer'
                                >
                                    {t_reservation('make_payment')}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div
                    style={{ backgroundColor: "#FFC789" }}
                    className='rounded-xl basis-3/4 h-full p-5 flex flex-row justify-start gap-5'
                >
                    <div className='w-auto h-auto rounded-3xl bg-white py-2 flex flex-col justify-around'>
                        {categories?.map((item: any) => {
                            return (
                                <div
                                    key={`Category ${item.name}`}
                                    onClick={() => {
                                        setCategory(item.name);
                                        setCurrentPage(1);
                                    }}
                                    className={`font-bold cursor-pointer p-2 px-4${category === item.name
                                        ? " text-white bg-menu"
                                        : " bg-none text-menu"
                                        } transition-all duration-200`}
                                >
                                    {item.name}
                                </div>
                            );
                        })}
                    </div>
                    <div className='w-full h-full flex flex-col justify-between items-center gap-5'>
                        <div className='w-auto grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
                            {foods?.filter(
                                (item: any) =>
                                    category ===
                                    categories[
                                        parseInt(item.categoryId) - 1
                                    ]?.name
                            )
                                .slice((currentPage - 1) * 8, currentPage * 8)
                                .map((item: any) => {
                                    return (
                                        <div
                                            key={`Food ${item.category} ${item.id}`}
                                            className='duration-300 transition-all ease-in-out w-auto'
                                        >
                                            <FoodItem
                                                addProduct={setItems}
                                                items={items}
                                                params={{
                                                    food: item,
                                                    size: "sm",
                                                }}
                                            />
                                        </div>
                                    );
                                })}
                        </div>
                        <ConfigProvider
                            theme={{
                                token: {
                                    colorPrimary: "#EA6A12",
                                    colorPrimaryBorder: "rgb(255, 247, 237)",
                                    colorPrimaryHover: "rgb(251, 146, 60)",
                                },
                            }}
                        >
                            <Pagination
                                current={currentPage}
                                onChange={onChange}
                                total={
                                    foods?.filter(
                                        (food: any) =>
                                            category ===
                                            categories[
                                                parseInt(food.categoryId) - 1
                                            ]?.name
                                    ).length
                                }
                                pageSize={8}
                            />
                        </ConfigProvider>
                    </div>{" "}
                </div>
            </div>
        </div>
    );
}

export default Home;
