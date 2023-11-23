import { useRouter, usePathname } from "next-intl/client";
import Image from "next/image";
import { CheckCircleFilled } from "@ant-design/icons";
import { Modal } from "antd";

const Voucher = ({
    params,
}: {
    params: {
        voucher: {
            name: string;
            code: string;
            amount: number;
            description: string;
            category: string;
        };
        picked: boolean
    };
}) => {
    return (
        <div className='w-full h-20 bg-primary-white shadow-md flex flex-row gap-1'>
            <span className='w-20 h-20 p-5 bg-primary flex justify-center items-center font-extrabold text-item-white'>
                {params.voucher.category.toUpperCase()}
            </span>
            <div className='w-full h-full p-2 items-center flex flex-row justify-between'>
                <div>ádasd</div>
                <span className='w-4 h-4 rounded-full border-gray-500 border-2 cursor-pointer'>
                </span>
                <span className='text-primary cursor-pointer'>
                    <CheckCircleFilled />
                </span>
            </div>
        </div>
    );
};

export default Voucher;
