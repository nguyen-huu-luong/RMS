"use client";
import React, { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import {
    Button,
    ConfigProvider,
    Table,
    Input,
    Space,
    Select,
    Flex, Modal, Form, DatePicker, InputNumber
} from "antd";
import type { TableProps, GetProp } from "antd";
import { variables } from "@/app";
import type {
    Key,
    SortOrder,
} from "antd/es/table/interface";
import Link from "next/link";
import { EllipsisOutlined, PlusCircleOutlined, SearchOutlined } from "@ant-design/icons";

type ColumnsType<T> = TableProps<T>["columns"];
type TablePaginationConfig = Exclude<
    GetProp<TableProps, "pagination">,
    boolean
>;

interface DataType {
    key?: React.Key;
    id: number;
    name: string;
    type: string;
    status: string;
    start_date: string;
    end_date: string;

}

type SorterParams = {
    field?: Key | readonly Key[];
    order?: SortOrder;
};

interface TableParams {
    pagination?: TablePaginationConfig;
    sorter?: SorterParams;
    filters?: Parameters<GetProp<TableProps, "onChange">>[1];
}

const Campaign: React.FC = () => {
    const temp_data: DataType[] = [
        { id: 1, name: "Introduce new dish", type: "Newsletter", status: "Planning", start_date: "2024-02-04", end_date: "2024-05-04" },
        { id: 2, name: "Promote campaign 2023", type: "Newsletter", status: "Active", start_date: "2024-02-04", end_date: "2024-05-04" },
        { id: 3, name: "Reactivation Campaign", type: "Email", status: "Planning", start_date: "2024-02-04", end_date: "2024-05-04" },
    ]
    const target_list: any[] = [
        {id: 1, name: "Lead"},
        {id: 2, name: "Customer"},
        {id: 3, name: "Subscriber"}
    ]

    const [form_campaign] = Form.useForm();

    const [checker, setChecker] = useState(true);
    const [data, setData] = useState<DataType[]>(temp_data);
    const [loading, setLoading] = useState(false);
    const [selectedCustomers, setSelectedCustomers] = useState<DataType[]>();
    const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {
            current: 1,
            pageSize: 10,
            total: 0,
        },
        filters: {},
        sorter: {
            field: "id",
            order: "ascend",
        },
    });

    // rowSelection object indicates the need for row selection
    const rowSelection = {
        onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
            console.log(
                `selectedRowKeys: ${selectedRowKeys}`,
                "selectedRows: ",
                selectedRows
            );
            setSelectedCustomers(selectedRows)

            console.log(selectedCustomers)
        },
        getCheckboxProps: (record: DataType) => ({

        }),
    };
    const columns: ColumnsType<DataType> = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            render: (text, row) => <a style={{ color: "#4A58EC" }} href={`./campaigns/${row.id}`}>{text}</a>
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
        },
        {
            title: "Sart date",
            dataIndex: "start_date",
            key: "start_date",
        },
        {
            title: "End date",
            dataIndex: "end_date",
            key: "end_date",
        }
    ];

    const handleTableChange: TableProps["onChange"] = (
        pagination,
        filters,
        sorter,
        extra
    ) => {
        console.log(pagination, filters, sorter, extra);
        if (Array.isArray(sorter)) {
            const firstSorter = sorter[0];
            console.log("Sorter is array");
            setTableParams(prev => ({
                ...prev,
                pagination,
                filters,
                sorter: {
                    field: firstSorter?.field || prev.sorter?.field,
                    order: firstSorter?.order || prev.sorter?.order,
                },
            }));
        } else {
            console.log("Sorter is not an array");

            setTableParams(prev => ({
                pagination,
                filters,
                sorter: {
                    field: sorter?.field || prev.sorter?.field,
                    order: sorter?.order || prev.sorter?.order,
                },
            }));
        }

        setChecker(prevState => !prevState)
    };

    const handleCreateCampaign = (values: any) => {
        console.log(values)
        handleCancel()
    } 

    const [open, setOpen] = useState(false);

    const showModal = () => {
        form_campaign.resetFields()
        setOpen(true);
    };

    const handleCancel = () => {
        setOpen(false);
    };



    return (
        <ConfigProvider
            theme={{
                components: {
                    Table: {
                        headerBg: variables.backgroundSecondaryColor,
                        footerBg: "#fff",
                    },
                    Form: {
                        itemMarginBottom: 16,
                    },
                    Input: {
                        addonBg: "#F6FAFD",
                        colorFillTertiary: "#F6FAFD",
                    },
                    InputNumber: {
                        addonBg: "#F6FAFD",
                        colorFillTertiary: "#F6FAFD",
                    },
                    DatePicker: {
                        colorFillTertiary: "#F6FAFD",
                    },

                    Select: {
                        colorFillTertiary: "#F6FAFD",
                    },
                },
            }}
        >

            <div className="w-full h-auto flex-col gap-3">
                <div className="bg-white w-full py-2 px-3 rounded-md border">
                    <Flex>
                        {
                            <Space>
                                <Input
                                    placeholder="Enter keywork to search...."
                                    prefix={<SearchOutlined className="site-form-item-icon px-2 text-gray-500" />}
                                    className="flex items-center"
                                />
                            </Space>
                        }

                        <Space className="ms-auto">
                            <Button icon={<PlusCircleOutlined />} onClick={showModal}>
                                New
                            </Button>
                            <Button icon={<EllipsisOutlined />} />

                        </Space>
                    </Flex>

                    <Modal title="Add new campaign" footer={null} open={open} onCancel={handleCancel}>
                        <Form form={form_campaign} name="form_item_path" variant="filled" layout="vertical" style={{ maxWidth: 1000 }} onFinish={handleCreateCampaign}>

                            <div className="flex space-x-2">
                                <div className='w-full'>
                                    <Form.Item label="Name" name="name" required rules={[{ required: true, message: 'Please input the campaign name !' }]}>
                                        <Input placeholder='Campaign name' />
                                    </Form.Item>
                                </div>
                                <div className='w-full'>
                                    <Form.Item label="Status" name="status" required rules={[{ required: true, message: 'Please select the  campaign status !' }]}>
                                        <Select>
                                            <Select.Option value="planning">Planning</Select.Option>
                                            <Select.Option value="active">Active</Select.Option>
                                            <Select.Option value="inactive">Inactive</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </div>
                            </div>

                            <div className="flex space-x-2">
                                <div className='w-full'>
                                    <Form.Item label="Type" name="type" required rules={[{ required: true, message: 'Please input the campaign type !' }]}>
                                        <Select>
                                            <Select.Option value="newsletter">Newsletter</Select.Option>
                                            <Select.Option value="email">Email</Select.Option>
                                            <Select.Option value="welcome">Welcome</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </div>
                                <div className='w-full'>
                                    <Form.Item label="Start date" name="start_date" required rules={[{ required: true, message: 'Please input the start date !' }]}>
                                        <DatePicker className='w-full' />
                                    </Form.Item>
                                </div>
                            </div>

                            <div className="flex space-x-2">
                                <div className='w-full'>
                                    <Form.Item label="Budget" name="budget" >
                                       <InputNumber min={10000} className='w-full' />
                                    </Form.Item>
                                </div>
                                <div className='w-full'>
                                    <Form.Item label="End date" name="end_date" required rules={[{ required: true, message: 'Please input the end date !' }]}>
                                        <DatePicker className='w-full' />
                                    </Form.Item>
                                </div>
                            </div>


                            <div className="flex space-x-2">
                                <div className='w-full'>
                                    <Form.Item label="Target lists" name="target_list" rules={[{ required: true, message: 'Please choose the target item !' }]}>
                                        <Select mode="multiple" allowClear>
                                            {
                                                target_list.map((item) => <Select.Option value={item.id}>{item.name}</Select.Option>)
                                            }
                                        </Select>
                                    </Form.Item>
                                </div>

                                <div className='w-full'>
                                    <Form.Item label="Frequently" name="frequently" rules={[{ required: true, message: 'Please choose the frequently !' }]}>
                                    <Select>
                                            <Select.Option value="every_day">Every day</Select.Option>
                                            <Select.Option value="every_week">Every week</Select.Option>
                                            <Select.Option value="every_month">Every month</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </div>
                            </div>

                            <Form.Item>
                                <div className='flex justify-end space-x-2'>
                                    <Button type="default" htmlType="reset" onClick={handleCancel}>
                                        Cancel
                                    </Button>
                                    <Button type="primary" htmlType="submit" style={{ backgroundColor: "#4A58EC", color: "white" }}>
                                        Save
                                    </Button>
                                </div>
                            </Form.Item>
                        </Form>
                    </Modal>
                </div>

                <div className="mt-2">
                    <Table
                        rowSelection={{
                            ...rowSelection,
                        }}
                        columns={columns}
                        pagination={{
                            className: "bg-white rounded px-4 py-2",
                            showTotal: (total: number) => `Total ${total} items`,
                            position: ["bottomCenter", "bottomRight"],
                            showSizeChanger: true,
                            showQuickJumper: true,
                            total: tableParams.pagination?.total,
                            pageSize: tableParams.pagination?.pageSize,
                        }}
                        loading={loading}
                        dataSource={data}
                        onChange={handleTableChange}
                    />
                </div>
            </div>
        </ConfigProvider>
    );
};

export default Campaign;