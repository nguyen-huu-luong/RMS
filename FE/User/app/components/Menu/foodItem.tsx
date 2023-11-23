import Image from "next/image";
import { PlusCircleFilled } from "@ant-design/icons";
import { message } from "antd";
const FoodItem = ({
    params,
}: {
    params: {
        food: {
            name: string;
            thumbnails: string;
            description: string;
            price: number;
            categoryId: string;
        };
        size: string;
        openModal: (food: typeof params.food) => void;
    };
}) => {
    return (
        <div
            className={`relative group ${
                params.size === "sm" ? "h-52 w-40 p-3" : "h-72 w-60 p-6"
            }   flex flex-col justify-between rounded-xl bg-primary-white z-0`}
        >
            <div className='w-auto h-auto rounded-lg overflow-hidden cursor-pointer' onClick={() => params.openModal(params.food)}>
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
                <span className='font-bold text-menu cursor-pointer' onClick={() => params.openModal(params.food)}>
                    {params.food.name}
                </span>{" "}
                <div className='w-full flex flex-row justify-between text-primary font-bold'>
                    <span className='cursor-pointer'  onClick={() => params.openModal(params.food)}>{params.food.price}Đ</span>
                    <button onClick={() => message.success('Added food to cart')}>
                        <PlusCircleFilled />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FoodItem;
