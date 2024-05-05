import { ArrowRightOutlined, CalendarOutlined } from "@ant-design/icons"
import TimeFormatter from "../TimeFormatter"
import { ConfigProvider } from "antd"

interface IDetailPageLayoutProps {
    dataCreatedAt?: string,
    dataUpdatedAt?: string,
    children: React.ReactElement
}


export const DetailPageLayout: React.FC<IDetailPageLayoutProps> = (props) => {
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
            <main className="mt-3 grid grid-cols-3 gap-4 w-100">
                <div className="col-span-2">{props.children}</div>
                <div className="col-span-1">
                    <div className="bg-white pl-3 py-2 shadow rounded">
                        <p style={{ color: "#666666" }}>Created at</p>
                        <div className="">
                            <CalendarOutlined style={{ color: "#4A58EC" }} />
                            {props.dataCreatedAt ? <TimeFormatter className="ms-2" time={props.dataCreatedAt} /> : "Unknown "}
                            {/* <span style={{ color: "#4A58EC" }}>by Minh Vuong</span> */}
                        </div>
                        {/* <p className="ml-5 mt-2" style={{ color: "#666666" }}><button><ArrowRightOutlined /> View all history </button></p> */}
                        <div>
                            <p className="mt-1" style={{ color: "#666666" }}>Last modified</p>
                            <p><CalendarOutlined style={{ color: "#4A58EC" }} />
                                {props.dataCreatedAt ? <TimeFormatter time={props.dataCreatedAt}  className="ms-2"/> : "Unknown "}
                                {/* <span style={{ color: "#4A58EC" }}>Minh Vuong</span> */}
                            </p>
                        </div>
                    </div>
                </div>
            </main>

        </ConfigProvider>
    )

}