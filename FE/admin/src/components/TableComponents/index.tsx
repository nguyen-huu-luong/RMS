"use client"
import React, { useEffect, useState } from "react";
import {
    Alert,
    Button,
    ConfigProvider,
    Dropdown,
    Form,
    Input,
    Select,
    Space,
    Table,
    message,
} from "antd";
import type { TableProps, GetProp, SelectProps } from "antd";
import { variables } from "@/app";
import type {
    Key,
    SortOrder,
} from "antd/es/table/interface";
import {SearchOutlined, SortAscendingOutlined, SortDescendingOutlined } from "@ant-design/icons";
import fetchClient from "@/lib/fetch-client";
import { AnyObject } from "antd/es/_util/type";
import { useFormatter } from "next-intl";
import { FilterItem } from "./FilterItems";
import { FaEllipsisV } from "react-icons/fa";
import { AxiosError } from "axios";
import { useLocale, useTranslations } from "next-intl";

type ColumnsType<T> = TableProps<T>["columns"];
type TablePaginationConfig = Exclude<
    GetProp<TableProps, "pagination">,
    boolean
>;
interface ITableRenderProps<T> {
    // data: readonly Record<string, any>[];
    data?: T[],  
    setData?: React.Dispatch<React.SetStateAction<T[]>>,
    columns: ColumnsType<T>;
    url: string,
    queryStr?: string,
    createModal?: React.ReactNode
    onSelected?: {
        handle?: (selecteds: T[]) => void,
        render?: () => React.ReactNode
    },
    reload?: boolean,
    filterItems?: FilterItemType[]
    excludeDataHasIds?: number[],
    createModalTitle? : string,
    rowSelection?: boolean
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
    queryString?: string
}

export type FilterItemType = {
    key: string,
    type: "input" | "select" | "date",
    fieldName: string,
    title: string,
    options?: SelectProps['options']
}

