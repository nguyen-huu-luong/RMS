import { PlusOutlined } from "@ant-design/icons"
import { Button, Form, Modal, Select, Table, TableProps } from "antd"
import { title } from "process";
import { render } from "react-dom";

export interface ICampaignMarketingProps {
    emails: [],
    isEditmode: boolean,


}
{/* <Modal title="Add new target customer" footer={null} open={target_list} onCancel={handleCloseTargetForm}>
    <Form form={form_target_list} name="form_item_path" variant="filled" layout="vertical" style={{ maxWidth: 1000 }} onFinish={handleAddTagert}>
        <div className="space-x-2">
            <div className='flex align-middle relative'>
                <div className='relative' style={{ width: "100px" }}>
                    <p className='absolute' style={{ top: "5%" }}>Target name:</p>
                </div>
                <div style={{ width: "90%" }}>
                    <Form.Item
                        name="target_name"
                        rules={[{ required: true, message: 'Please choose target customer !' }]}>
                        <Select mode="multiple" allowClear>
                            {
                                targetlistInfo.map((item: any) => <Select.Option value={item.id}>{item.name}</Select.Option>)
                            }
                        </Select>
                    </Form.Item>
                </div>
            </div>
        </div>

        <Form.Item>
            <div className='flex justify-end space-x-2'>
                <Button type="default" htmlType="reset" onClick={handleCloseTargetForm}>
                    Cancel
                </Button>
                <Button type="primary" htmlType="submit" style={{ backgroundColor: "#4A58EC", color: "white" }}>
                    Save
                </Button>
            </div>
        </Form.Item>
    </Form>
</Modal> */}

interface DataType {
    key: number;
    status: string;
    date_start: string,
}
export const CampaignMarketing: React.FC<ICampaignMarketingProps> = ({ emails, isEditmode }) => {

    const handleAddTargetList = () => {

    }

    return (
        <div className="bg-white pl-3 py-2 mt-3">
            <div className='flex justify-between py-1 pr-2 ' style={{ width: "98%" }}>
                <div>
                    <h1 className="font-bold">Email marketings</h1>
                </div>
                <div>
                    <button onClick={() => {}}>
                        <PlusOutlined />
                    </button>
                </div>
            </div>
            <div className="mt-3">
                <div className="mt-2 grid grid-cols-4 gap-2">
                    <h5 style={{ color: "#666666" }}>Name</h5>
                    <h5 style={{ color: "#666666" }}>Status</h5>
                    <h5 style={{ color: "#666666" }}>Date start</h5>
                    <h5 style={{ color: "#666666" }}>Email template</h5>
                    {
                        emails.map((item: any) => {
                            return (
                                <>
                                    <p ><a style={{ fontSize: "13px", color: "#4A58EC" }}>{item.name}</a></p>
                                    <p style={{ fontSize: "13px" }}>{item.status}</p>
                                    <p style={{ fontSize: "13px" }}>{item.date_start}</p>
                                    <p style={{ fontSize: "13px" }}><a style={{ fontSize: "13px", color: "#4A58EC" }}>{item.email_template}</a></p>
                                </>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

