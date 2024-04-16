"use client"
import React, { useEffect, useRef, useState } from "react";
import {
    ConfigProvider,
    Flex,
    Input,
    Space,
    Table,
} from "antd";
import type { TableProps, GetProp } from "antd";
import { variables } from "@/app";
import type {
    Key,
    SortOrder,
} from "antd/es/table/interface";
import { SearchOutlined } from "@ant-design/icons";
import fetchClient from "@/lib/fetch-client";
import { AnyObject } from "antd/es/_util/type";
import { CreateModal } from "./CreateModal";

type ColumnsType<T> = TableProps<T>["columns"];
type TablePaginationConfig = Exclude<
    GetProp<TableProps, "pagination">,
    boolean
>;
interface ITableRenderProps<T> {
    // data: readonly Record<string, any>[];
    columns: ColumnsType<T>;
    url: string,
    formCreateElement: React.ReactNode
    onSelected?: {
        handle?: (selecteds: T[]) => void,
        render?: () => React.ReactNode
    },
    excludeDataHasIds?: number[]
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


const TableRender = <T extends AnyObject,>({ columns, url, onSelected, formCreateElement, ...props }: ITableRenderProps<T>) => {
    const [checker, setChecker] = useState(true);
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(false);
    const [isSelectedRows, setIsSelectedRows] = useState(false);
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
        onChange: (selectedRowKeys: React.Key[], selectedRows: T[]) => {
            console.log(
                `selectedRowKeys: ${selectedRowKeys}`,
                "selectedRows: ",
                selectedRows
            );
            setIsSelectedRows(selectedRows.length > 0)
            onSelected?.handle && onSelected?.handle(selectedRows)

            console.log(selectedRows)
        },
    };


    useEffect(() => {
        fetchData();
    }, [JSON.stringify(tableParams)]);

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
                url: `${url}/all?page=${tableParams.pagination?.current}
				&pageSize=${tableParams.pagination?.pageSize}${sortQueries}`
            })

            console.log(respone)
            const results = respone.data
            let data = results.data.map((item: any) => ({
                ...item,
                key: item.id,
                fullname: `${item.firstname} ${item.lastname}`,
            }));
            if (props.excludeDataHasIds) {
                data = data.filter((item:any) => !props.excludeDataHasIds?.includes(item.id))
            }
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

                        {onSelected && isSelectedRows && onSelected?.render &&  onSelected.render()
                        }
                        <CreateModal afterCreated={() => fetchData()} createUrl={url} formElement={formCreateElement} />
                    </Flex>
                </div>

                <div className="mt-2">
                    <Table<T>
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
    )
};

export default TableRender;