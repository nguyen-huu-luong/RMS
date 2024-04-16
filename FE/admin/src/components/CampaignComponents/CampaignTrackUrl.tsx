import { PlusOutlined } from "@ant-design/icons"
import { Button, Form, Modal, Select, Table, TableProps } from "antd"
import { title } from "process";
import { render } from "react-dom";

export interface ICampaignTrackUrl {
    trackUrls: [],
    isEditmode: boolean,
}

export const CampaignTrackUrl: React.FC<ICampaignTrackUrl> = ({ trackUrls, isEditmode }) => {

    const handleAddTargetList = () => {

    }
    return (
        <div className="bg-white pl-3 py-2 mt-3">
            <div className='flex justify-between py-1 pr-2 ' style={{ width: "98%" }}>
                <div>
                    <h1 className="font-bold">Track Urls</h1>
                </div>
                {isEditmode &&
                    <div>
                        <button onClick={() => handleAddTargetList()}>
                            <PlusOutlined />
                        </button>
                    </div>
                }
            </div>
            <div className="mt-3">
                <div className="mt-2 grid grid-cols-2 gap-2">
                    <h5 style={{ color: "#666666" }}>Name</h5>
                    <h5 style={{ color: "#666666" }}>URL</h5>
                    {
                        trackUrls.map((item: any) => {
                            return (
                                <>
                                    <p className="text-primary">{item.name}</p>
                                    <p className="text-primary">{item.url}</p>
                                </>
                            )
                        })
                    }
                </div>
            </div>
        </div>)
}

                               