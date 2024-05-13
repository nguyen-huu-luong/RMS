import Image from "next/image";
import { PlusCircleFilled } from "@ant-design/icons";
import { message } from "antd";
import { useSession } from "next-auth/react";
import { useLocale } from "next-intl";
import { useRouter } from "next-intl/client";

const PriceItem = ({
    params,
}: {
    params: { 
        food: {
            id?: number;
            name: string;
            thumbnails?: string;
            description?: string;
            price: number;
            quantity: number;
            categoryId?: string;
        };
    };
}) => {
    const locale = useLocale();
    return (
        <div
            className="w-full h-auto flex flex-col justify-start gap-2"
        >
            <div className="w-full flex flex-row justify-between font-bold text-md">
                <span>
                    {params.food.name}
                </span>
                <span>
                    {params.food.price * params.food.quantity}VNĐ
                </span>
            </div>
            <div className="w-full flex justify-start font-normal text-md">
                {params.food.quantity} {params.food.quantity == 1?"Unit":"Units"} at {params.food.price}VNĐ/Unit
            </div>
        </div>
    );
};

export default PriceItem;
