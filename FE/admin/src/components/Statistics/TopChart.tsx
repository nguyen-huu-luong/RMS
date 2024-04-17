'use client'
import { useEffect } from "react";
import fetchClient from "@/lib/fetch-client";
import React from "react";
import useSWR from "swr";
import Loading from "../loading";
import TopProductItem from "./TopProductItem";
import TopCustomerItem from "./TopCustomerItem";
type Option = {
    type: string | "DAILY" | "MONTHLY" | "YEARLY" | "CUSTOM";
    beginDate?: Date;
    endDate?: Date;
};
const TopChart = ({
    name,
    type,
    option,
    setComponent,
    component
}: {
    name: string;
    type: string;
    option: Option;
    setComponent:any;
    component:any
}) => {
    const {
        data: chartData,
        error: chartError,
        isLoading: chartLoading,
    } = useSWR(
        option.beginDate && option.endDate
            ? `/reports/${type}?type=${option.type}&beginDate=${option.beginDate}&endDate=${option.endDate}`
            : `/reports/${type}?type=${option.type}`,
        async (url: string) => await fetchClient({ url: url, data_return: true })
    );

    useEffect(() => {
        if (!chartLoading) {
            setComponent({...component, topCustomers: true});
        }
    }, [chartLoading, type]);

    if (chartLoading || !chartData) return <Loading />;
    return (
        <div className='flex flex-col gap-2 justify-start w-full shadow-md h-[400px]'>
            <div className='p-7 font-bold text-xl text-black flex flex-row justify-between items-center w-full h-auto bg-white rounded-xl -mb-5'>
                <span>{name}</span>
            </div>
            <div className='flex h-[300px] flex-col justify-start gap-2 p-7 pt-3 bg-white rounded-xl w-full overflow-y-auto'>
                {type === "products"
                    ? chartData.topProducts.map((product: any, index: number) => (
                          <TopProductItem
                              key={product.product.id}
                              item={product}
                              index={index}
                          />
                      ))
                    : chartData.topCustomer.map((customer: any, index: number) => (
                        <TopCustomerItem
                            key={customer.client.id}
                            item={customer}
                            index={index}
                        />
                    ))}
            </div>
        </div>
    );
};

export default TopChart;
