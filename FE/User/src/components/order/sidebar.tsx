"use client";
import Link from "next-intl/link";
import { useLocale, useTranslations } from "next-intl";
import VoucherPicker from "@/components/order/voucherPicker";
import { useState, useEffect } from "react";
import Loading from "@/components/loading";
import fetchClient from "@/lib/fetch-client";
const SideBar = ({
    onPayOrder,
    setAmount,
    setVoucherId,
    fee,
    token,
    voucherId,
}: {
    onPayOrder: () => void;
    setAmount: any;
    setVoucherId: any;
    fee: any;
    token: any;
    voucherId: any;
}) => {
    const t = useTranslations("Order");
    const locale = useLocale();
    const [modal, setModal] = useState<boolean>(false);
    const openModal = () => {
        setModal(true);
    };
    const closeModal = () => {
        setModal(false);
    };
    const [voucher, setVoucher] = useState<any>(null);
    const [currentCart, setCurrentCart] = useState<any>(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const cartData = await fetchClient({
                    url: `/carts`,
                    data_return: true,
                });
                setCurrentCart(cartData);
            } catch (error) {
                console.error("Error fetching cart data:", error);
            }
        };
        fetchData();
    }, [token]);

    useEffect(() => {
        if (!currentCart) return;
        setAmount(
            currentCart.cart.amount -
                (voucher
                    ? voucher.type === "fixed"
                        ? voucher.amount > voucher.maximum_reduce
                            ? voucher.maximum_reduce
                            : voucher.amount
                        : (voucher.amount * currentCart.cart.amount) / 100 >
                          voucher.maximum_reduce
                        ? voucher.maximum_reduce
                        : (voucher.amount * currentCart.cart.amount) / 100
                    : 0) +
                fee
        );
        setVoucherId(voucher ? voucher.id : null);
    }, [voucher]);

    if (!currentCart) return <Loading />;
    return (
        <div className='w-auto h-auto p-10 rounded-3xl bg-primary-white flex flex-col gap-5 justify-start items-center font-extrabold'>
            <div className='w-full flex flex-row justify-between gap-10'>
                <span className='w-auto whitespace-nowrap'>
                    {t("Discount")}
                </span>
                {currentCart && (
                    <span className='relative w-auto whitespace-nowrap '>
                        <span
                            className='w-full cursor-pointer text-primary'
                            onClick={openModal}
                        >
                            {t("Choose")}
                        </span>
                        {modal && (
                            <VoucherPicker
                                params={{
                                    amount: currentCart.cart.amount,
                                    closeModal: closeModal,
                                    setVoucher: setVoucher,
                                    voucherId: voucherId,
                                }}
                            />
                        )}
                    </span>
                )}
            </div>
            {!voucher && (
                <span className='font-normal'>{t("No_discount")}</span>
            )}
            <div className='w-full flex flex-col justify-between gap-2 font-normal'>
                <div className='w-full flex flex-row justify-between gap-10'>
                    <span className='w-auto whitespace-nowrap'>
                        {t("Pre_discount")}
                    </span>
                    <span className='relative w-auto whitespace-nowrap '>
                        <span className='w-full cursor-pointe'>
                            {currentCart.cart.amount}
                        </span>
                    </span>
                </div>
                <div className='w-full flex flex-row justify-between gap-10'>
                    <span className='w-auto whitespace-nowrap'>
                        {t("Discount_amount")}
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
                        {t("Shipping")}
                    </span>
                    <span className='relative w-auto whitespace-nowrap '>
                        <span className='w-full cursor-pointer'>{fee}</span>
                    </span>
                </div>
            </div>
            <div className='w-full flex flex-row justify-between gap-10'>
                <span className='w-auto whitespace-nowrap'> {t("Total")}</span>
                <span className='relative w-auto whitespace-nowrap '>
                    <span className='w-full cursor-pointer text-primary'>
                        {Math.max(
                            currentCart.cart.amount +
                                fee -
                                (voucher
                                    ? voucher.type === "fixed"
                                        ? voucher.amount >
                                          voucher.maximum_reduce
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
                                    : 0),
                            0
                        )}
                    </span>
                </span>
            </div>
            <button
                onClick={() => {
                    onPayOrder();
                }}
                className='p-2 w-full h-auto rounded-lg border-orange-500 border-2 bg-primary hover:bg-primary-400 text-item-white transition-all duration-300  flex justify-center'
            >
                {t("Pay")}
            </button>
            <Link
                className='p-2 w-full h-auto rounded-lg border-orange-500 border-2 hover:bg-primary hover:text-item-white transition-all duration-300 flex justify-center'
                href={"/cart"}
                locale={locale}
            >
                {t("Back")}
            </Link>
        </div>
    );
};

export default SideBar;
