"use client";
import { useState } from "react";
import { useRouter, usePathname } from "next-intl/client";
import Image from "next/image";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import Voucher from "./voucher";

const VoucherPicker = ({
    params,
}: {
    params: {
        vouchers: {
            name: string;
            code: string;
            amount: number;
            description: string;
            category: string;
        }[];
    };
}) => {
    const [option, selectOption] = useState(null);
    const condition: boolean = true;
    return (
        <div className='h-auto w-auto max-w-md p-5 bg-primary-white rounded-xl flex flex-col gap-2'>
            <span className='font-extrabold text-item-black'>
                Pick a voucher
            </span>
            <div className='flex flex-col gap-2 w-full max-h-80 overflow-y-scroll'>
                {params.vouchers.map((item) => (
                    <div
                        key={item.code}
                        className='w-auto h-auto flex flex-col justify-start'
                    >
                        <label
                            className='w-full h-24 bg-primary-white shadow-md flex flex-row gap-1 relative'
                            htmlFor={item.code}
                        >
                            <span
                                className={` w-28 h-24 p-5 bg-primary flex justify-center items-center font-extrabold text-item-white`}
                            >
                                {item.category.toUpperCase()}
                            </span>
                            <div className='w-full h-full p-1 items-center flex flex-row justify-between'>
                                <div className='flex flex-col h-full justify-between items-start'>
                                    <div className='font-bold text-item-black w-auto'>
                                        Reduce by {item.amount}
                                    </div>
                                    <div className='w-auto text-sm'>
                                        {item.description}
                                    </div>
                                    <div className='w-auto text-xs'>
                                        {item.description}
                                    </div>
                                </div>
                                <input
                                    disabled={
                                        condition && item.code === "VCHXYZ"
                                    }
                                    className={`appearance-none flex-none rounded-full h-3 w-3 border border-gray-500 outline-none transition duration-150 ease-in-out
                                    checked:bg-primary checked:border-orange-500 checked:outline-orange-500 cursor-pointer
                                    disabled:cursor-default
                                `}
                                    type='radio'
                                    name='selectVoucher'
                                    value={item.code}
                                    id={item.code}
                                />
                            </div>
                            {/* Condition here */}
                            {condition && item.code === "VCHXYZ" && (
                                <div className='absolute w-full h-full top-0 left-0 bg-gray-50 opacity-25'></div>
                            )}
                        </label>
                        {/* Condition here */}
                        {condition && item.code === "VCHXYZ" && (
                            <div className='w-full text-xs flex flex-row justify-start items-center gap-2 bg-red-100 text-red-500 p-2 shadow-md'>
                                <InfoCircleOutlined />
                                <span>
                                    Your order has not met the voucher’s
                                    requirements
                                </span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className='flex flex-row justify-end gap-3 w-full'>
                <button className='text-item-white rounded-lg p-2 bg-slate-400 hover:bg-slate-300 font-bold transition-all ease-in duration-300'>
                    CANCEL
                </button>
                <button className='text-item-white rounded-lg p-2 bg-primary hover:bg-primary-400 font-bold transition-all ease-in duration-300'>
                    CONFIRM
                </button>
            </div>
        </div>
    );
};

export default VoucherPicker;
