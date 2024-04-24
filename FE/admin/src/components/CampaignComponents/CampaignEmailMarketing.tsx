import { EllipsisOutlined, IdcardFilled, PlusOutlined } from "@ant-design/icons"
import { Button, Dropdown, Form, MenuProps, Modal, Select, Table, TableProps } from "antd"
import { BiTrashAlt } from "react-icons/bi";
import TimeFormatter from "../TimeFormatter";
import { CreateEmailCampaigntModal } from "../Modals/CreateEmailCampaignModal";

interface DataType {
    key: number;
    id: number,
    name: string;
    status: string,
    startDate: string;
    actions?: any
}

export interface ICampaignEmailMarketing {
    campaignId: number | string
    emails: Array<any>,
    targetlists: Array<any>
    isEditmode: boolean,
    handleDelete: (ids: number) => Promise<void>,
    handleCreate: (values: any) => Promise<void>
}

export const CampaignMarketing: React.FC<ICampaignEmailMarketing> = ({ emails = [], targetlists = [], isEditmode, ...props }) => {
    const handleCreateEmails = async (values: any) => {
        await props.handleCreate(values)
    }

    const handleDeleteEmails = async (id: number) => {
        await props.handleDelete(id)
    }

    const dataSource = emails.map((item: any, index: number) => ({
        key: index,
        id: item.id,
        name: item.name,
        status: item.status,
        startDate: item.startDate,
    }))
    const columns: TableProps<DataType>['columns'] = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: "name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Start Date',
            dataIndex: 'startDate',
            key: 'startDate',
            render: (text) => <TimeFormatter time={text}/>
        },
        {
            title: "Actions",
            dataIndex: "actions",
            key: "actions",
            align: "center",
            render: (text, row) => (<p 
                className="text-primary decoration cursor-pointer"
                onClick={() => handleDeleteEmails(row.id)}>Remove
            </p>
            )
        }
    ];

    isEditmode && columns.push({
        title: "Actions",
        dataIndex: "actions",
        key: "actions",
        render: (text, row) => (
            isEditmode && (<p>
                <Button onClick={() => handleDeleteEmails(Number(row.id))} icon={<BiTrashAlt />} />
            </p>)
        )
    })

    return (
        <div className="bg-white pl-3 py-2 mt-3">
            <div className='flex justify-between py-1 pr-2 ' style={{ width: "98%" }}>
                <div>
                    <h1 className="font-bold">Email marketing</h1>
                </div>
                
                <div className="flex items-center space-x-2">
                    <CreateEmailCampaigntModal
                        triggerBtnClasseNames="border-0 outline-0 text-stone-600" 
                        onOk={handleCreateEmails} 
                        targetlists={targetlists}
                    />
                </div>

            </div>
            <Table dataSource={dataSource} columns={columns} size="small" pagination={false} />
        </div>)
}