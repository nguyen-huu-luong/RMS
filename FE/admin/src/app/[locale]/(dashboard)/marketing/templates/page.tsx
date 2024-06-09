"use client";
import React, { useEffect, useRef, useState } from "react";
import {
    Alert,
    Button,
    ConfigProvider,
    Popconfirm,
    Select,
    Space,
    Table,
    Tooltip,
    message,
} from "antd";
import type { TableProps, GetProp } from "antd";
import { variables } from "@/app";
import type {
    Key,
    SortOrder,
} from "antd/es/table/interface";
import { EditFilled, PlusCircleFilled, SortAscendingOutlined, SortDescendingOutlined } from "@ant-design/icons";
import TimeFormatter from "@/components/TimeFormatter";
import { BiTrash } from "react-icons/bi";
import fetchClient from "@/lib/fetch-client";
import { useTranslations } from "next-intl";
import LinkWithRef from "next-intl/link";

type ColumnsType<T> = TableProps<T>["columns"];
type TablePaginationConfig = Exclude<
    GetProp<TableProps, "pagination">,
    boolean
>;

interface DataType {
    key: React.Key;
    id: number;
    name: string;
    type: string;
    createdAt: string;
    updatedAt: Date;
}

type ErrorType = {
    isError: boolean;
    title: string;
    message: string;
};

type SorterParams = {
    field?: Key | readonly Key[];
    order?: SortOrder;
};

interface TableParams {
    pagination?: TablePaginationConfig;
    sorter?: SorterParams;
    filters?: Parameters<GetProp<TableProps, "onChange">>[1];
}

const EmailTemplate: React.FC = () => {
    const [data, setData] = useState<DataType[]>();
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
    const [error, setError] = useState<ErrorType>({
        isError: false,
        message: "",
        title: "",
    });

    const t: any = useTranslations("Marketing.MessageTemplate")
    const t_general: any = useTranslations("General")

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
    };

    const handleDelete = async (id: number) => {
        try {
            const response = await fetchClient({ method: "DELETE", url: `/message-templates/${id}` });
            message.success(t('delete-success-msg'));
            fetchData()
        } catch (error) {
            console.error('Error delete email  Email template:', error);
            message.error(t('delete-faild-msg'));
        }
    }
    const columns: ColumnsType<DataType> = [
        { title: "ID", dataIndex: "id", key: "id" },
        {
            title: t("name"), dataIndex: "name", key: "name", render: (text, record, index) => (
                <LinkWithRef href={`templates/${record.id}/`}>{text}</LinkWithRef>
            )
        },
        { title: t("description"), dataIndex: "description", key: "description" },
        {
            title: t("created-at"), dataIndex: "createdAt", key: "createdAt", render: (text) => (
                <TimeFormatter time={text} />
            )
        },

        { title: t("updated-at"), dataIndex: "updatedAt", key: "updatedAt", render: (text) => <TimeFormatter time={text} /> },
        {
            title: t("action"),
            render: (text, record, index) => (
                <Space>
                    <Tooltip title={t_general("update")}>
                        <LinkWithRef href={`templates/${record["id"]}`}>
                            <Button type="primary" className="bg-primary" icon={<EditFilled />} />
                        </LinkWithRef>
                    </Tooltip>
                    <Tooltip title={t_general("delete")}>
                        <Popconfirm
                            title={(t("delele-confirm-title"))}
                            description={t("delete-confirm-msg")}
                            onConfirm={() => handleDelete(record.id)}
                            okText={t_general("yes")}
                            cancelText={t_general("no")}
                        >
                            <Button danger icon={<BiTrash />} />
                        </Popconfirm>
                    </Tooltip>
                </Space>
            )
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
                url: `/message-templates/all?page=${tableParams.pagination?.current}&pageSize=${tableParams.pagination?.pageSize}${sortQueries}`
            })
            const results = respone.data;
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
            console.log(error);
            setLoading(false)
            setError({
                isError: true,
                title: error?.name || t_general("something-wrong"),
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
        if (Array.isArray(sorter)) {
            const firstSorter = sorter[0];
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
    };
    const handleCloseError = () => {
        console.log(error);
        setError({ isError: false, title: "", message: "" });
    };

    const handleSortFieldChange = (key: string) => {
        console.log(key, tableParams);
        setTableParams((prev) => ({
            ...prev,
            sorter: { ...prev.sorter, field: key },
        }));
        console.log(tableParams);
    };

    const handleToggleSorter = () => {
        setTableParams((prev) => ({
            ...prev,
            sorter: {
                ...prev.sorter,
                order: prev.sorter?.order === "ascend" ? "descend" : "ascend",
            },
        }));
    };

    return (
        <ConfigProvider
            theme={{
                components: {
                    Table: {
                        headerBg: variables.backgroundSecondaryColor,
                        footerBg: "#fff",
                    },
                },
            }}
        >
            <Space direction="vertical" className="w-full">
                {error.isError && (
                    <Alert
                        message={error.title}
                        description={error.message}
                        type="error"
                        showIcon
                        onClose={handleCloseError}
                        closeIcon
                    />
                )}
                <div className="border bg-white shadow px-3 py-2 flex items-center">
                    <div className="flex items-center gap-2">
                        <p>Sort by: </p>
                        <Select
                            // style={{ width: '20%' }}
                            placeholder="Columns"
                            value={tableParams.sorter?.field?.toString() || "id"}
                            onChange={handleSortFieldChange}
                            options={columns.map((item) => ({
                                value: item.key,
                                label: item.title,
                            }))}
                        />

                        <p>{t_general("order")}:</p>

                        <Button onClick={handleToggleSorter} icon={tableParams.sorter?.order === "ascend" ? (
                            <SortAscendingOutlined />
                        ) : (
                            <SortDescendingOutlined />
                        )} />
                    </div>
                    <LinkWithRef type="link" href="/marketing/templates/new" className="ms-auto" >
                        {t_general("new")}
                    </LinkWithRef>
                </div>
                <Table
                    rowSelection={{
                        ...rowSelection,
                    }}
                    columns={columns}
                    pagination={{
                        className: "bg-white rounded px-4 py-2",
                        showTotal: (total: number) => t_general("total-n-items", {n: total}),
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
            </Space>
        </ConfigProvider>
    );
};

export default EmailTemplate;