const TableRender = <T extends AnyObject,>({ columns, url, onSelected, ...props }: ITableRenderProps<T>) => {
    const t_general: any = useTranslations("General")
    const [checker, setChecker] = useState(true);
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(false);
    const [isSelectedRows, setIsSelectedRows] = useState(false);
    const [filterItems, setFilterItems] = useState<FilterItemType[]>([])
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
        queryString: "",
        sorter: {
            field: "id",
            order: "ascend",
        },
    });

    const format = useFormatter();

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
    }, [JSON.stringify(tableParams), props.reload]);

    const fetchData = async () => {
        setLoading(true);
        try {
            let filterQueriesStr = tableParams.queryString
            let sortQueries =
                tableParams.sorter?.field && tableParams.sorter?.order
                    ? `&sort=${tableParams.sorter?.field}&order=${tableParams.sorter?.order === "ascend" ? "asc" : "desc"
                    }`
                    : "";
            const respone = await fetchClient({
                url: `${url}/all?page=${tableParams.pagination?.current}
				&pageSize=${tableParams.pagination?.pageSize}${sortQueries}${filterQueriesStr}${props.queryStr ? `&${props.queryStr}`: ""}`
            })

            console.log(respone)
            const results = respone.data
            let data = results.data.map((item: any) => ({
                ...item,
                key: item.id,
                fullname: `${item.firstname} ${item.lastname}`,
            }));
            if (props.excludeDataHasIds) {
                data = data.filter((item: any) => !props.excludeDataHasIds?.includes(item.id))
            }
            props.setData ? props.setData(data) : setData(data);
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
            if (error instanceof AxiosError && error.response) {
                if(error.status === 404) {
                    message.error("Vui lòng thao tác chậm lại!")
                } else {
                    console.log(error);
                    setError({
                        isError: true,
                        title: (error.response && error.response.data.name) || error?.name || "Unknown error",
                        message: (error.response && error.response.data.message) || error?.message || "Something went wrong!",
                    });
                }
            }
        }
    };

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
                ...prev,
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
        setChecker(prevState => !prevState)
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
        setChecker(prevState => !prevState)
    };

    const handleApplyFilter = (values: any) => {
        console.log(values)
        let queryStr = ""
        for (let key of Object.keys(values)) {
            if (["startsWith", "endsWith", "like", "contains"].includes(values[key].expr)) {
                queryStr = values[key].value ? `${queryStr}&${key}_${values[key].expr}=${values[key].value}` : queryStr
            } else if (["today", "last7day", "currentMonth"].includes(values[key].expr)) {
                const timeQuery = timeConvert(values[key].expr)
                queryStr = `${queryStr}&${key}_gt=${timeQuery}`
            } else if (["lastXDays"].includes(values[key].expr)) {
                const timeQuery = timeConvert(values[key].expr, Number(values[key].value))
                queryStr = values[key].value ? `${queryStr}&${key}_gt=${timeQuery}` : queryStr
            } else if (["before", "after"].includes(values[key].expr)) {
                queryStr = values[key].value ? `${queryStr}&${key}_gt=${values[key].value.toString()}` : queryStr
            } else if (values[key].expr === "in") {
                let str = ""
                if (values[key].value) {
                    let array: string[] = values[key].value
                    for (let i = 0; i < array.length; i++) {
                        str += array[i]
                        if (i !== (array.length - 1)) {
                            str += ";"
                        }   
                    }
                    queryStr = `${queryStr}&${key}_in=${str}`

                }
            }
        }
        setTableParams(prev => ({
            ...prev,
            queryString: queryStr
        }))
    }

    const timeConvert = (type: string, numDays?: number) => {
        const firstTimeOfToday = new Date();
        firstTimeOfToday.setHours(0, 0, 0, 0);

        // Get the first time of the last 7 days
        const last7Days = new Date();
        last7Days.setDate(last7Days.getDate() - 7);
        last7Days.setHours(0, 0, 0, 0);

        // Get the first time of the current month
        const firstTimeOfCurrentMonth = new Date();
        firstTimeOfCurrentMonth.setDate(1);
        firstTimeOfCurrentMonth.setHours(0, 0, 0, 0);
        const formatter = (dateTime: Date) => format.dateTime(dateTime, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric', minute: 'numeric'
        })
        if (type === "today") {
            return formatter(firstTimeOfToday);
        } else if (type === "last7day") {
            return formatter(last7Days)
        } else if (type === "currentMonth") {
            return formatter(firstTimeOfCurrentMonth)
        } else if (type === "lastXDays" && numDays && numDays > 0) {
            const lastXDays = new Date()
            lastXDays.setDate(last7Days.getDate() - numDays);
            lastXDays.setHours(0, 0, 0, 0);
            return formatter(lastXDays)
        }
    }

    const handleAddFilterItem = (key: string) => {
        if (props.filterItems) {
            const item = props.filterItems.find(item => item.key === key)
            if (item) {
                setFilterItems(prev => [...prev, item])
            }
        }
    }

    const handleDeleteFilteritem = (key: string) => {
        if (props.filterItems) {
            // console.log(filterItems, key)
            // filterItems.filter(item => item.key !== key)
            // console.log(filterItems, key)
            const newFilterItems = filterItems.filter(item => item.key !== key)  ;
            setFilterItems(prev => newFilterItems)
            if (newFilterItems.length === 0) {
                setTableParams(prev  => ({...prev, queryString: ""}))
            }

        }
    }

    const handleClearFilter = () => {
        setFilterItems([])
        setTableParams(prev  => ({...prev, queryString: ""}))
    }

    const remainingFilterItems = props.filterItems ? props.filterItems.filter((item) => {
        const keys = filterItems.map(item => item.key);
        return !keys.includes(item.key)
    }) : []

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
                    <div className="flex">
                        <div className="flex-1 flex space-x-2 items-center">
                            <Input
                                placeholder="Enter keywork to search....    "
                                prefix={<SearchOutlined className="site-form-item-icon px-2 text-gray-500" />}
                                className="flex items-center w-2/5"
                                style={{
                                    width: "40%"
                                }}
                            />
                            {props.filterItems &&
                                <Dropdown
                                    disabled={remainingFilterItems.length === 0}
                                    menu={{
                                        items: [
                                            {
                                                key: "1",
                                                type: 'group',
                                                label: "Filter",
                                                children: remainingFilterItems.map((item) => ({
                                                    label: item.title,
                                                    key: `1-${item.key}`,
                                                    onClick: (menuInfo) => {
                                                        handleAddFilterItem(menuInfo.key.split("-")[1])
                                                    }
                                                }))
                                            }
                                        ]
                                    }}
                                >
                                    <FaEllipsisV />
                                </Dropdown>}
                        </div>

                        {props.createModal && props.createModal}
                    </div>

                </div>
                {onSelected && isSelectedRows && onSelected?.render && onSelected.render()}
                <div className="border bg-white shadow p-3 my-2 rounded">
                    <div className="flex items-center gap-2">
                        <p>{t_general("sort")}: </p>
                        <Select
                            // style={{ width: '20%' }}
                            placeholder="Columns"
                            value={tableParams.sorter?.field?.toString() || "id"}
                            onChange={handleSortFieldChange}
                            options={columns && columns.map((item) => ({
                                value: item.key,
                                label: item.title,
                            }))}
                            style={{minWidth: 120}}
                        />

                        <p>{t_general("order")}: </p>

                        <Button onClick={handleToggleSorter} icon={tableParams.sorter?.order === "ascend" ? (
                            <SortAscendingOutlined />
                        ) : (
                            <SortDescendingOutlined />
                        )} />
                    </div>

                    {props.filterItems && <Form onFinish={handleApplyFilter}>
                        <div className="flex justify-start gap-2 flex-wrap">
                            {
                                filterItems.map((item) => (
                                    <FilterItem 
                                        type={item.type}
                                        fieldName={item.fieldName} 
                                        key={item.key} 
                                        title={item.title} 
                                        options={item.options}
                                        onDelete={() => handleDeleteFilteritem(item.key)} 
                                    />
                                ))
                            }
                        </div>

                        {filterItems.length > 0 && <Form.Item>
                            <Space className="mt-2">
                                <Button htmlType="submit">{t_general('apply')}</Button>
                                <Button onClick={handleClearFilter}>{t_general('clear_filter')}</Button>
                            </Space>
                        </Form.Item>}
                    </Form>}
                </div>


                <div className="mt-2">
                    <Table<T>
                        rowSelection={(!(typeof props.rowSelection === 'boolean') || props.rowSelection) ? {
                            ...rowSelection,
                        }: undefined}
                        columns={columns}
                        pagination={{
                            className: "bg-white rounded px-4 py-2",
                            style: {
                                padding: "8px 16px"
                            },
                            showTotal: (total: number) => `${t_general("total")} ${total} ${t_general("item")}`,
                            position: ["bottomCenter", "bottomRight"],
                            showSizeChanger: true,
                            showQuickJumper: true,
                            total: tableParams.pagination?.total,
                            pageSize: tableParams.pagination?.pageSize,
                        }}
                        loading={loading}
                        dataSource={props.data ? props.data : data}
                        onChange={handleTableChange}
                    />
                </div>
            </div>
        </ConfigProvider >
    )
};

export default TableRender;