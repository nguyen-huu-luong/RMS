"use client";
import Link from "next-intl/link";
import { useLocale, useTranslations } from "next-intl";
import Category from "@/components/menu/category";
import FoodItem from "@/components/menu/foodItem";
import FoodDetail from "@/components/menu/foodDetail";
import Slider from "@/components/home/slider";
import WelcomeImage from "@/components/home/welcome";
import { RightCircleFilled } from "@ant-design/icons";
import { useState, useEffect } from "react";
import Loading from "@/components/loading";
import useSWR from "swr";
import publicFetcher from "@/lib/public-fetcher";
import fetchClient from "@/lib/fetch-client";
import fetchGeneral from "@/lib/fetch-general";
import { getSession } from "next-auth/react";
export default function Home() {
    const locale = useLocale();
    const t = useTranslations("Home");
    const [currentCategory, setCurrentCategory] = useState<string>("Pizza");
    const [bestSeller, setBestSeller] = useState([])
    const [food, setFood] = useState<any>([])
    const [category, setCategory] = useState<any>([])
    const [isLoading, setIsLoading] = useState(true)
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
    // if (foodError) return <div>Failed to load</div>;
    // if (categoryError) return <div>Failed to load</div>;


    const getBestSeller = async () => {
        const session = await getSession();
        var best_items: any
        if (session) {
            best_items = await fetchClient({method: "GET", url: "/products/recomendation", data_return: true})
        }
        else {
            best_items =await fetchGeneral({method: "GET", url: "/orderitems/bestseller", data_return: true})
        }
        console.log(best_items) 
        setBestSeller(best_items)
    }

    const getFood = async () => {
        const data = await publicFetcher({url: '/products/all', data_return: true})
        setFood(data)
    }

    const getCategory = async () => {
        const data = await publicFetcher({url: '/categories/all', data_return: true})
        setCategory(data)
    
    }

    useEffect(() => {
        setIsLoading(true)
        getFood()
        getCategory()
        getBestSeller()
        setIsLoading(false)
    }, [])


    if (isLoading) return <Loading></Loading>;

    return (
        <div className='h-auto py-4 flex flex-col justify-center items-center gap-10'>
            {/* Home welcome and carousel banner */}
            <div className='w-80 h-auto flex flex-col sm:flex-row sm:w-full gap-5'>
                <WelcomeImage params={{ name: "CUSTOMER" }} />
                <div className='w-80 h-80 flex-none'>
                    <Slider params={{ images: images }} />
                </div>
            </div>

            {/* Menu Category */}
            <div className='flex flex-col justify-start w-full h-auto gap-10'>
                <div className='flex flex-row justify-between text-menu items-center '>
                    <div className='font-extrabold text-2xl font-serif'>
                        {t("menu")}
                    </div>

                    <Link
                        href={{
                            pathname: "/menu",
                        }}
                        locale={locale}
                        className='flex gap-2 w-auto items-center cursor-pointer'
                    >
                        <span className='text-md'>{t('all')}</span>
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
                                            thumbnails: item.thumnails,
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
                            .filter(
                                (item: any) =>
                                    currentCategory ===
                                    category[parseInt(item.categoryId) - 1]
                                        ?.name
                            )
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
                        {t('trend')}
                    </div>
                </div>
                <div className='w-full h-auto flex flex-col justify-center items-center'>
                    <div className='w-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-6 lg:gap-10 items-center'>
                        {bestSeller.map((item: any) => {
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
