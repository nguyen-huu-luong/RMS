"use client";
import { InfoCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import moneyFormatter from "../function/moneyFormatter";
const VoucherPicker = ({
    params,
}: {
    params: {
        vouchers: {
            name: string;
            promo_code: string;
            amount: number;
            maximum_reduce: number;
            end_date: string;
            type: string;
            minimum_paid: number;
        }[];
        amount: any;
        closeModal: () => void;
        setVoucher: any;
    };
}) => {
    return (
        <>
            <div className='h-auto w-auto max-w-md absolute top-5 right-0 p-5 bg-primary-white rounded-xl flex flex-col gap-2 shadow-lg transition-all duration-300 z-20'>
                <span className='font-extrabold text-item-black'>
                    Pick a voucher
                </span>
                <div className='flex flex-col gap-2 w-full max-h-80 overflow-y-scroll'>
                    {params.vouchers.sort((a,b) => {return a.minimum_paid - b.minimum_paid}).map((item: any) => (
                        <div
                            key={item.promo_code}
                            className='w-auto h-auto flex flex-col justify-start'
                            onClick={async () => await params.setVoucher(item)}
                        >
                            <label
                                className='w-full h-24 bg-primary-white shadow-md flex flex-row gap-1 relative'
                                htmlFor={item.promo_code}
                            >
                                <span
                                    className={` w-28 h-24 p-5 bg-primary flex justify-center items-center font-extrabold text-item-white`}
                                >
                                    {item.promo_code
                                        .toUpperCase()
                                        .substring(0, 4)}
                                </span>
                                <div className='w-full h-full p-1 items-center flex flex-row justify-between'>
                                    <div className='flex flex-col h-full justify-between items-start'>
                                        <div className='font-bold text-item-black w-auto'>
                                            Reduce by {item.amount}{" "}
                                            {item.type === "fixed" ? "" : "%"}
                                        </div>
                                        <div className='w-auto text-sm font-normal'>
                                            Maximum reduction is{" "}
                                            {moneyFormatter(item.maximum_reduce)}
                                        </div>
                                        <div className='w-auto text-xs font-thin'>
                                            {moment(item.end_date).format(
                                                "MMMM Do YYYY, h:mm:ss a"
                                            )}
                                        </div>
                                    </div>
                                    <input
                                        disabled={
                                            item.minimum_paid > params.amount
                                        }
                                        className={`appearance-none flex-none rounded-full h-3 w-3 border border-gray-500 outline-none transition duration-150 ease-in-out
                                    checked:bg-primary checked:border-orange-500 checked:outline-orange-500 cursor-pointer
                                    disabled:cursor-default
                                `}
                                        type='radio'
                                        name='selectVoucher'
                                        value={item.promo_code}
                                        id={item.promo_code}
                                    />
                                </div>
                                {/* Condition here */}
                                {item.minimum_paid > params.amount && (
                                    <div className='absolute w-full h-full top-0 left-0 bg-gray-50 opacity-25'></div>
                                )}
                            </label>
                            {/* Condition here */}
                            {item.minimum_paid > params.amount && (
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
                    <button
                        onClick={params.closeModal}
                        className='text-item-white rounded-lg p-2 bg-slate-400 hover:bg-slate-300 font-bold transition-all ease-in duration-300'
                    >
                        CANCEL
                    </button>
                    <button
                        onClick={params.closeModal}
                        className='text-item-white rounded-lg p-2 bg-primary hover:bg-primary-400 font-bold transition-all ease-in duration-300'
                    >
                        CONFIRM
                    </button>
                </div>
            </div>
            <div
                className='fixed top-0 left-0 w-full h-full opacity-0 z-10'
                onClick={params.closeModal}
            ></div>
        </>
    );
};

export default VoucherPicker;
