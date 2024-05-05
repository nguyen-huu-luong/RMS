import { Button, DatePicker, Flex, Form, Input, Popconfirm, Select, Space, Tag, message } from "antd"
import { Dispatch, SetStateAction, useState } from "react"
import TimeFormatter from "../TimeFormatter"
import dayjs from 'dayjs';
import { UpdatableInput } from "../UpdatableInput/UpdatableInput";
import Link from "next/link";
import { CloseCircleFilled, EllipsisOutlined } from "@ant-design/icons";
import { AddTargetlistToCampaignModal } from "../Modals/AddTargetlistToCampaignModal";
import fetchClient from "@/lib/fetch-client";
import { AxiosError } from "axios";

export interface ICampaignOverview {
    editmode: boolean,
    setEditmode: Dispatch<SetStateAction<boolean>>,
    campaignInfo: any,
    targetlists?: Array<any>,
    handleSaveChange: (values: any) => Promise<any>
}

const tagColor = [
    "magenta",
    "red",
    "volcano",
    "orange",
    "gold",
    "lime",
    "green",
    "cyan",
    "blue",
    "geekblue",
    "purple",
]

export const CampaignOverview: React.FC<ICampaignOverview> = ({ editmode, setEditmode, campaignInfo, targetlists, ...props }) => {
    const [tempTargetlist, setTempTargetlist] = useState(targetlists || [])

    const handleSubmForm = async (values: any) => {
        values.targetlists = {
            action: "replace",
            ids: tempTargetlist.map(item => item.id)
        }

        try {
            await props.handleSaveChange(values);
            setEditmode(false)
            message.success("Update campaign  successfully");
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                message.error(error.response.data.message)
            }
        }
    }

    const handleCancelChange = () => {
        setEditmode(false)
        setTempTargetlist(targetlists || [])
    }

    const handleDeleteTargetlist = (id: number) => {
        console.log("handleDeleteTargetlist", id)
        console.log(tempTargetlist)

        setTempTargetlist(prev => {
            const newTargetlist = prev.filter(item => item.id !== id)
            return newTargetlist;
        })
    }

    const handleAddTargetlistToCampaign = (values: any) => {
        console.log(values)
        setTempTargetlist(prev => ([...prev, ...values]))
    }


    const getRandomColor = () => {
        return tagColor[Math.floor(Math.random() * tagColor.length)]
    }

    return <>

        <Form
            layout="vertical"
            onFinish={handleSubmForm}
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
                                    htmlType="reset"
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
            </div>
            <div className="bg-white pl-3 py-2">
                <div>
                    <h1 className="font-bold text-primary">Overview</h1>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-3 text-black">
                    <Form.Item
                        name="name"
                        label={<b style={{ color: "#666" }}>Name</b>}
                    >
                        {editmode ? <Input placeholder="Enter name of the campaign..."
                            defaultValue={campaignInfo.name}
                            disabled={!editmode}
                        /> : <p>{campaignInfo.name}</p>}
                    </Form.Item>
                    <Form.Item label={<b style={{ color: "#666" }}>Status</b>} name="status">
                        {editmode ?
                            <Select className="rounded-md" defaultValue={campaignInfo.status} >
                                <option value="planning">Planning</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </Select> :
                            <p className="first-letter:uppercase">{campaignInfo.status}</p>
                        }
                    </Form.Item>

                    <Form.Item label={<b style={{ color: "#666" }}>Type</b>} name="type" >
                        {editmode ?
                            <Select className="rounded-md" defaultValue={campaignInfo.type}>
                                <option value="newsletter">Newsletter</option>
                                <option value="email">Email</option>
                            </Select> :
                            <p className="first-letter:uppercase">{campaignInfo.type}</p>
                        }
                    </Form.Item>
                    <Form.Item
                        label={<b style={{ color: "#666" }}>Start Date</b>}
                        name="startDate"
                    >
                        {editmode ? <DatePicker defaultValue={dayjs(campaignInfo.startDate)} className="w-full" />
                            : <TimeFormatter icon time={campaignInfo.startDate} />}
                    </Form.Item>

                    <Form.Item
                        name="budget"
                        label={<b style={{ color: "#666" }}>Budget</b>}
                    >
                        {editmode ? <Input
                            defaultValue={campaignInfo.budget}
                            disabled={!editmode}
                        /> : <p>{campaignInfo.budget || "Unknown"}</p>}
                    </Form.Item>

                    <Form.Item
                        label={<b style={{ color: "#666" }}>End Date</b>}
                        name="endDate"
                        className="w-full"
                    >
                        {editmode ? (<DatePicker defaultValue={campaignInfo.endDate && dayjs(campaignInfo.endDate)} className="w-full" />) :
                            <TimeFormatter time={campaignInfo.endDate} />}
                    </Form.Item>

                    <Form.Item label={<b style={{ color: "#666" }}>Targetlists</b>} name="targetlists">
                        <Flex wrap="wrap" gap={4} >
                            {
                                tempTargetlist?.map((item: any, index: number) => {
                                    return (
                                        <Tag className="px-2 py-1 bg-bgsecondary rounded" color={getRandomColor()}>
                                            <Link href={`/marketing/targetlists/${item.id}`}>{item.name}</Link>
                                            {editmode && <CloseCircleFilled
                                                className="ms-3 hover:text-red-500 cursor-pointer"
                                                onClick={() => handleDeleteTargetlist(item.id)}

                                            />}
                                        </Tag>)
                                })
                            }

                            {editmode && <AddTargetlistToCampaignModal
                                onOk={(values: any) => { handleAddTargetlistToCampaign(values) }}
                                excludeIds={tempTargetlist ? tempTargetlist.map(item => item.id) : []}
                                triggerText="Add"
                            />}
                        </Flex>
                    </Form.Item>
                </div>
            </div>
        </Form>
    </>

}