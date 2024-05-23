import fetchClient from "@/lib/fetch-client"
import { ArrowRightOutlined, CalendarOutlined } from "@ant-design/icons"
import { AxiosError } from "axios"
import { useTranslations } from "next-intl"
import { Suspense, useEffect, useState } from "react"
import TimeFormatter from "../TimeFormatter"

type CampaignStatisticData = {
    send: number,
    clicked: number,
    leadCreated: number,
    leadConverted: number,
    totalOrder: number,
    revenue: number
}
interface ICampaignHistoryAndStatisticProps {
    statisticInfo: CampaignStatisticData,
    campaignId: number | string,
    createdAt?: string,
    updatedAt?: string
}
export const CampaignHistoryAndStatistic: React.FC<ICampaignHistoryAndStatisticProps> = ({ campaignId, statisticInfo, ...props }) => {
    const [statisticData, setStatictisData] = useState<any>()
    const t_general = useTranslations("General")
    const t = useTranslations("Marketing.Campaign")
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>()
    const fetchData = async () => {
        setLoading(true)
        try {
            const result = await fetchClient({
                url: `/campaigns/${campaignId}/statistic`,
                data_return: true
            })
            setLoading(false)
            setStatictisData(result)
        } catch (error) {
            setLoading(false)
            if (error instanceof AxiosError && error.response) {
                setError({ message: error.response.data.message })
            } else {
                setError({ message: "Faild to load statistic data" })
            }
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    // if (!statisticData) return ""

    return (<div>
        <div className="bg-white pl-3 py-2">
            <p style={{ color: "#666666" }}>{t_general("created_at")}</p>
            <p>
                <TimeFormatter time={props.createdAt}/>
            </p>
             
            <p className="mt-1" style={{ color: "#666666" }}>{t_general("last-modified-at")}</p>
            <p><TimeFormatter time={props.updatedAt}/></p>
               
            {/* <p className="ml-5 mt-2" style={{ color: "#666666" }}><button><ArrowRightOutlined /> View all history </button></p> */}
        </div>

        <Suspense fallback={<p>Loading feed...</p>}>
            {statisticData && <div className="bg-white pl-3 py-2 mt-3 pb-10">
                <h2 className="font-bold">{t("campaignDetail.statistic")}</h2>
                <div className="mt-4 ml-2">
                    <div className="mt-2 grid grid-cols-2 gap-5">
                        <div>
                            <p>{t("campaignDetail.sent")}</p>
                            <p style={{ color: "#8DF185" }}>{statisticData.numOpens}</p>
                        </div>
                        <div>
                            <p>{t("campaignDetail.opened")}</p>
                            <p style={{ color: "#8DF185" }}>{statisticData.numOpens}</p>
                        </div>
                        <div>
                            <p>{t("campaignDetail.clicked")}</p>
                            <p style={{ color: "#8DF185" }}>{statisticData && statisticData.numClicks}</p>
                        </div>

                        {/* <div>
                            <p>Leads created</p>
                            <p style={{ color: "#8DF185" }}>{statisticInfo.leadCreated}</p>
                        </div> */}
                        {/* <div>
                            <p>Leads converts</p>
                            <p style={{ color: "#8DF185" }}>{statisticInfo.leadConverted}</p>
                        </div> */}

                        {/* <div>
                            <p>Total orders</p>
                            <p style={{ color: "#8DF185" }}>{statisticInfo.totalOrder}</p>
                        </div>
                        <div>
                            <p>Revenue</p>
                            <p style={{ color: "#8DF185" }}>{statisticInfo.revenue}</p>
                        </div> */}
                    </div>
                </div>
            </div>}
        </Suspense>
    </div>)
}