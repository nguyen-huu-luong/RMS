"use client";
import { useState } from "react";
import { usePathname } from "next-intl/client";
import Image from "next/image";
import {
    PlusCircleOutlined,
    MinusCircleOutlined,
    CloseCircleFilled,
} from "@ant-design/icons";
import { message } from "antd";
import styles from "@/app/styles.module.css";
import { useSession } from "next-auth/react";
import { addToCart } from "@/app/api/product/cart";
import { useRouter } from "next-intl/client";
import { useLocale, useTranslations } from "next-intl";

const FoodDetail = ({
    food,
    closeModal,
}: {
    food: {
        id: number;
        name: string;
        thumbnails: string;
        description: string;
        price: number;
        categoryId: string;
    };
    closeModal: () => void;
}) => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const locale = useLocale();
    const t = useTranslations('Home')
    const handleAddToCart = async () => {
        if (status === "unauthenticated") {
            router.push(`/signin`);
        } else {
            await addToCart(session?.user.accessToken, {
                productId: food.id,
                quantity: count,
            });
            message.success(t('Success'));
            closeModal();
        }
    };
    const [count, setCount] = useState<number>(1);
    const increase = () => {
        setCount(count + 1);
    };
    const decrease = () => {
        if (count > 1) setCount(count - 1);
    };
    return (
        <>
            <div
                className={`${styles.food__detail} shadow-xl fixed group top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 h-auto w-80 p-5 flex flex-col gap-3 justify-between rounded-xl bg-primary-white overflow-hidden`}
            >
                <div className='relative w-auto h-auto rounded-lg overflow-hidden cursor-pointer'>
                    <button
                        className='absolute top-2 right-2 w-auto h-auto text-item-white'
                        onClick={closeModal}
                    >
                        <CloseCircleFilled style={{ fontSize: "1.4rem" }} />
                    </button>
                    <Image
                        src={food.thumbnails}
                        alt={food.name}
                        width={300}
                        height={300}
                        className="aspect-square"
                        unoptimized
                    />
                </div>
                <div className='h-auto flex flex-col justify-between items-start gap-2'>
                    <span className='font-extrabold text-2xl text-menu'>
                        {food.name}
                    </span>
                    <div className=' text-item-black flex flex-col justify-start gap-0'>
                        <span className='font-bold'>{t('Food_des')}</span>
                        <span className='font-normal'>{food.description}</span>
                    </div>
                    <div className='w-full flex flex-row justify-between text-primary font-bold'>
                        <div className='flex flex-col justify-between gap-1'>
                            <span>{t('Price')}: {food.price}</span>
                            <span className='flex flex-row justify-between'>
                                <button
                                    className='w-auto h-auto'
                                    onClick={decrease}
                                >
                                    <MinusCircleOutlined
                                        style={{ fontSize: "1.4rem" }}
                                    />
                                </button>
                                <span className='font-bold text-item-black'>
                                    {count}
                                </span>
                                <button
                                    className='w-auto h-auto'
                                    onClick={increase}
                                >
                                    <PlusCircleOutlined
                                        style={{ fontSize: "1.4rem" }}
                                    />
                                </button>
                            </span>
                        </div>
                        <button
                            className='h-auto rounded-md p-2 bg-primary hover:bg-primary-400 text-item-white transition-all duration-300 ease-in-out'
                            onClick={handleAddToCart}
                        >
                            {t('Add')}
                        </button>
                    </div>
                </div>
            </div>
            <div
                className='fixed top-0 left-0 w-full h-full opacity-0 z-10'
                onClick={closeModal}
            ></div>
        </>
    );
};

export default FoodDetail;
