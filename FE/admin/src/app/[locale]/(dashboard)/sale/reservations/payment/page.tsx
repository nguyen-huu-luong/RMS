"use client"
import {
    CheckCircleFilled
} from "@ant-design/icons";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from 'next/navigation'
import { useEffect } from "react";
import { useRouter } from "next-intl/client";
import { useParams } from "next/navigation";
import fetchClient from "@/lib/fetch-client";

const TablePayment = () => {
    const searchParams = useSearchParams()
    const payMethod = searchParams.get('method')
    const resultCode = searchParams.get('resultCode')
    const tableId = searchParams.get('tid')
    const router = useRouter()

    const updateOrder = async (orderInfoJS: any) => {
        console.log(orderInfoJS)
        await fetchClient({ method: "POST", url: `/tables/order/momo/${tableId}`, body: orderInfoJS })
        await fetchClient({ method: "PUT", url: `/tables/detail?id=${tableId}`, body: { "status": "Free" } })
    }

    useEffect(() => {
        let checker = localStorage.getItem("orderInfo")
        let orderInfo = searchParams.get('extraData')
        console.log(checker)
        console.log(resultCode)
        if (resultCode == "0" && checker == "1" && orderInfo) {
            localStorage.setItem('orderInfo', "0")
            let orderInfoJS = Buffer.from(orderInfo, "base64").toString()
            orderInfoJS = JSON.parse(orderInfoJS)
            updateOrder(orderInfoJS)
        }
    }, [])
 
    if (payMethod == "MOMO") {
        if (resultCode == "0") {}
        else {
            router.push(`/sale/reservations/${tableId}`)
            return
        }
    }

    return (

        <div  className='flex flex-col lg:flex-row justify-between gap-5 p-10 bg-white pb-9' style={{height: "99%"}}>
                    <div className='w-full h-auto flex flex-col justify-center items-center gap-5 p-8 bg-primary-white rounded-3xl transition-all duration-300' style={{paddingBottom: "10px"}}>
                        <div className='w-auto h-auto rounded-lg overflow-hidden text-primary'>
                            <CheckCircleFilled
                                style={{
                                    fontSize: "5rem",
                                    color: "#F8B64C"
                                }}
                            />
                        </div>
                        <h3 className="font-extrabold text-xl" >
                            MAKE PAYMENT SUCCESSFULLY
                        </h3>
                        <Link
                            href={"/sale/reservations/"}
                            className='p-2 text-white px-10 w-auto h-auto rounded-lg  text-lg border-orange-500 border-2 hover:bg-primary-400 text-item-white transition-all duration-300 flex justify-center'
                            style={{backgroundColor: "#EA6A12"}}
                        >
                            GO TO RESERVATION MANAGEMENT PAGE
                        </Link>
                    </div>
        </div>
    );
}

export default TablePayment