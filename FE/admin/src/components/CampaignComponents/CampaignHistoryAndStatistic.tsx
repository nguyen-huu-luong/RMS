import { ArrowRightOutlined, CalendarOutlined } from "@ant-design/icons"


type CampaignStatisticData = {
    send: number,
    clicked: number,
    leadCreated: number,
    leadConverted: number,
    totalOrder: number,
    revenue: number
}
interface ICampaignHistoryAndStatistic {
    statisticInfo:  CampaignStatisticData 
}
export const CampaignHistoryAndStatistic: React.FC<ICampaignHistoryAndStatistic> = ({statisticInfo}) => {
    return (<div>
        <div className="bg-white pl-3 py-2">
            <p style={{ color: "#666666" }}>Created at</p>
            <p><CalendarOutlined style={{ color: "#4A58EC" }} /> December 13, 2022 by <span style={{ color: "#4A58EC" }}>Minh Vuong</span></p>
            <p className="mt-1" style={{ color: "#666666" }}>Last modified</p>
            <p><CalendarOutlined style={{ color: "#4A58EC" }} /> December 16, 2024  by <span style={{ color: "#4A58EC" }}>Minh Vuong</span></p>
            <p className="ml-5 mt-2" style={{ color: "#666666" }}><button><ArrowRightOutlined /> View all history </button></p>
        </div>

        <div className="bg-white pl-3 py-2 mt-3 pb-10">
            <h2 className="font-bold">Statistic</h2>
            <div className="mt-4 ml-2">
                <div className="mt-2 grid grid-cols-2 gap-5">
                    <div>
                        <p>Sent</p>
                        <p style={{ color: "#8DF185" }}>{statisticInfo.send}</p>
                    </div>
                    <div>
                        <p>Clicked</p>
                        <p style={{ color: "#8DF185" }}>{statisticInfo.clicked}</p>
                    </div>

                    <div>
                        <p>Leads created</p>
                        <p style={{ color: "#8DF185" }}>{statisticInfo.leadCreated}</p>
                    </div>
                    <div>
                        <p>Leads converts</p>
                        <p style={{ color: "#8DF185" }}>{statisticInfo.leadConverted}</p>
                    </div>

                    <div>
                        <p>Total orders</p>
                        <p style={{ color: "#8DF185" }}>{statisticInfo.totalOrder}</p>
                    </div>
                    <div>
                        <p>Revenue</p>
                        <p style={{ color: "#8DF185" }}>{statisticInfo.revenue}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>)
}