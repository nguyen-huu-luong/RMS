"use client";
import Link from "next-intl/link";
import { useLocale, useTranslations } from "next-intl";
import VoucherPicker from "@/components/order/voucherPicker";
import { voucherFetcher } from "@/app/api/product/voucher";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import moneyFormatter from "../function/moneyFormatter";
import Loading from "@/components/loading";
const SideBar = ({
    onPayOrder,
    currentCart,
    setAmount,
    setVoucherId,
    fee
}: {
    onPayOrder: () => void;
    currentCart: any;
    setAmount: any;
    setVoucherId: any;
    fee: any;
}) => {
    const locale = useLocale();
    const { data: session, status } = useSession();
    // const {
    //     data: vouchers,
    //     error: vouchersError,
    //     isLoading: vouchersLoading,
    // } = useSWR(
    //     session
    //         ? [
    //               `http://localhost:3003/api/vouchers/all`,
    //               session.user.accessToken,
    //           ]
    //         : null,
    //     ([url, token]) => voucherFetcher(url, token)
    // );
    if (status === "loading") return <>Loading.....</>;
    if (status === "unauthenticated") return <>Unauthenticated.....</>;
    const [modal, setModal] = useState<boolean>(false);
    const openModal = () => {
        setModal(true);
    };
    const closeModal = () => {
        setModal(false);
    };
    const [voucher, setVoucher] = useState<any>(null);

    // if (vouchersError) return <div>Failed to load</div>;
    // if (vouchersLoading) return <Loading />;
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
                    {/* {modal && (
                        <VoucherPicker
                            params={{
                                vouchers: vouchers,
                                amount: currentCart.cart.amount,
                                closeModal: closeModal,
                                setVoucher: setVoucher,
                            }}
                        />
                    )} */}
                </span>
            </div>
            {!voucher && (
                <span className='font-normal'>
                    You haven't added any discount codes.
                </span>
            )}
            <div className='w-full flex flex-col justify-between gap-2 font-normal'>
                <div className='w-full flex flex-row justify-between gap-10'>
                    <span className='w-auto whitespace-nowrap'>
                        Pre-discount amount
                    </span>
                    <span className='relative w-auto whitespace-nowrap '>
                        <span className='w-full cursor-pointe'>
                            {currentCart.cart.amount}
                        </span>
                    </span>
                </div>
                <div className='w-full flex flex-row justify-between gap-10'>
                    <span className='w-auto whitespace-nowrap'>
                        Discount amount
                    </span>
                    <span className='relative w-auto whitespace-nowrap '>
                        <span className='w-full cursor-pointer'>
                            {voucher
                                ? voucher.type === "fixed"
                                    ? voucher.amount > voucher.maximum_reduce
                                        ? voucher.maximum_reduce
                                        : voucher.amount
                                    : (voucher.amount *
                                          currentCart.cart.amount) /
                                          100 >
                                      voucher.maximum_reduce
                                    ? voucher.maximum_reduce
                                    : (voucher.amount *
                                          currentCart.cart.amount) /
                                      100
                                : 0}
                        </span>
                    </span>
                </div>
                <div className='w-full flex flex-row justify-between gap-10'>
                    <span className='w-auto whitespace-nowrap'>
                        Shipping cost
                    </span>
                    <span className='relative w-auto whitespace-nowrap '>
                        <span className='w-full cursor-pointer'>{fee}</span>
                    </span>
                </div>
            </div>
            <div className='w-full flex flex-row justify-between gap-10'>
                <span className='w-auto whitespace-nowrap'>Total amount</span>
                <span className='relative w-auto whitespace-nowrap '>
                    <span className='w-full cursor-pointer text-primary'>
                        {currentCart.cart.amount -
                            (voucher
                                ? voucher.type === "fixed"
                                    ? voucher.amount > voucher.maximum_reduce
                                        ? voucher.maximum_reduce
                                        : voucher.amount
                                    : (voucher.amount *
                                          currentCart.cart.amount) /
                                          100 >
                                      voucher.maximum_reduce
                                    ? voucher.maximum_reduce
                                    : (voucher.amount *
                                          currentCart.cart.amount) /
                                      100
                                : 0) + fee}
                    </span>
                </span>
            </div>
            <button
                onClick={() => {
                    setAmount(
                        currentCart.cart.amount -
                            (voucher
                                ? voucher.type === "fixed"
                                    ? voucher.amount > voucher.maximum_reduce
                                        ? voucher.maximum_reduce
                                        : voucher.amount
                                    : (voucher.amount *
                                          currentCart.cart.amount) /
                                          100 >
                                      voucher.maximum_reduce
                                    ? voucher.maximum_reduce
                                    : (voucher.amount *
                                          currentCart.cart.amount) /
                                      100
                                : 0) + fee
                    );
                    setVoucherId(voucher ? voucher.id : null);
                    onPayOrder();
                }}
                className='p-2 w-full h-auto rounded-lg border-orange-500 border-2 bg-primary hover:bg-primary-400 text-item-white transition-all duration-300  flex justify-center'
            >
                Pay and Order
            </button>
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
