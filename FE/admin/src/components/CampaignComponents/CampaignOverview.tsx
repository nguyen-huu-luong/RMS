import { DatePicker, Form, Input, Select } from "antd"
import { useState } from "react"
import TimeFormatter from "../TimeFormatter"
import dayjs from 'dayjs';

export interface ICampaignOverview {
    isEditmode: boolean,
    campaignInfo: any
}

export const CampaignOverview: React.FC<ICampaignOverview> = ({ isEditmode, campaignInfo }) => {
    // const editStyle = { outline: "0", backgroundColor: "#F6FAFD", border: "1px solid #DADAD9", paddingLeft: "5px" }
    // const normalStyle = { outline: "0", backgroundColor: "#fff", border: "none", color: "black", paddingLeft: 0 }

    // const style = isEditmode ? editStyle : normalStyle
    return <>
        <div className="bg-white pl-3 py-2">
            <div>
                <h1 className="font-bold text-primary">Overview</h1>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-3 text-black">
                <Form.Item
                    name="name"
                    label={<p style={{ color: "#666" }}>Name</p>}
                >
                    {isEditmode ? <Input placeholder="Enter name of the campaign..."
                        defaultValue={campaignInfo.name}
                        disabled={!isEditmode}
                    /> : <b>{campaignInfo.name}</b>}
                </Form.Item>
                <Form.Item label={<p style={{ color: "#666" }}>Status</p>} name="status">
                    {isEditmode ?
                        <Select className="rounded-md" defaultValue={campaignInfo.status} >
                            <option value="planning">Planning</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </Select> :
                        <b>{campaignInfo.status}</b>
                    }
                </Form.Item>

                <Form.Item label={<p style={{ color: "#666" }}>Type</p>} name="type" >
                    {isEditmode ?
                        <Select className="rounded-md" defaultValue={campaignInfo.type}>
                            <option value="newsletter">Newsletter</option>
                            <option value="email">Email</option>
                            <option value="welcome">Welcome</option>
                        </Select> :
                        <b>{campaignInfo.type}</b>
                    }
                </Form.Item>
                <Form.Item
                    label="Start Date"
                    name="startDate"
                >
                    {isEditmode ? <DatePicker defaultValue={dayjs(campaignInfo.startDate)} className="w-full"/>
                        : <TimeFormatter icon time={campaignInfo.startDate} />}
                </Form.Item>

                <Form.Item
                    name="budget"
                    label={<p style={{ color: "#666" }}>Budget</p>}
                >
                    {isEditmode ? <Input
                        defaultValue={campaignInfo.budget}
                        disabled={!isEditmode}
                    /> : <b>{campaignInfo.budget}</b>}
                </Form.Item>

                <Form.Item
                    label="End Date"
                    name="endDate"
                    className="w-full"
                >
                    {isEditmode ? <DatePicker defaultValue={dayjs(campaignInfo.endDate)} className="w-full"/> : <TimeFormatter time={campaignInfo.endDate} />}
                </Form.Item>
            </div>
        </div>
    </>

}