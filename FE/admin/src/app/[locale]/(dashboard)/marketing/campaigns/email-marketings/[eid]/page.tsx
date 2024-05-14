"use client"
import { DetailPageLayout } from "@/components/DetailPageLayout"
import { AddClientToTargetListModal } from "@/components/Modals/AddClientToTargetListModal"
import { ClientTable } from "@/components/TargetListPageComponents/ClientTable"
import TimeFormatter from "@/components/TimeFormatter"
import { UpdatableInput } from "@/components/UpdatableInput/UpdatableInput"
import fetchClient from "@/lib/fetch-client"
import { EllipsisOutlined } from "@ant-design/icons"
import { Button, ConfigProvider, Form, Input, Popconfirm, Space, message } from "antd"
import { useForm } from "antd/es/form/Form"
import { TableProps } from "antd/es/table"
import { AxiosError } from "axios"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"


type ColumnsType<T> = TableProps<T>["columns"];

interface CustomerType {
    key: React.Key;
    id: number;
    phone: string;
    fullname: string;
    email: string;
    createdAt: string;
}

interface LeadType {
    key?: React.Key;
    id: number;
    fullname: string;
    status: string,
    email: string;
}

type TargetlistData = {
    id: number,
    name: string,
    description: string,
    type: string,
    createdAt: string,
    updatedAt: string,
    count: {
        total: number,
        leads: number,
        customer: number,
    }
    leads: Array<any>,
    customers: Array<any>
}
const TargetListDetail = () => {
    const [editmode, setEditmode] = useState(false)
    const [data, setData] = useState<TargetlistData>()
    const [loading, setLoading] = useState(false)
    const [selecteds, setSelected] = useState<{ leads: LeadType[], customers: CustomerType[] }>({
        leads: [],
        customers: []
    })

    const params = useParams<{ locale: string; tid: string }>()

    const fetchData = async () => {
        setLoading(true);
        try {

            const targetlistInfo = await fetchClient({
                url: `/targetlists/${params.tid}`,
                data_return: true
            })
            setData(targetlistInfo);
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log(error)
            if (error instanceof AxiosError) {
                
            }
            message.error(error as string)
        }
    }
    useEffect(() => {
        fetchData();
    }, [])


    const handleCancelChange = () => {
        setEditmode(false)  
    }
    const [form] = useForm()

    
    return (
        // <DetailPageLayout dataCreatedAt={}>

        <>
        </>
        // </DetailPageLayout>
    )
}

export default TargetListDetail;