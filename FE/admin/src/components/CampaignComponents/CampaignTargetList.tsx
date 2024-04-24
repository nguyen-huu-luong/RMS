import { Table, TableProps } from "antd";
import { AddTargetlistToCampaignModal } from "../Modals/AddTargetlistToCampaignModal";

interface DataType {
    key: number;
    id: number,
    name: string;
    count: number;
    actions?: any
}

export interface ICampaignTargetlistProps {
    campaignId: number | string
    targetLists: Array<any>,
    isEditmode: boolean,
    handleUpdateTargetlist: (ids: number[], action: string) => void,
}

export const CampaignTargetList: React.FC<ICampaignTargetlistProps> = ({ targetLists, isEditmode, ...props }) => {
    const handleAddTargetlists = async (values: DataType[]) => {
        console.log(values)
        const targetlistIds = values.map(item => item.id)
        props.handleUpdateTargetlist(targetlistIds, "add")
    }

    const handleDeleteTargetlist = (id: number) => {
        props.handleUpdateTargetlist([id], "remove")
    }

    const dataSource = targetLists.map((item: any, index: number) => ({
        key: index,
        id: item.id,
        name: item.name,
        count: item.count
    }))
    const columns: TableProps<DataType>['columns'] = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
            align: "center"
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            align: "center"
        },
        {
            title: "Count",
            dataIndex: "count",
            key: "count",
            render: () => "10",
            align: "center"
        },
        {
            title: "Actions",
            dataIndex: "actions",
            key: "actions",
            align: "center",
            render: (text, row) => (<p 
                className="text-primary decoration cursor-pointer"
                onClick={() => handleDeleteTargetlist(row.id)}>Remove
            </p>
            )
        }
    ];


    return (
        <div className="bg-white pl-3 py-2 mt-3">
            <div className='flex justify-between py-1 pr-2 ' style={{ width: "98%" }}>
                <h1 className="font-bold">Target lists</h1>

                <AddTargetlistToCampaignModal
                    onOk={(values: DataType[]) => { handleAddTargetlists(values) }}
                    excludeIds={ targetLists.map(item => item.id)}
                />

            </div>
            <Table dataSource={dataSource} columns={columns} size="small" pagination={false} />
        </div>)
}