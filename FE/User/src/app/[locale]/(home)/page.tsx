"use client";
import Link from "next-intl/link";
import { useLocale, useTranslations } from "next-intl";
import Category from "@/components/menu/category";
import FoodItem from "@/components/menu/foodItem";
import FoodDetail from "@/components/menu/foodDetail";
import Slider from "@/components/home/slider";
import WelcomeImage from "@/components/home/welcome";
import { RightCircleFilled } from "@ant-design/icons";
import { useState } from "react";
import { Skeleton } from "antd";
import useSWR from "swr";
// import {createOrder} from "../../api/product/order"
// import { useRouter } from 'next/navigation';

const fetcher = (url: string) => fetch(url).then((r) => r.json());
export default function Home() {
    // const router = useRouter();
    // const createOrder = async () => {
    //     console.log("haha")
    //     try {
    //       const response = await fetch("http://localhost:3003/api/orders", {
    //         method: 'POST'
    //     })
    //     const data = await response.json()
    //     router.push(data['payUrl']);
    //       } catch (error) {
    //         console.error('Error adding to cart:', error);
    //         throw error;
    //       }
    //   };
      


    const locale = useLocale();
    const t = useTranslations("Home");
    const [currentCategory, setCurrentCategory] = useState<string>("Pizza");
    const {
        data: food,
        error: foodError,
        isLoading: foodLoading,
    } = useSWR(`${process.env.BASE_URL}/products/all`, fetcher);
    const {
        data: category,
        error: categoryError,
        isLoading: categoryLoading,
    } = useSWR(`${process.env.BASE_URL}/categories/all`, fetcher);
    // Modal for food detail
    const [modal, setModal] = useState<boolean>(false);
    const [detail, setDetail] = useState<{
        id: number;
        name: string;
        thumbnails: string;
        description: string;
        price: number;
        categoryId: string;
    }>({
        id: 0,
        name: "",
        thumbnails: "",
        description: "",
        price: 0,
        categoryId: "",
    });
    const openModal = (item: typeof detail) => {
        setDetail(item);
        setModal(true);
    };
    const closeModal = () => {
        setModal(false);
    };
    const images: string[] = [
        "https://ict-imgs.vgcloud.vn/2022/05/13/17/shopeefood-ngay-15-sale-dong-gia-kham-pha-ngay-bo-suu-tap-mon-ngon-chi-tu-1-000-dong-2.jpg",
        "https://ict-imgs.vgcloud.vn/2022/05/13/17/shopeefood-ngay-15-sale-dong-gia-kham-pha-ngay-bo-suu-tap-mon-ngon-chi-tu-1-000-dong-1.jpg",
        "https://ict-imgs.vgcloud.vn/2022/05/13/17/shopeefood-ngay-15-sale-dong-gia-kham-pha-ngay-bo-suu-tap-mon-ngon-chi-tu-1-000-dong-2.jpg",
        "https://ict-imgs.vgcloud.vn/2022/05/13/17/shopeefood-ngay-15-sale-dong-gia-kham-pha-ngay-bo-suu-tap-mon-ngon-chi-tu-1-000-dong-1.jpg",
        "https://ict-imgs.vgcloud.vn/2022/05/13/17/shopeefood-ngay-15-sale-dong-gia-kham-pha-ngay-bo-suu-tap-mon-ngon-chi-tu-1-000-dong-2.jpg",
        "https://ict-imgs.vgcloud.vn/2022/05/13/17/shopeefood-ngay-15-sale-dong-gia-kham-pha-ngay-bo-suu-tap-mon-ngon-chi-tu-1-000-dong-1.jpg",
    ];
    if (foodError) return <div>Failed to load</div>;
    if (categoryError) return <div>Failed to load</div>;
    if (foodLoading || categoryLoading) return <div>Loading...</div>;
    return (
        <div className='h-auto py-4 flex flex-col justify-center items-center gap-10'>
                   {/* <button onClick={createOrder}>
                Pay
            </button> */}
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
                        {category.map((item: any) => {
                            return (
                                <div
                                    key={`Category ${item.id}`}
                                    onClick={() =>
                                        setCurrentCategory(item.name)
                                    }
                                >
                                    <Category
                                        params={{
                                            category: item.name,
                                            state:
                                                item.name !== currentCategory,
                                        }}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className='w-full h-auto flex flex-col justify-center items-center'>
                    <div className='w-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-6 lg:gap-10 items-center'>
                        {food
                            .filter((item: any) => currentCategory  === category[parseInt(item.categoryId) - 1]?.name)
                            .slice(0, 6)
                            .map((item: any) => {
                                return (
                                    <div
                                        key={`Food ${item.category} ${item.id}`}
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
                        {food
                            .slice(0, 6)
                            .map((item: any) => {
                                return (
                                    <div
                                        key={`Food ${item.categoryId} ${item.id}`}
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
        </div>
    );
}
