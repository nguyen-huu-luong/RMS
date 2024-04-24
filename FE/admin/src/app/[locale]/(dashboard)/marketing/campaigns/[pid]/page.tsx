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
    targetLists: [],
    emailMarketings: [],
    trackUrls: []
}
const CampaignDetail = () => {
    const [editmode, setEditmode] = useState(false)
    const [loading, setLoading] = useState(false);
    const [campaignData, setCampaignData] = useState<CampaignData>()
    const [tempData, setTempData] = useState<CampaignData>()

    const params = useParams<{ locale: string; pid: string }>()

    const fetchData = async () => {
        setLoading(true)
        try {
            const data = await fetchClient({
                url: `/campaigns/${params.pid}`
                , data_return: true
            })

            setCampaignData(data)
            setTempData(data)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            message.error(error as any)
        }
    }
    useEffect(() => {
        fetchData()
    }, [])

    // const compareArray = (arr1: number[], arr2: number[]) => {
    //     if (arr1.length !== arr2.length) return false;
    //     arr1.sort()
    //     arr2.sort()
    //     for (let i = 0; i < arr1.length; i++) {
    //         if (arr1[i] !== arr2[i]) return false;
    //     }
    //     return true;
    // }

    // const getIds = (obj: Array<any>) => {
    //     return obj.map((item) => item.id);
    // }
    if (!tempData) return ""


    const handleSaveChange = async (values: any) => {
        console.log(tempData)
        const { targetLists, emailMarketings, trackUrls, ...rest } = tempData;
        const dataUpdate = { ...values };

        try {
            const updatedCampaign = await fetchClient({ url: `/campaigns/${params.pid}`, method: "PUT", body: { ...dataUpdate }, data_return: true })
            setCampaignData(updatedCampaign);
            setTempData(updatedCampaign)
            setEditmode(false)
        } catch (error: any) {
            message.error("Something wrong!", error?.message)
        }

    }

    const handleCancelChange = () => {
        setEditmode(false)
    }

    const handleUpdateTargetlist = async (ids: number[], action: string) => {
        try {
            const result = await fetchClient({
                method: "PUT",
                url: `/campaigns/${params.pid}}`,
                body: {
                    targetlists: {
                        action,
                        ids
                    }
                },
                data_return: true
            })
            console.log(result)

        } catch (error) {
            console.log(error)
        }
    }

    const { targetLists, emailMarketings, trackUrls, ...overview } = tempData
    let statisticInfo: any = { send: 0, clicked: 0, lead_created: 0, lead_converted: 0, total_order: 0, revenue: "+ $124" }
    return (
        <ConfigProvider
            theme={{
                components: {
                    Form: {
                        itemMarginBottom: 8,
                        verticalLabelPadding: "0 0 4"
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
                            <CampaignTargetList isEditmode={editmode} targetLists={targetLists || []} campaignId={params.pid} />
                            <CampaignMarketing isEditmode={editmode} emails={emailMarketings || []} />
                            <CampaignTrackUrl isEditmode={editmode} trackUrls={trackUrls || []} />
                        </div>
                        <CampaignHistoryAndStatistic statisticInfo={statisticInfo} />
                    </div>
                </div>
            </Form>
        </ConfigProvider>

    )
}

export default CampaignDetail
