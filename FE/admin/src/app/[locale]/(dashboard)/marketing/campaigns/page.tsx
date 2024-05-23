"use client";
import React, { useEffect, useRef, useState } from "react";
import {
    Button,
    ConfigProvider,
    Table,
    Input,
    Space,
    Select,
    Flex, Form, DatePicker, InputNumber,
    message,
    Popconfirm
} from "antd";
import type { TableProps, GetProp } from "antd";
import { variables } from "@/app";
import type {
    Key,
    SortOrder,
} from "antd/es/table/interface";
import { SearchOutlined } from "@ant-design/icons";
import fetchClient from "@/lib/fetch-client";
import { CreateCampaignModal } from "@/components/Modals/CreateCampaignModal";
import { useTranslations } from "next-intl";
import TimeFormatter from "@/components/TimeFormatter";

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

type ErrorType = {
    isError: boolean;
    title: string;
    message: string;
};

interface TableParams {
    pagination?: TablePaginationConfig;
    sorter?: SorterParams;
    filters?: Parameters<GetProp<TableProps, "onChange">>[1];
}

const Campaign: React.FC = () => {
    const [checker, setChecker] = useState(true);
    const [data, setData] = useState<DataType[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedRows, setSelectedRows] = useState<DataType[]>([]);
    const t: any = useTranslations("Marketing.Campaign")
    const [error, setError] = useState<ErrorType>({
        isError: false,
        message: "",
        title: "",
    });
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
            setSelectedRows(selectedRows)

            console.log(selectedRows)
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
            title: t("name"),
            dataIndex: "name",
            key: "name",
            render: (text, row) => <a style={{ color: "#4A58EC" }} href={`./campaigns/${row.id}`}>{text}</a>
        },
        {
            title: t('type'),
            dataIndex: "type",
            key: "type",
            render: (text) => t(text)
        },
        {
            title: t("status"),
            dataIndex: "status",
            key: "status",
            render: (text) => t(text)

        },
        {
            title: t("start-date"),
            dataIndex: "startDate",
            key: "startDte",
            render: (text) =>  <TimeFormatter time={text}/>
        },
        {
            title: t("end-date"),
            dataIndex: "endDate",
            key: "endDate",
            render: (text) =>  <TimeFormatter time={text}/>
        }
    ];

    const fetchData = async () => {
        setLoading(true);
        try {
            let filterQueriesStr = "";
            for (const key in tableParams.filters) {
                filterQueriesStr = `${filterQueriesStr}&${key}=${tableParams.filters[key]}`;
            }
            let sortQueries =
                tableParams.sorter?.field && tableParams.sorter?.order
                    ? `&sort=${tableParams.sorter?.field}&order=${tableParams.sorter?.order === "ascend" ? "asc" : "desc"
                    }`
                    : "";
            const respone = await fetchClient({
                url: `/campaigns/all?page=${tableParams.pagination?.current}
				&pageSize=${tableParams.pagination?.pageSize}${sortQueries}`
            })

            console.log(respone)
            const results = respone.data
            const data = results.data.map((item: any) => ({
                ...item,
                key: item.id,
                fullname: `${item.firstname} ${item.lastname}`,
            }));
            setData(data);
            setLoading(false);
            setTableParams({
                ...tableParams,
                pagination: {
                    ...tableParams.pagination,
                    pageSize: results.pageSize,
                    current: results.page,
                    total: results.totalCount,
                },
            });
        } catch (error: any) {
            setLoading(false)
            console.log(error);
            setError({
                isError: true,
                title: error?.name || "Something went wrong!",
                message: error?.message || "Unknown error",
            });
        }
    };

    useEffect(() => {
        fetchData();
    }, [JSON.stringify(tableParams)]);

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

    const handleDeleteCampaign = async () => {
        const ids = selectedRows.map(item => item.id);
        console.log(ids);

        try {
            const result = await fetchClient({ method: "DELETE", url: "/campaigns", body: ids })

            fetchData()
        } catch (error) {
            message.error(error as any)
        }
    }



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
                <div className="bg-white w-full py-2 px-3 rounded-md border flex justify-between">
                    <Space>
                        {
                            <Input
                                placeholder={`${t("search-placeholder")}`}
                                prefix={<SearchOutlined className="site-form-item-icon px-2 text-gray-500" />}
                                className="flex items-center"
                            />
                        }

                        {selectedRows.length > 0 &&
                            <Popconfirm title={t('are-you-sure')} onConfirm={handleDeleteCampaign}>
                                <Button danger>
                                    {`${t("delete-n-campaigns", { n: selectedRows.length })}`}
                                </Button>
                            </Popconfirm>
                        }
                    </Space>
                    <CreateCampaignModal afterCreated={() => fetchData()} />
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