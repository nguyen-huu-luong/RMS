'use clinet'
import React from "react";
import Image from "next/image";
import {
    CaretUpOutlined,
    CaretDownOutlined,
    CrownTwoTone,
    MinusOutlined,
} from "@ant-design/icons";
import { convertUnit } from "@/lib/utils/convertUnit";
import {useRouter} from "next-intl/client"; 
const TopCustomerItem = ({ item, index }: { item: any; index: number }) => {
    const router = useRouter();

    return (
        <div onClick={() => router.push(`customers/${item.client.id}`)}  className='h-32 cursor-pointer w-full rounded-xl border-slate-200 flex flex-row justify-start gap-2 border-2 hover:bg-slate-100 p-2 transition-all duration-300'>
            <div className='font-bold text-lg w-full h-full flex flex-row justify-between items-center gap-5 p-2 px-4'>
                <span
                    className={`relative text-black align-middle p-2 ${
                        index === 0 ? "text-red-600" : ""
                    }`}
                >
                    #{index + 1}
                    {index === 0 ? (
                        <span className='absolute -top-5 left-0 -rotate-12'>
                            <CrownTwoTone
                                twoToneColor={"#ffea00"}
                                style={{ fontSize: "32px" }}
                            />
                        </span>
                    ) : (
                        <></>
                    )}
                </span>
                <span className='rounded-full overflow-hidden w-40 aspect-square'>
                    <Image
                        src={item.client.avatar}
                        width={300}
                        height={300}
                        className=' aspect-square rounded-full w-full h-full'
                        alt='item-image'
                        unoptimized
                    />
                </span>
                <div className='h-full w-full flex flex-col justify-around '>
                    <span>{item.client.firstname + " " + item.client.lastname}</span>
                    <span>Total paid: {convertUnit(item.amount)}</span>
                </div>
                {item.indexChange !== undefined && (
                    <div
                        className={`w-auto h-auto flex justify-start gap-1 items-center ${
                            item.indexChange < 0 && item.indexChange != -10
                                ? "text-red-600"
                                : item.indexChange == -10
                                ? "text-blue-600"
                                : item.indexChange == 0
                                ? "text-blue-600"
                                : "text-green-600"
                        }`}
                    >
                        <span>
                            {item.indexChange < 0 && item.indexChange != -10 ? (
                                <CaretDownOutlined />
                            ) : item.indexChange == -10 ? (
                                "NEW"
                            ) : item.indexChange == 0 ? (
                                <MinusOutlined />
                            ) : (
                                <CaretUpOutlined />
                            )}
                        </span>
                        {item.indexChange < 0 && item.indexChange != -10 ? (
                            <span>{-item.indexChange}</span>
                        ) : item.indexChange == -10 || item.indexChange == 0 ? (
                            <></>
                        ) : (
                            <span>{item.indexChange}</span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TopCustomerItem;
