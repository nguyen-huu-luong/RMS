"use client";
import React, { useState, Suspense } from "react";
import Stats from "@/components/Statistics/Stats";
import TimeBar from "@/components/Statistics/TimeBar";
import TopChart from "@/components/Statistics/TopChart";
import OrderChart from "@/components/Statistics/OrderChart";
import LeadChart from "@/components/Statistics/LeadChart";
import SegmentationOverview from "@/components/Statistics/SegmentationOverview";
import TabNav from "@/components/Statistics/TabNav";
import SegmentationChart from "@/components/Statistics/SegmentationChart";
import { useLocale, useTranslations } from "next-intl";
type Option = {
    type: string | "DAILY" | "MONTHLY" | "YEARLY" | "CUSTOM";
    beginDate?: Date;
    endDate?: Date;
};

function Overview() {
    const daily: Option = { type: "DAILY" };
    const [option, setOption] = useState<Option>({
        type: "MONTHLY",
    });
    const [component, setComponent] = useState<any>({
        dailyStats: false,
        monthlyStats: false,
        topProducts: false,
        topCustomers: false,
        orderChart: false,
        leadChart: false,
        segmentationChart: false,
    });

    const [reportType, setReportType] = useState<any>("1")
    const [customerLoading, setCustomerLoading] = useState<any>("Sumarize")
    const t_report: any = useTranslations("Report")
    const t_general: any = useTranslations("General")

    return (
        <div className='w-full h-auto overflow-scroll p-4 flex flex-col gap-4 justify-start items-center'>
            <TabNav setReportType={setReportType} />
            {
                reportType === "1" ? (<>
                    <Stats
                        option={daily}
                        setComponent={setComponent}
                        component={component}
                    />
                    <TimeBar
                        option={option}
                        setOption={setOption}
                        setComponent={setComponent}
                    />
                    {component.monthlyStats && (
                        <Stats
                            option={option}
                            setComponent={setComponent}
                            component={component}
                        />
                    )}
                    <div className='w-full flex flex-row gap-5 justify-start '>
                        {component.topProducts && (
                            <TopChart
                                name={t_report('top_product')}
                                type={"products"}
                                option={option}
                                setComponent={setComponent}
                                component={component}
                            />
                        )}
                        {component.topCustomers && (
                            <TopChart
                                name={t_report('top_customer')}
                                type={"customers"}
                                option={option}
                                setComponent={setComponent}
                                component={component}
                            />
                        )}
                    </div>
                    {component.orderChart && <OrderChart option={option} component={component} setComponent={setComponent} />}
                    {component.leadChart && <LeadChart option={option} component={component} setComponent={setComponent} />}
                </>)
                    : (
                        <>
                            {<SegmentationOverview  />}
                            {<SegmentationChart   />}
                        </>
                    )
            }
        </div>
    );
}

export default Overview;
