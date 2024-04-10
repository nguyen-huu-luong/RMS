import Image from "next/image";
import { PlusCircleFilled } from "@ant-design/icons";
import { message } from "antd";
import { useSession } from "next-auth/react";
import { useLocale } from "next-intl";
import { useRouter } from "next-intl/client";

const FoodItem = ({
    params,
    addProduct,
    items,
}: {
    params: {
        food: {
            id: number;
            name: string;
            thumbnails: string;
            description: string;
            price: number;
            categoryId: string;
        };
        size: string;
    };
    addProduct: any;
    items: any;
}) => {
    const locale = useLocale();
    const { data: session, status } = useSession();
    const router = useRouter();
    const handleAddProduct = () => {
        const existingItemIndex: any = items.findIndex(
            (item: any) => item.id === params.food.id
        );
        if (existingItemIndex !== -1) {
            const updatedItems = [...items];
            updatedItems[existingItemIndex].quantity += 1;
            addProduct(updatedItems);
        } else {
            addProduct([
                ...items,
                {
                    ...params.food,
                    quantity: 1,
                },
            ]);
        }
        message.success("Added food successfully");
    };
    return (
        <div
            className={`relative group ${
                params.size === "sm" ? "h-52 w-40 p-3" : "h-72 w-60 p-6"
            } flex flex-col justify-between rounded-xl bg-white z-0`}
        >
            <div className='w-auto h-auto rounded-lg overflow-hidden cursor-pointer'>
                <Image
                    src={params.food.thumbnails}
                    alt={params.food.name}
                    width={200}
                    height={200}
                    className='w-full h-auto'
                    unoptimized
                />
            </div>
            <div className='h-auto flex flex-col justify-between items-start gap-3'>
                <span className='font-bold text-menu cursor-pointer'>
                    {params.food.name}
                </span>{" "}
                <div className='w-full flex flex-row justify-between text-primary font-bold'>
                    <span className='cursor-pointer'>{params.food.price}Đ</span>
                    {/* <button onClick={handleAddToCart}> */}
                    <button onClick={handleAddProduct}>
                        <PlusCircleFilled />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FoodItem;
