"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import useSWR from "swr";
import FoodItem from "@/components/Product/item";
import { Pagination, ConfigProvider } from "antd";
import type { PaginationProps } from "antd";
import PriceItem from "@/components/Product/price_item";
import { Modal } from "antd";
import { Radio, Form, Input, Button } from "antd";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next-intl/client";
import Link from "next-intl/link";
import fetchClient from "@/lib/fetch-client";

function Home() {
    const params = useParams<{ locale: string; tid: string }>();
    const [items, setItems] = useState<any>([]);
    // const [cart_items, setCartItems] = useState<any>([]);
    const [currentCategory, setCurrentCategory] = useState<string>("Pizza");
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [finish, setFinish] = useState(false);
    const [form] = Form.useForm();
    const { data: session, status } = useSession();
    const [checker, setChecker] = useState(true)
    const [item_status, updateItemStaus] = useState(true)
    const router = useRouter();

    const showModal = () => {
        setOpen(true);
    };


    const handleUpdateTable = async () => {
        let table_status: string
        if (table.status == "Free") {
            table_status = "Occupied"
        }
        else {
            table_status = "Free"
        }
        table.status = table_status
        await fetchClient({ method: "PUT", url: `/tables?id=${table.id}`, body: { "status": table_status } })
        setChecker((current_value) => !current_value)
    }

    const {
        data: foods,
        error: foodError,
        isLoading: foodLoading,
    } = useSWR([`/products/all`], ([url]) => fetchClient({ url: url, data_return: true }));
    const [category, setCategory] = useState<string>(
        currentCategory !== null ? currentCategory : "Pizza"
    );

    const {
        data: table,
        error: tableError,
        isLoading: tableLoading,
    } = useSWR([params.tid],
        ([table_id]) => fetchClient({ url: `/tables?id=${table_id}`, data_return: true }));
    const [currentPage, setCurrentPage] = useState(1);

    let {
        data: cart_items,
        error: cart_itemsError,
        isLoading: cart_itemsLoading,
    } = useSWR([`/tables/cart/${params.tid}`], ([url]) => fetchClient({ url: url, data_return: true }));

    const {
        data: categories,
        error: categoryError,
        isLoading: categoryLoading,
    } = useSWR([`/categories/all`], ([url]) => fetchClient({ url: url, data_return: true }));

    const onChange: PaginationProps["onChange"] = (page) => {
        setCurrentPage(page);
    };

    const getTotalAmount = () => {
        let total = 0;
        if (cart_items) {
            cart_items.items?.forEach((item: any) => {
                total += item.amount;
            })
        }

        items.forEach((item: any) => {
            total += item.quantity * item.price;
        });
        return total;
    };

    const handleOrder = async (values: any) => {
        try {
            let data_body = {
                "email": values.email,
                "firstname": values.first_name,
                "lastname": values.last_name,
                "pay_method": values.paymentMethod,
                "phone": values.phone_number
            }
            const data_return = await fetchClient({ method: "POST", url: `/tables/order/${params.tid}`, body: data_body, data_return: true })
            let table_status = "Free"
            if (data_body.pay_method == "CASH") {
                table.status = table_status
                await fetchClient({ method: "PUT", url: `/tables?id=${table.id}`, body: { "status": table_status } })
                router.push(`/sale/reservations/payment?method=CASH?tid=${params.tid}`);
            }
            else {
                router.push(data_return.payUrl);
            }
            setChecker((current_value) => !current_value)
        }
        catch (err) {
            console.log(err)
        }
    }

    const addItem = async () => {
        try {
            if (table.status == "Free") {
                table.status = "Occupied"
                await fetchClient({ method: "PUT", url: `/tables?id=${table.id}`, body: { "status": "Occupied" } })
            }
            let data = await fetchClient({ method: "PUT", url: `/tables/cart/${params.tid}`, body: items, data_return: true })
            cart_items.items = data.items
            cart_items.products = data.products
            setItems([])
            setChecker((current_value) => !current_value)
        }
        catch (err) {
            console.log(err)
        }
    }

    const handleCancelOrder = () => {
        setItems([])
    }

    if (foodError) return <div>Failed to load</div>;
    if (categoryError) return <div>Failed to load</div>;
    if (foodLoading || categoryLoading || cart_itemsLoading) return <div>Loading...</div>;
    if (status === "loading") return <div>Loading.....</div>;
    if (status === "unauthenticated") router.push("/signin");


    return (
        <div className="h-full relative">
            {
                table && <div className="w-full bg-white absolute flex items-center rounded" style={{ height: "40px" }}>
                    <div className="inline-block ml-3">
                        {
                            table.status == "Free" ? <button type="button" className="p-1 px-2 text-sm rounded border-0" style={{ color: "white", backgroundColor: "#4A58EC" }} onClick={handleUpdateTable}>Use</button>
                                : <button onClick={handleUpdateTable} type="button" className="p-1 px-2 text-sm rounded border-0" style={{ color: "white", backgroundColor: "#EA6A12" }}>Free</button>
                        }
                    </div>
                </div>
            }
            <div className='flex w-full gap-5 pb-3' style={{ height: "100%", paddingTop: "50px" }}>
                <Modal
                    title='Make payment'
                    open={open}
                    confirmLoading={confirmLoading}
                    footer={(_, { OkBtn, CancelBtn }) => (<></>)}
                    onCancel={() => setOpen(false)}
                >
                    <Form form={form} layout='vertical' onFinish={handleOrder}>
                        <Form.Item
                            name='first_name'
                            label={
                                <span className='whitespace-nowrap font-bold text-md'>
                                    First Name
                                </span>
                            }
                            rules={[
                                {
                                    required: true,
                                    message: "Please input customer's name!",
                                },
                            ]}
                        >
                            <Input placeholder='Name' style={{ marginTop: 8 }} />
                        </Form.Item>
                        <Form.Item
                            name='last_name'
                            label={
                                <span className='whitespace-nowrap font-bold text-md'>
                                    Last Name
                                </span>
                            }
                            rules={[
                                {
                                    required: true,
                                    message: "Please input customer's name!",
                                },
                            ]}
                        >
                            <Input placeholder='Name' style={{ marginTop: 8 }} />
                        </Form.Item>
                        <Form.Item
                            name='phone_number'
                            label={
                                <span className='whitespace-nowrap font-bold text-md'>
                                    Phone number
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

                        <Form.Item
                            name='email'
                            label={
                                <span className='whitespace-nowrap font-bold text-md'>
                                    Email
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
                                placeholder='Phone number'
                                style={{ marginTop: 8 }}
                            />
                        </Form.Item>

                        <Form.Item
                            name='paymentMethod'
                            label={
                                <span className='whitespace-nowrap font-bold text-md'>
                                    Payment Method
                                </span>
                            }
                            rules={[
                                {
                                    required: true,
                                    message: "Please choose your payment method!",
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
                        <div >
                            <Form.Item >
                                <div className='flex justify-end' style={{ width: "100%" }}>
                                    <div className='pr-3'>
                                        <Button style={{ backgroundColor: "#DB3A34", color: "white" }} htmlType='button' onClick={() => setOpen(false)}>Cancel</Button>
                                    </div>
                                    <div>
                                        <Button style={{ backgroundColor: "#4A58EC", color: "white" }} htmlType="submit">Confirm</Button>
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
                                    <div className=' overflow-y-auto' style={{ maxHeight: "200px" }}>
                                        {cart_items.items.map((item: any) => {
                                            return (
                                                <>
                                                    {
                                                        item.status == "Preparing" ?
                                                            <div
                                                                key={cart_items.products[item.productId].name}
                                                                className='duration-300 transition-all ease-in-out w-auto  text-yellow-500'
                                                            >
                                                                <PriceItem
                                                                    params={{ food: { name: cart_items.products[item.productId].name, price: cart_items.products[item.productId].price, quantity: item.quantity } }}
                                                                />
                                                            </div> : <div
                                                                key={cart_items.products[item.productId].name}
                                                                className='duration-300 transition-all ease-in-out w-auto text-blue-500'
                                                            >
                                                                <PriceItem
                                                                    params={{ food: { name: cart_items.products[item.productId].name, price: cart_items.products[item.productId].price, quantity: item.quantity } }}
                                                                />
                                                            </div>
                                                    }
                                                </>
                                            );
                                        })}
                                    </div>

                                </>
                            ) : (
                                <div className='text-black'>
                                    You have not added any product!
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
                            <div className='mt-1 overflow-y-auto' style={{ maxHeight: "170px" }}>
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
                            <div className="text-center mt-2" >
                                <button className="px-2 py-1 rounded bg-red-600 text-white" onClick={handleCancelOrder}>Cancel</button>
                                <button className="bg-menu px-1 py-1 border-t-menu rounded  text-white ml-4" onClick={addItem}>Order</button>
                            </div>
                        </div>
                    )}

                    {cart_items && cart_items.items?.length != 0 &&
                        (<div className='h-auto flex flex-col gap-2 justify-between'>
                            <div className='font-bold text-md py-2 border-t-menu border-t-2'>
                                Total: {getTotalAmount()}VNĐ
                            </div>
                            <div
                                onClick={showModal}
                                className='p-2 w-full h-auto rounded-lg border-orange-500 border-2 bg-menu hover:bg-orange-400 text-white transition-all duration-300  flex justify-center tex-md font-bold cursor-pointer'
                            >
                                Make payment
                            </div>
                        </div>)
                    }


                </div>
                <div
                    style={{ backgroundColor: "#FFC789" }}
                    className='rounded-xl basis-3/4 h-full p-5 flex flex-row justify-start gap-5'
                >
                    <div className='w-auto h-auto rounded-3xl bg-white py-2 flex flex-col justify-around'>
                        {categories.map((item: any) => {
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
                            {foods
                                .filter(
                                    (item: any) =>
                                        category ===
                                        categories[parseInt(item.categoryId) - 1]
                                            ?.name
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
                                                params={{ food: item, size: "sm" }}
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
                                    foods.filter(
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
