import { CloseCircleFilled, ExpandAltOutlined } from "@ant-design/icons"
import { Button, DatePicker, Flex, Form, Input, InputNumber, Modal, Select, Tag, message } from "antd"
import { createStyles } from "antd-style";
import { useState } from "react";
import { CustomModal } from "./MyCustomModal";
import fetchClient from "@/lib/fetch-client";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { AddTargetlistToCampaignModal } from "./AddTargetlistToCampaignModal";

export interface ICreateCampaignModal {
    afterCreated: () => void
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
export const CreateCampaignModal: React.FC<ICreateCampaignModal> = ({ afterCreated }) => {
    const [open, setOpen] = useState(false);
    const t: any = useTranslations("Marketing.Campaign")
    const t_general: any = useTranslations("General")
    const [targetlists, setTargetlist] = useState([])
    const showModal = () => {
        setOpen(true);
    };

    const handleOk = () => {
        setOpen(false);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const handleCreateCampaign = async (values: any) => {
        console.log(values)
        if (targetlists.length > 0) {
            values.targetlistIds = targetlists.map((item: any) => item.id)
        }
        try {
            const result = await fetchClient({
                method: "POST",
                url: "/campaigns",
                body: { ...values }
            })

            setOpen(false)
            afterCreated()

        } catch (error) {
            message.error(error as any)
        }
    }

    const getRandomColor = () => {
        return tagColor[Math.floor(Math.random() * tagColor.length)]
    }

    const handleDeleteTargetlist = (id: number) => {
        console.log("handleDeleteTargetlist", id)

        setTargetlist((prev: any) => {
            const newTargetlist = prev.filter((item:any) => item.id !== id)
            return newTargetlist;
        })
    }


    return <main className="ms-auto">
        <Button onClick={showModal}>{t_general("new")}</Button>
        <CustomModal
            open={open}
            title={t_general("add-new-resource", { resource: t("campaign") })}
            okType="primary"
            okButtonProps={{ className: "bg-primary" }}
            cancelText="Cancel"
            onCancel={handleCancel}
            footer={null}
            width={800}
        >
            <Form variant="filled" layout="vertical" style={{ maxWidth: 1000 }} onFinish={handleCreateCampaign}>
                <div className="flex space-x-2">
                    <div className='w-full'>
                        <Form.Item
                            label={t("name")} name="name" required
                            rules={[{
                                required: true,
                                message: t("createForm.validate-message", { action: t_general("input"), field: "name" })
                            }]}>
                            <Input placeholder={t('name')} />
                        </Form.Item>
                    </div>
                    <div className='w-full'>
                        <Form.Item
                            label={t("status")} name="status"
                            required
                            rules={[{ required: true, message: t("createForm.validate-message", { action: t_general("select"), field: t("status") }) }]}
                        >
                            <Select>
                                <Select.Option value="planning">{t("campaignStatus.planning")}</Select.Option>
                                <Select.Option value="active">{t("campaignStatus.active")}</Select.Option>
                            </Select>
                        </Form.Item>
                    </div>
                </div>

                <div className="flex space-x-2">
                    <div className='w-full'>
                        <Form.Item label={t("type")} name="type" required
                            rules={[{ required: true, message: t("createForm.validate-message", { action: t_general("select"), field: t("type") }) }]}
                        >
                            <Select>
                                <Select.Option value="newsletter">{t("campaignType.newsletter")}</Select.Option>
                                <Select.Option value="email">Email</Select.Option>
                            </Select>
                        </Form.Item>
                    </div>
                    <div className="w-full">
                        <Form.Item label={t("targetlists")}>
                            <Flex wrap="wrap" gap={4} >
                                {
                                    targetlists?.map((item: any, index: number) => {
                                        return (
                                            <Tag className="px-2 py-1 bg-bgsecondary rounded disabled" color={getRandomColor()}>
                                                <Link href={`/marketing/targetlists/${item.id}`}>{item.name}</Link>
                                                <CloseCircleFilled
                                                    className="ms-3 hover:text-red-500 cursor-pointer"
                                                    onClick={() => handleDeleteTargetlist(item.id)}

                                                />
                                            </Tag>)
                                    })
                                }

                                <AddTargetlistToCampaignModal
                                    onOk={(values: any) => { setTargetlist(values) }}
                                    excludeIds={targetlists ? targetlists.map((item: any) => item.id) : []}
                                    triggerText={t("add")}
                                />
                            </Flex>
                        </Form.Item>
                    </div>
                </div>

                <div className="flex space-x-2">
                    <div className='w-full'>
                        <Form.Item label={t("start-date")} name="startDate"
                            rules={[{ required: true, message: t("createForm.validate-message", { action: t_general("select"), field: t("start-date") }) }]}
                        >
                            <DatePicker className='w-full' />
                        </Form.Item>
                    </div>
                    <div className='w-full'>
                        <Form.Item label={t("end-date")} name="endDate" required
                            rules={[{ required: true, message: t("createForm.validate-message", { action: t_general("select"), field: t("end-date") }) }]}
                        >
                            <DatePicker className='w-full' />
                        </Form.Item>
                    </div>
                </div>

                <Form.Item>
                    <div className='flex justify-end space-x-2'>
                        <Button type="default" htmlType="reset">
                            {t_general("cancel")}
                        </Button>
                        <Button type="primary" htmlType="submit" style={{ backgroundColor: "#4A58EC", color: "white" }}>
                            {t_general("save")}
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </CustomModal>
    </main >
}