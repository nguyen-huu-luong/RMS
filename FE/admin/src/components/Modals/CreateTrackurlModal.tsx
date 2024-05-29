import { ExpandAltOutlined, PlusCircleFilled, PlusOutlined } from "@ant-design/icons"
import { Button, Form, Input, Modal, Select, Space } from "antd"
import { useState } from "react";
import { CustomModal } from "./MyCustomModal";
import TextArea from "antd/es/input/TextArea";
import { CSSProperties } from "styled-components";
import { ChooseTemplateModal } from "./ChooseTemplateModal";
import { useForm } from "antd/es/form/Form";
import { useTranslations } from "next-intl";

interface ICreateTrackUrlModalProps {
    onOk: (values: any) => Promise<void>,
    triggerBtnClasseNames?: string
    className?: string,
    style?: CSSProperties

}
export const CreateTrackUrlModal: React.FC<ICreateTrackUrlModalProps> = ({ onOk, ...props }) => {
    const t: any = useTranslations("Marketing.Campaign")
    const t_general = useTranslations("General")
    const [open, setOpen] = useState(false);
    const showModal = () => {
        setOpen(true);
    };

    const handleOk = async (values: any) => {
        await onOk(values)
        setOpen(false);
    };

    const handleCancel = () => {
        setOpen(false);
    }

    return <main style={props.style} className={props.className}>
        <Button className={props.triggerBtnClasseNames} icon={<PlusOutlined />} onClick={showModal} />
        <CustomModal
            open={open}
            title={t_general("add-new-resource", {resource: "track-url"})}
            okButtonProps={{ className: "bg-primary" }}
            footer={null}
            width={600}
            onCancel={handleCancel}
        >
            <Form
                name="form_group"
                variant="filled"
                layout="vertical"
                style={{ maxWidth: 1000 }}
                onFinish={handleOk}
            >
                <Form.Item label={t("name")} name="name" required rules={[{ required: true, message: 'Please input the name of track url !' }]}>
                    <Input />
                </Form.Item>

                <Form.Item 
                    label={t("campaignDetail.redirect-url")}
                    name="redirectUrl" required 
                    rules={[
                        { required: true, message: 'Please input the url!', validateTrigger: ["onBlur"]  },
                        { type: "url", message: 'Please input the valid url!' },
                    ]}>
                    <Input placeholder='Redirect url' />
                </Form.Item>

                <Form.Item>
                    <Space align="end">
                        <Button type="default" htmlType="reset" onClick={handleCancel}>
                            {t_general("cancel")}
                        </Button>
                        <Button type="primary" htmlType="submit" style={{ backgroundColor: "#4A58EC", color: "white" }}>
                            {t_general("save")}
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </CustomModal>
    </main >
}