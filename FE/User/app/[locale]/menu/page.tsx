"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import FoodItem from "@/app/components/Menu/foodItem";
import { Pagination, ConfigProvider } from "antd";
import type { PaginationProps } from "antd";
import FoodDetail from "@/app/components/Menu/foodDetail";
import { Alert } from 'antd';

export default function Menu() {
    const searchParams = useSearchParams();
    const currentCategory = searchParams.get("category");
    const locale = useLocale();
    const [category, setCategory] = useState<string>(
        currentCategory !== null ? currentCategory : "Pizza"
    );
    const [currentPage, setCurrentPage] = useState(1);
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
        setDetail(item)
        setModal(true);
    };
    const closeModal = () => {
        setModal(false);
    };
    const onChange: PaginationProps["onChange"] = (page) => {
        setCurrentPage(page);
    };
    const categories: string[] = [
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
    }[] = categories.flatMap((item) => {
        return Array.from({ length: 20 }, (_, index) => ({
            name: `${item} ${index}`,
            image: "https://img.dominos.vn/cach-lam-pizza-thap-cam-2.jpg",
            description:
                "Pizza, dish of Italian origin consisting of a flattened disk of bread dough topped with some combination of olive oil, oregano, tomato, olives, mozzarella or other cheese, and many other ingredients",
            price: 50000,
            category: item,
        }));
    });
    return (
        <div className='w-full h-auto flex flex-col justify-start gap-10'>
            <div className='w-full h-auto rounded-3xl border-2 border-orange-100 bg-primary-white p-2 flex flex-wrap justify-around'>
                {categories.map((item, index) => {
                    return (
                        <div
                            key={`Category ${index}`}
                            onClick={() => {
                                setCategory(item);
                                setCurrentPage(1);
                            }}
                            className={`font-bold cursor-pointer p-2 px-4 rounded-3xl ${
                                category === item
                                    ? "bg-primary text-item-white"
                                    : "bg-none text-menu"
                            } transition-all duration-200`}
                        >
                            {item}
                        </div>
                    );
                })}
            </div>
            <div className='w-full h-auto flex flex-col justify-center items-center gap-5'>
                <div className='w-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10'>
                    {foods
                        .filter((item) => item.category === category)
                        .slice((currentPage - 1) * 8, currentPage * 8)
                        .map((item, index) => {
                            return (
                                <div
                                    key={`Food ${item.category} ${index}`}
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
                            foods.filter((food) => category === food.category)
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
