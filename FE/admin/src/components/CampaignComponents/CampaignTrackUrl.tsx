import { CopyFilled, CopyOutlined } from "@ant-design/icons";
import { Button, Table, TableProps } from "antd";
import Link from "next/link";
import { CreateTrackUrlModal } from "../Modals/CreateTrackurlModal";
import { useTranslations } from "next-intl";
import { BsTrash } from "react-icons/bs";

interface DataType {
    key: number;
    id: number,
    name: string;
    redireactUrl: string;
    codeToInsert: string;
    actions?: any
}

export interface ICampaignTrackUrlProps {
    trackUrls: Array<any>,
    isEditmode: boolean,
    handleCreate: (values:any) => Promise<void>,
    handleDelete: (id:number) => Promise<void>,
}

export const CampaignTrackUrl: React.FC<ICampaignTrackUrlProps> = ({ trackUrls, isEditmode, ...props }) => {
    const t: any = useTranslations("Marketing.Campaign")

    const dataSource = trackUrls.map((item: any, index: number) => ({
        key: index,
        ...item
    }))
    const handleDeleteTrackUrl = (id : number) => {  
        props.handleDelete(id)
    }

    const copyLink = (links:string) => {
        navigator.clipboard.writeText(links)
    }
    const columns: TableProps<DataType>['columns'] = [
        {
            title: t('name'),
            dataIndex: 'name',
            key: 'name',
            align: "center"
        },
        {
            title: t("campaignDetail.redirect-url"), 
            dataIndex: "redirectUrl",
            key: "redirectUrl",
            render: (text) => <Link className="link text-primary" href={text}>{text}</Link>,
            align: "center"
        },
        {
            title: t("campaignDetail.code-to-insert"),
            dataIndex: "codeToInsert",
            key: "redirectUrl",
            render: (text) => (
                <div className="w-full space-x-5 flex items-center justify-center">
                    <span className="text-neutral-900">{`{{trackUrl:${text}}}`} </span>
                    <CopyOutlined className="border-0 outline-0" onClick={() => copyLink(`{{trackUrl:${text}}}`)} />
                </div>),
            align: "center"
        },
        {
            title: t("campaignDetail.actions"),
            dataIndex: "",
            key: "actions",
            align: "center",
            render: (text, row) => (<Button
                className="text-primary decoration cursor-pointer"
                onClick={() => handleDeleteTrackUrl(row.id)}
                    icon={<BsTrash />}
             />
            ),
            
        }
    ];

    return (
        <div className="bg-white pl-3 py-2 mt-3">
            <div className='flex justify-between py-1 pr-2 ' style={{ width: "98%" }}>
                <h1 className="font-bold">Track Urls</h1>

                <CreateTrackUrlModal
                    triggerBtnClasseNames="border-0 outline-0 text-stone-600" 
                    onOk={props.handleCreate}
                />

            </div>
            {dataSource.length > 0 && <Table dataSource={dataSource} columns={columns} size="small" pagination={false} />}
        </div>)
}