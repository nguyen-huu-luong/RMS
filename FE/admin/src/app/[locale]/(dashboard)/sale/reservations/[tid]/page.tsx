"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";
import FoodItem from "@/components/Product/item";
import { Pagination, ConfigProvider } from "antd";
import type { PaginationProps } from "antd";
import PriceItem from "@/components/Product/price_item";
import { Modal } from "antd";
import { Radio, Form, Input } from "antd";
import Image from "next/image";
import { createOrder } from "@/app/api/product/order";
import { useSession } from "next-auth/react";
import { useRouter } from "next-intl/client";
import Link from "next-intl/link";
import fetchClient from "@/lib/fetch-client";

const fetcher = (url: string) => fetch(url).then((r) => r.json());
function Home() {
    const params = useParams<{ locale: string; tid: string }>();
    const [items, setItems] = useState<any>([]);
    const [currentCategory, setCurrentCategory] = useState<string>("Pizza");
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [finish, setFinish] = useState(false);
    const [form] = Form.useForm();
    const { data: session, status } = useSession();
    const [checker, setChecker] = useState(true)
    const router = useRouter();

    const showModal = () => {
        console.log(items)
        setOpen(true);
    };

    const handleOk = async () => {
        setConfirmLoading(true);
        await handlePayOrder();
        // setTimeout(() => {
        //     setOpen(false);
        //     setConfirmLoading(false);
        // }, 2000);
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
        await fetchClient({method: "PUT",url: `/tables?id=${table.id}`, body: {"status": table_status}})
        setChecker((current_value) => !current_value)
    }

    const handlePayOrder = async () => {
        try {
            await form.validateFields();
            const formValues = form.getFieldsValue();
            const payMethod = formValues.paymentMethod;
            const dataBody = {
                clientId: 1,
                status: "Cooking",
                descriptions: "",
                shippingAddress: "At restaurant",
                shippingCost: 0,
                paymentMethod: formValues.paymentMethod,
                discountAmount: 0,
                products: items.map((item: any) => ({
                    productId: item.id,
                    quantity: item.quantity,
                })),
            };
            // setConfirmLoading(true);
            // const data = await createOrder(
            //     session?.user.accessToken,
            //     dataBody,
            //     formValues.paymentMethod
            // ).then(() => {
            //     setConfirmLoading(false);
            //     setOpen(false);
            //     setItems([]);
            //     setFinish(true);
            // });
        } catch (err) {
            console.log("Validation failed:", err);
            setConfirmLoading(false);
        }
    };

    const handleCancel = () => {
        setOpen(false);
    };
    const {
        data: foods,
        error: foodError,
        isLoading: foodLoading,
    } = useSWR(`${process.env.BASE_URL}/products/all`, fetcher);
    const [category, setCategory] = useState<string>(
        currentCategory !== null ? currentCategory : "Pizza"
    );

    const {
        data: table,
        error: tableError,
        isLoading: tableLoading,
    } = useSWR( [params.tid],
        ([table_id]) => fetchClient({url: `/tables?id=${table_id}`, data_return: true}));
    const [currentPage, setCurrentPage] = useState(1);
    const {
        data: categories,
        error: categoryError,
        isLoading: categoryLoading,
    } = useSWR(`${process.env.BASE_URL}/categories/all`, fetcher);
    const onChange: PaginationProps["onChange"] = (page) => {
        setCurrentPage(page);
    };
    const getTotalAmount = () => {
        let total = 0;
        items.forEach((item: any) => {
            total += item.quantity * item.price;
        });
        return total;
    };

    const handleOrder = () => {
        console.log(items)
    }

    if (foodError) return <div>Failed to load</div>;
    if (categoryError) return <div>Failed to load</div>;
    if (foodLoading || categoryLoading) return <div>Loading...</div>;
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
                    onOk={handleOk}
                    okButtonProps={{
                        style: { backgroundColor: "#EA6A12", color: "white" },
                    }}
                    confirmLoading={confirmLoading}
                    onCancel={handleCancel}
                >
                    <Form form={form} layout='vertical'>
                        <Form.Item
                            name='Name'
                            label={
                                <span className='whitespace-nowrap font-bold text-md'>
                                    Name
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
                            name='Phone Number'
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
                            name='Email'
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
                    </Form>
                </Modal>
                <div className='rounded-xl bg-white basis-1/4 h-full p-5 text-black flex flex-col justify-between'>
                    {!finish ? (
                        <>
                            {items.length != 0 ? (
                                <>
                                    <div className='gap-3 overflow-y-auto' style={{height: "45%"}}>
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
                                    <div className="text-center" onClick={handleOrder}>
                                        <button className="bg-menu px-1 py-1 border-t-menu rounded  text-white">Order</button>
                                    </div>
                                    <div className='h-auto flex flex-col gap-2 justify-between'>
                                        <div className='font-bold text-md py-2 border-t-menu border-t-2'>
                                            Total: {getTotalAmount()}VNĐ
                                        </div>
                                        <div
                                            onClick={showModal}
                                            className='p-2 w-full h-auto rounded-lg border-orange-500 border-2 bg-menu hover:bg-orange-400 text-white transition-all duration-300  flex justify-center tex-md font-bold cursor-pointer'
                                        >
                                            Make payment
                                        </div>
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
