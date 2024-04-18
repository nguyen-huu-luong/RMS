import { EllipsisOutlined, IdcardFilled, PlusOutlined } from "@ant-design/icons"
import { Button, Dropdown, Form, MenuProps, Modal, Select, Table, TableProps } from "antd"
import { title } from "process";
import { render } from "react-dom";
import { AddTargetlistToCampaignModal } from "../Modals/AddTargetlistToCampaignModal";
import fetchClient from "@/lib/fetch-client";
import { BiTrashAlt } from "react-icons/bi";

interface DataType {
    key: number;
    id: number,
    name: string;
    type: string,
    description: string;
    count: number;
    actions?: any
}

export interface ICampaignTargetlistProps {
    campaignId: number | string
    targetLists: Array<any>,
    isEditmode: boolean,
    handleAddTargetlist?: (ids: number[]) => void,
    handleDeleteTargetlists?: (ids: number[]) => void
}

export const CampaignTargetList: React.FC<ICampaignTargetlistProps> = ({ targetLists, isEditmode, ...props }) => {
    const handleAddTargetlists = async (values: DataType[]) => {
        console.log(values)
        const targetlistIds = values.map(item => item.id)
        props.handleAddTargetlist && props.handleAddTargetlist(targetlistIds)
    }
    
    const handleDeleteTargetlist = (id: number) => {
        props.handleDeleteTargetlists && props.handleDeleteTargetlists([id])
    }

    const dataSource = targetLists.map((item: any, index: number) => ({
        key: index,
        id: item.id,
        name: item.name,
        type: item.type,
        description: item.description,
        count: item.count
    }))
    const columns: TableProps<DataType>['columns'] = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: "Count",
            dataIndex: "count",
            key: "count"
        },
    ];

    const targetlistIds = targetLists.map(item => item.id);
    const actionItems: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <AddTargetlistToCampaignModal
                    onOk={(values: DataType[]) => { handleAddTargetlists(values) }}
                    excludeIds={targetlistIds}
                />
            ),
        },
    ];


    isEditmode && columns.push({
        title: "Actions",
        dataIndex: "actions",
        key: "actions",
        render: (text, row) => (
            isEditmode && (<p>
                <Button onClick={() => handleDeleteTargetlist(row.id)} icon={<BiTrashAlt />}/>
            </p>)
        )
    })


    return (
        <div className="bg-white pl-3 py-2 mt-3">
            <div className='flex justify-between py-1 pr-2 ' style={{ width: "98%" }}>
                <div>
                    <h1 className="font-bold">Target lists</h1>
                </div>

                <div>
                    <button onClick={() => {}}>
                        <Dropdown menu={{ items: actionItems }}>
                            <Button icon={<EllipsisOutlined />} />
                        </Dropdown>
                    </button>
                </div>
            </div>
            <Table dataSource={dataSource} columns={columns} size="small" pagination={false} />
        </div>)
}