"use client";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import VoucherPicker from "@/components/order/voucherPicker";

import { useState, useEffect } from "react";
const SideBar = ({ onPayOrder }: { onPayOrder: () => void }) => {
    const locale = useLocale();
    const [modal, setModal] = useState<boolean>(false);
    const openModal = () => {
        setModal(true);
    };
    const closeModal = () => {
        setModal(false);
    };
    const vouchers: {
        name: string;
        code: string;
        amount: number;
        description: string;
        category: string;
    }[] = [
        {
            name: "Voucher 1",
            code: "VCH123",
            amount: 50000,
            description: "Discount on selected items",
            category: "pizza",
        },
        {
            name: "Voucher 2",
            code: "VCH456",
            amount: 20000,
            description: "Special discount for members",
            category: "pizza",
        },
        {
            name: "Voucher 3",
            code: "VCH789",
            amount: 30000,
            description: "Limited time offer",
            category: "drink",
        },
        {
            name: "Voucher 10",
            code: "VCHXYZ",
            amount: 25000,
            description: "Weekend sale",
            category: "drink",
        },
        {
            name: "Voucher 10",
            code: "VCHXaYZ",
            amount: 25000,
            description: "Weekend sale",
            category: "drink",
        },
    ];
    return (
        <div className='w-auto h-auto p-10 rounded-3xl bg-primary-white flex flex-col gap-5 justify-start items-center font-extrabold'>
            <div className='w-full flex flex-row justify-between gap-10'>
                <span className='w-auto whitespace-nowrap'>Discount Code</span>
                <span className='relative w-auto whitespace-nowrap '>
                    <span
                        className='w-full cursor-pointer text-primary'
                        onClick={openModal}
                    >
                        Choose Code
                    </span>
                    {modal && (
                        <VoucherPicker
                            params={{
                                vouchers: vouchers,
                                closeModal: closeModal,
                            }}
                        />
                    )}
                </span>
            </div>
            <span className='font-normal'>
                You haven't added any discount codes.
            </span>
            <div className='w-full flex flex-col justify-between gap-2 font-normal'>
                <div className='w-full flex flex-row justify-between gap-10'>
                    <span className='w-auto whitespace-nowrap'>
                        Pre-discount ammount
                    </span>
                    <span className='relative w-auto whitespace-nowrap '>
                        <span className='w-full cursor-pointe'>120000Đ</span>
                    </span>
                </div>
                <div className='w-full flex flex-row justify-between gap-10'>
                    <span className='w-auto whitespace-nowrap'>
                        Discount ammount
                    </span>
                    <span className='relative w-auto whitespace-nowrap '>
                        <span className='w-full cursor-pointer'>120000Đ</span>
                    </span>
                </div>
                <div className='w-full flex flex-row justify-between gap-10'>
                    <span className='w-auto whitespace-nowrap'>
                        Shipping cost
                    </span>
                    <span className='relative w-auto whitespace-nowrap '>
                        <span className='w-full cursor-pointer'>120000Đ</span>
                    </span>
                </div>
            </div>
            <div className='w-full flex flex-row justify-between gap-10'>
                <span className='w-auto whitespace-nowrap'>Total ammount</span>
                <span className='relative w-auto whitespace-nowrap '>
                    <span className='w-full cursor-pointer text-primary'>
                        120000Đ
                    </span>
                </span>
            </div>
            <button onClick={onPayOrder}>TEST</button>
            <Link
                className='p-2 w-full h-auto rounded-lg border-orange-500 border-2 bg-primary hover:bg-primary-400 text-item-white transition-all duration-300  flex justify-center'
                href={"/payment"}
                locale={locale}
            >
                Pay & Order
            </Link>
            <Link
                className='p-2 w-full h-auto rounded-lg border-orange-500 border-2 hover:bg-primary hover:text-item-white transition-all duration-300 flex justify-center'
                href={"/cart"}
                locale={locale}
            >
                Back to cart
            </Link>
        </div>
    );
};

export default SideBar;
