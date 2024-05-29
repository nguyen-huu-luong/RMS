"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import FoodItem from "@/components/menu/foodItem";
import { Pagination, ConfigProvider } from "antd";
import type { PaginationProps } from "antd";
import FoodDetail from "@/components/menu/foodDetail";
import useSWR from "swr";
import Loading from "@/components/loading";
import publicFetcher from "@/lib/public-fetcher";
import fetchClient from "@/lib/fetch-client";

export default function Menu() {
    const searchParams = useSearchParams();
    const currentCategory = searchParams.get("category");
    const locale = useLocale();
    const [category, setCategory] = useState<string>(
        currentCategory !== null ? currentCategory : "Pizza"
    );
    const [currentPage, setCurrentPage] = useState(1);

    const {
        data: foods,
        error: foodError,
        isLoading: foodLoading,
    } = useSWR(`/products/all`, (url) => publicFetcher({url: url, data_return: true}));
    const {
        data: categories,
        error: categoryError,
        isLoading: categoryLoading,
    } = useSWR(`/categories/all`, (url) => publicFetcher({url: url, data_return: true}));

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
    const openModal = async (item: typeof detail) => {
        await fetchClient({method: "POST", url: `/clienthistories`, body: {
            action: "view_item",
            productId: item.id,
            updatedAt:  new Date(),
            createdAt: new Date()
        }})
        setDetail(item)
        setModal(true);
    };
    const closeModal = () => {
        setModal(false);
    };
    const onChange: PaginationProps["onChange"] = (page) => {
        setCurrentPage(page);
    };
    if (foodError) return <div><Loading/></div>;
    if (categoryError) return <div><Loading/></div>;
    if (foodLoading || categoryLoading) return <Loading/>;
    return (
        <div className='w-full h-auto flex flex-col justify-start gap-5'>
            <div className='w-full h-auto rounded-3xl border-2 border-orange-100 bg-primary-white p-2 flex flex-wrap justify-around'>
                {categories.map((item: any) => {
                    return (
                        <div
                            key={`Category ${item.name}`}
                            onClick={() => {
                                setCategory(item.name);
                                setCurrentPage(1);
                            }}
                            className={`font-bold cursor-pointer p-2 px-4 rounded-3xl ${
                                category === item.name
                                    ? "bg-primary text-item-white"
                                    : "bg-none text-menu"
                            } transition-all duration-200`}
                        >
                            {item.name}
                        </div>
                    );
                })}
            </div>
            <div className='w-full h-auto flex flex-col justify-center items-center gap-5'>
                <div className='w-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
                    {foods
                        .filter((item: any) => category  === categories[parseInt(item.categoryId) - 1]?.name)
                        .slice((currentPage - 1) * 8, currentPage * 8)
                        .map((item: any) => {
                            return (
                                <div
                                    key={`Food ${item.category} ${item.id}`}
                                    className='duration-300 transition-all ease-in-out w-auto'
                                >
                                    <FoodItem
                                        params={{ food: item, size: "lg", openModal: openModal }}
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
                            foods.filter((food: any) => category === categories[parseInt(food.categoryId) - 1]?.name)
                                .length
                        }
                        pageSize={8}
                    />
                </ConfigProvider>
            </div>
            {modal && <FoodDetail food={detail} closeModal={closeModal} />}
        </div>
    );
}
