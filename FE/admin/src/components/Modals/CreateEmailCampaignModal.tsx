import { ExpandAltOutlined, PlusCircleFilled, PlusOutlined } from "@ant-design/icons"
import { Button, DatePicker, Form, Input, Modal, Select, Space } from "antd"
import { useState } from "react";
import { CustomModal } from "./MyCustomModal";
import TextArea from "antd/es/input/TextArea";
import { CSSProperties } from "styled-components";
import { ChooseTemplateModal } from "./ChooseTemplateModal";
import { useForm } from "antd/es/form/Form";

interface ICreateEmailCampaigntModal {
    onOk: (values: any) => Promise<void>,
    targetlists: Array<any>,
    triggerBtnClasseNames?: string
    className?: string,
    style?: CSSProperties

}
export const CreateEmailCampaigntModal: React.FC<ICreateEmailCampaigntModal> = ({ onOk, ...props }) => {
    const [open, setOpen] = useState(false);
    const [template, setTemplate] = useState<any>()
    const [form] = useForm()
    const showModal = () => {
        setOpen(true);
    };

    const handleOk = async (values: any) => {
        await onOk(values)
        setOpen(false);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const afterTemplateSelected = (template: any) => {
        console.log(template)
        setTemplate(template)
        form.setFieldValue("templateId", template.id)
    }

    return <main style={props.style} className={props.className}>
        <Button className={props.triggerBtnClasseNames} icon={<PlusOutlined />} onClick={showModal} />
        <CustomModal
            open={open}
            title="Create email marketing"
            okButtonProps={{ className: "bg-primary" }}
            footer={null}
            width={600}
            onCancel={handleCancel}
        >
            <Form
                name="form_group"
                variant="filled"
                form={form}
                layout="vertical"
                style={{ maxWidth: 1000 }}
                onFinish={handleOk}
            >
                <Form.Item label="Name" name="name" required rules={[{ required: true, message: 'Please input the group name !' }]}>
                    <Input placeholder='Group name' />
                </Form.Item>

                {/* <Form.Item label="Status" name="status" required rules={[{ required: true, message: 'Please input the group description !' }]}>
                    <Select>
                        <Select.Option value="pending">Pending</Select.Option>
                        <Select.Option value="draft">Draft</Select.Option>
                    </Select>
                </Form.Item> */}
                <Form.Item label="Start at" name="startDate">
                    <DatePicker format="DD/MM/YYYY hh:mm:A" showTime={{use12Hours: false}}/>
                </Form.Item>
                <Form.Item label="Subject" name="subject" required rules={[{ required: true, message: 'Please input the group description !' }]}>
                    <Input placeholder='Subject' />
                </Form.Item>

                <Form.Item label="Send From" name="sendFrom" required rules={[{ required: true, message: 'Please input the group description !' }]}>
                    <Select>
                        <Select.Option value="admin@admin.com">admin@admin.com</Select.Option>
                        <Select.Option value="admin1@admin.com">admin1@admin.com</Select.Option>
                        <Select.Option value="admin2@admin.com">admi2n@admin.com</Select.Option>
                    </Select>
                </Form.Item>


                <Form.Item label="Send to" name="sendTo" required rules={[{ required: true, message: 'Please input the group description !' }]}>
                    <Select
                        mode="multiple"
                        style={{ width: '100%' }}
                        placeholder="Please select"
                        options={
                            props.targetlists ? props.targetlists.map(item => ({
                                label: item.name,
                                value: item.id
                            })) : []
                        }
                    />
                </Form.Item>


                <p>Template</p>
                <div className="flex items-baseline">
                    <Form.Item name="templateId" className="w-full" required rules={[{ required: true, message: "Please choose an email template" }]}>
                        <Select className="w-full" dropdownRender={() => <></>}>
                            {template && <Select.Option value={template.id}>{template.name}</Select.Option>}
                        </Select>
                    </Form.Item>
                    <ChooseTemplateModal onOk={afterTemplateSelected} />
                </div>

                <Form.Item className="w-full">
                    <Space align="end">
                        <Button type="default" htmlType="reset" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button type="primary" htmlType="submit" style={{ backgroundColor: "#4A58EC", color: "white" }}>
                            Save
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </CustomModal>
    </main >
}