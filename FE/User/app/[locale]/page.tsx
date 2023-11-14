"use client";
import Image from "next/image";
import Link from "next-intl/link";
import { useLocale, useTranslations } from "next-intl";
import Category from "../components/Menu/category";
import FoodItem from "../components/Menu/foodItem";
import FoodDetail from "../components/Menu/foodDetail";
import Progress from "../components/Order/progressBar";
import VoucherPicker from "../components/Order/voucherPicker";
import Slider from "../components/Home/slider";
import WelcomeImage from "../components/Home/welcome";
import { RightCircleFilled } from "@ant-design/icons";
import { useState } from "react";
import path from "path";

export default function Home() {
    const locale = useLocale();
    const t = useTranslations("Home");
    const [currentCategory, setCurrentCategory] = useState<string>("Pizza");

    // Modal for food detail
    const [modal, setModal] = useState<boolean>(false);
    const [detail, setDetail] = useState<{
        name: string;
        image: string;
        description: string;
        price: number;
        category: string;
    }>({
        name: "",
        image: "",
        description: "",
        price: 0,
        category: "",
    });
    const openModal = (item: typeof detail) => {
        setDetail(item);
        setModal(true);
    };
    const closeModal = () => {
        setModal(false);
    };

    const vouchers: {
        name: string;
        code: string;
        amount: number;
        description: string;
        category: string;
    }[] = [
        {
            name: "Voucher 1",
            code: "VCH123",
            amount: 50000,
            description: "Discount on selected items",
            category: "pizza",
        },
        {
            name: "Voucher 2",
            code: "VCH456",
            amount: 20000,
            description: "Special discount for members",
            category: "pizza",
        },
        {
            name: "Voucher 3",
            code: "VCH789",
            amount: 30000,
            description: "Limited time offer",
            category: "drink",
        },
        {
            name: "Voucher 10",
            code: "VCHXYZ",
            amount: 25000,
            description: "Weekend sale",
            category: "drink",
        },
        {
            name: "Voucher 10",
            code: "VCHXaYZ",
            amount: 25000,
            description: "Weekend sale",
            category: "drink",
        },
    ];
    const images: string[] = [
        "https://ict-imgs.vgcloud.vn/2022/05/13/17/shopeefood-ngay-15-sale-dong-gia-kham-pha-ngay-bo-suu-tap-mon-ngon-chi-tu-1-000-dong-2.jpg",
        "https://ict-imgs.vgcloud.vn/2022/05/13/17/shopeefood-ngay-15-sale-dong-gia-kham-pha-ngay-bo-suu-tap-mon-ngon-chi-tu-1-000-dong-1.jpg",
        "https://ict-imgs.vgcloud.vn/2022/05/13/17/shopeefood-ngay-15-sale-dong-gia-kham-pha-ngay-bo-suu-tap-mon-ngon-chi-tu-1-000-dong-2.jpg",
        "https://ict-imgs.vgcloud.vn/2022/05/13/17/shopeefood-ngay-15-sale-dong-gia-kham-pha-ngay-bo-suu-tap-mon-ngon-chi-tu-1-000-dong-1.jpg",
        "https://ict-imgs.vgcloud.vn/2022/05/13/17/shopeefood-ngay-15-sale-dong-gia-kham-pha-ngay-bo-suu-tap-mon-ngon-chi-tu-1-000-dong-2.jpg",
        "https://ict-imgs.vgcloud.vn/2022/05/13/17/shopeefood-ngay-15-sale-dong-gia-kham-pha-ngay-bo-suu-tap-mon-ngon-chi-tu-1-000-dong-1.jpg",
    ];
    const category: string[] = [
        "Pizza",
        "Drink",
        "Fruits",
        "Hotdog",
        "Snacks",
        "Burger",
        "Veggies",
    ];
    const foods: {
        name: string;
        image: string;
        description: string;
        price: number;
        category: string;
    }[] = category.flatMap((item) => {
        return Array.from({ length: 6 }, (_, index) => ({
            name: `${item} ${index}`,
            image: "https://img.dominos.vn/cach-lam-pizza-thap-cam-2.jpg",
            description:
                "Pizza, dish of Italian origin consisting of a flattened disk of bread dough topped with some combination of olive oil, oregano, tomato, olives, mozzarella or other cheese, and many other ingredients",
            price: 50000,
            category: item,
        }));
    });

    return (
        <div className='h-auto py-4 flex flex-col justify-center items-center gap-10'>
            {/* Home welcome and carousel banner */}
            <div className='w-80 h-auto flex flex-col sm:flex-row sm:w-full gap-5'>
                <WelcomeImage params={{ name: "Nguyen Huu A" }} />
                <div className='w-80 h-80 flex-none'>
                    <Slider params={{ images: images }} />
                </div>
            </div>

            {/* Menu Category */}
            <div className='flex flex-col justify-start w-full h-auto gap-10'>
                <div className='flex flex-row justify-between text-menu items-center '>
                    <div className='font-extrabold text-2xl font-serif'>
                        Menu Category
                    </div>

                    <Link
                        href={{
                            pathname: "/menu",
                        }}
                        locale={locale}
                        className='flex gap-2 w-auto items-center cursor-pointer'
                    >
                        <span className='text-md'>View all</span>
                        <span className='text-primary'>
                            <RightCircleFilled />
                        </span>
                    </Link>
                </div>
                <div className='w-full h-auto flex flex-col justify-center items-center'>
                    <div className='w-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-6 lg:gap-10 items-center'>
                        {category.map((item, index) => {
                            return (
                                <div
                                    key={`Category ${index}`}
                                    onClick={() => setCurrentCategory(item)}
                                >
                                    <Category
                                        params={{
                                            category: item,
                                            state: item !== currentCategory,
                                        }}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className='w-full h-auto flex flex-col justify-center items-center'>
                    <div className='w-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-6 lg:gap-10 items-center'>
                        {foods
                            .filter((item) => item.category === currentCategory)
                            .slice(0, 6)
                            .map((item, index) => {
                                return (
                                    <div
                                        key={`Food ${item.category} ${index}`}
                                        className='duration-300 transition-all ease-in-out'
                                        onClick={() => setDetail(item)}
                                    >
                                        <FoodItem
                                            params={{
                                                food: item,
                                                size: "sm",
                                                openModal: openModal,
                                            }}
                                        />
                                    </div>
                                );
                            })}
                    </div>
                </div>
            </div>
            {/* Trending orders */}
            <div className='flex flex-col justify-start w-full h-auto gap-10'>
                <div className='flex flex-row justify-between text-menu items-center'>
                    <div className='font-extrabold text-2xl font-serif'>
                        Trending Orders
                    </div>
                </div>
                <div className='w-full h-auto flex flex-col justify-center items-center'>
                    <div className='w-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-6 lg:gap-10 items-center'>
                        {foods
                            .filter((item) => item.category === currentCategory)
                            .slice(0, 6)
                            .map((item, index) => {
                                return (
                                    <div
                                        key={`Food ${item.category} ${index}`}
                                        className='duration-300 transition-all ease-in-out'
                                        onClick={() => setDetail(item)}
                                    >
                                        <FoodItem
                                            params={{
                                                food: item,
                                                size: "sm",
                                                openModal: openModal,
                                            }}
                                        />
                                    </div>
                                );
                            })}
                    </div>
                </div>
            </div>
            {modal && <FoodDetail food={detail} closeModal={closeModal} />}
            {/*             
            <FoodDetail params={{ food: foods[0] }} />
            <br></br>
            <Progress />
            <br></br>
            <VoucherPicker params={{ vouchers: vouchers }} /> */}
        </div>
    );
}
