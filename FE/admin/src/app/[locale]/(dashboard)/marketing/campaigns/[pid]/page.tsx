"use client"
import { useEffect, useState } from "react"
import { EllipsisOutlined } from '@ant-design/icons';
import { useParams } from 'next/navigation'
import {
    Button,
    Form,
    message,
    Popconfirm,
    ConfigProvider
} from "antd";
import { CampaignOverview } from "@/components/CampaignComponents/CampaignOverview";
import { CampaignMarketing } from "@/components/CampaignComponents/CampaignEmailMarketing";
import { CampaignTargetList } from "@/components/CampaignComponents/CampaignTargetList";
import { CampaignTrackUrl } from "@/components/CampaignComponents/CampaignTrackUrl";
import { CampaignHistoryAndStatistic } from "@/components/CampaignComponents/CampaignHistoryAndStatistic";
import fetchClient from "@/lib/fetch-client";
import PreviewMode from "@/components/EmailTemplateComponents/DropContainer/preview-mode";
import { AxiosError } from "axios";


type CampaignData = {
    id: number,
    name: string,
    type: string,
    status: string,
    startDate: string,
    endDate: string,
    budget?: number,
    unit?: null,
    totalSent?: number,
    createdAt?: string,
    updatedAt?: string,
    targetLists: Array<any>,
    emailCampaigns: Array<any>,
    trackUrls: Array<any>
}
const CampaignDetail = () => {
    const [editmode, setEditmode] = useState(false)
    const [loading, setLoading] = useState(false);
    const [campaignData, setCampaignData] = useState<CampaignData>()

    const params = useParams<{ locale: string; pid: string }>()

    const fetchData = async () => {
        setLoading(true)
        try {
            const data = await fetchClient({
                url: `/campaigns/${params.pid}`
                , data_return: true
            })

            setCampaignData(data)
            setLoading(false)
        } catch (error: AxiosError | any) {
            setLoading(false)
            message.error(error as any)
            throw new Error(error.cause.response.data.message)
        }
    }
    useEffect(() => {
        fetchData()
    }, [])

    if (!campaignData) return ""

    const handleSaveChange = async (values: any) => {
        const dataUpdate = { ...values };

        try {
            const updatedCampaign = await fetchClient({
                url: `/campaigns/${params.pid}`,
                method: "PUT", body: { ...dataUpdate },
                data_return: true
            })
            setCampaignData(updatedCampaign);
            setEditmode(false)
        } catch (error: any) {
            message.error("Something wrong!", error?.message)
            throw new Error(error)
        }
    }

    const handleCancelChange = () => {
        setEditmode(false)
    }

    const handleUpdateTargetlist = async (ids: number[], action: string) => {
        try {
            const result = await fetchClient({
                method: "PUT",
                url: `/campaigns/${params.pid}`,
                body: {
                    targetlists: {
                        action,
                        ids
                    }
                },
                data_return: true
            })
            message.success(`${action === "add" ? "Add targetlist to campaign successfully" :
                "Remove targetlist from campaign successfully"}`)
            setCampaignData(result)

        } catch (error: any) {
            console.log(error)
            message.error("Add targetlist failds")
            throw new Error(error.data.respone.message)
        }
    }

    const handleCreateEmailCampaign = async (values: any) => {
        console.log(values)
        const {sendTo, ...createData} = values 
        try {
            const newEmail = await fetchClient({
                method: "POST",
                url: `/campaigns/${params.pid}/emails`,
                body: {
                    data: {
                        ...createData,
                        targetlistIds: sendTo
                    }
                },
                data_return: true
            })

            if (campaignData) {
                const newEmailCampaign = [...campaignData.emailCampaigns || [], newEmail]
                setCampaignData(prev => (prev && { ...prev, emailCampaigns: newEmailCampaign }))
            }



        } catch (error) {
            console.log(error)
            throw error
        }
    }

    const handleDeleteEmailCampaign = async (id: number) => {
        try {
            const result = await fetchClient({
                method: "DELETE",
                url: `/campaigns/${params.pid}/emails/${id}`,
                data_return: true
            })

            if (result) {
                const newEmailCampaigns = campaignData.emailCampaigns.filter(item => item.id !== id)
                setCampaignData(prev => (prev && { ...prev, emailCampaigns: newEmailCampaigns }))
                message.success("Delete email campaign successfully")
            }
        } catch (error) {
            message.error("Faild to delete email campaign")
            console.log(error)
            throw new Error(error as any)
        }
    }

    const handleCreateTrackUrl = async (values:any) => {
        try {
            const newTrackUrl = await fetchClient({
                method: "POST",
                url: `/campaigns/${params.pid}/track-url`,
                body: {
                    data: {...values}
                },
                data_return:true
            }) 

            const newTrackUrls = [...campaignData.trackUrls || [], newTrackUrl]
            setCampaignData(prev => (prev && { ...prev, trackUrls: newTrackUrls }))
            message.success("create track url successfully")
        } catch (error) {
            message.error("Faild to create track url")
            console.log(error)
            throw new Error(error as any)
        }
    }
    const handleDeleteTrackUrl = async (id:number) => {
        try {
            const result = await fetchClient({
                method: "DELETE",
                url: `/campaigns/${params.pid}/track-url/${id}`,
                data_return: true
            })

            if (result) {
                const newTrackUrls = campaignData.trackUrls.filter(item => item.id !== id)
                setCampaignData(prev => (prev && { ...prev, trackUrls: newTrackUrls }))
                message.success("Delete track url successfully")
            }
        } catch (error) {
            message.error("Faild to delete track url")
            console.log(error)
            throw new Error(error as any)
        }
    }

    const { targetLists, emailCampaigns, trackUrls, ...overview } = campaignData
    let statisticInfo: any = { send: 0, clicked: 0, lead_created: 0, lead_converted: 0, total_order: 0, revenue: "+ $124" }

    return (
        <ConfigProvider
            theme={{
                components: {
                    Form: {
                        itemMarginBottom: 12,
                        verticalLabelPadding: "0 0 6"
                    }
                }
            }}
        >
            <Form
                layout="vertical"
                onFinish={handleSaveChange}
            >

                <div>
                    {
                        editmode ?
                            (<Form.Item className="flex">
                                <Button
                                    className="p-1 px-1 text-white"
                                    style={{
                                        border: "1px solid #DADAD9",
                                        borderRadius: "4px 0px 0px 4px",
                                        backgroundColor: "#4A58EC"
                                    }}
                                    htmlType="submit"
                                >
                                    Save
                                </Button>
                                <Popconfirm title="Your change will not save. Are you sure?">
                                    <Button
                                        className="p-1 px-1"
                                        style={{
                                            borderWidth: "1px 0px 1px 0px", borderBlockColor: "#DADAD9",
                                            borderStyle: "solid", backgroundColor: "#F9FAFB"
                                        }}
                                        onClick={handleCancelChange}
                                    >
                                        Cancel
                                    </Button>
                                </Popconfirm>
                                <button className="p-1 px-1" type="button" style={{ borderWidth: "1px 1px 1px 1px", borderBlockColor: "#DADAD9", borderStyle: "solid", borderRadius: "0px 4px 4px 0px", backgroundColor: "#F9FAFB" }}>
                                    <EllipsisOutlined />
                                </button>
                            </Form.Item>) : <Button onClick={() => setEditmode(true)}>Edit</Button>
                    }
                    <div className="mt-3 grid grid-cols-3 gap-4">
                        <div className="col-span-2">
                            <CampaignOverview isEditmode={editmode} campaignInfo={overview} />
                            <CampaignTargetList
                                isEditmode={editmode}
                                targetLists={targetLists || []}
                                campaignId={params.pid}
                                handleUpdateTargetlist={handleUpdateTargetlist}
                            />
                            <CampaignMarketing
                                isEditmode={editmode}
                                emails={emailCampaigns || []}
                                // targitlists={targetLists || []}
                                targetlists={targetLists}
                                campaignId={params.pid}
                                handleCreate={handleCreateEmailCampaign}
                                handleDelete={handleDeleteEmailCampaign}

                            />
                            <CampaignTrackUrl 
                                handleCreate = {handleCreateTrackUrl}
                                handleDelete = {handleDeleteTrackUrl}
                                isEditmode={editmode} 
                                trackUrls={trackUrls || []} />
                        </div>
                        <CampaignHistoryAndStatistic campaignId={params.pid} statisticInfo={statisticInfo} />
                    </div>
                </div>
            </Form>
        </ConfigProvider>

    )
}

export default CampaignDetail
