"use client";
import React, { useEffect, useRef, useState } from "react";
import {
    Button,
    ConfigProvider,
    InputRef,
    Table,
    Input,
    Space,
    Select,
    Alert,
} from "antd";
import { TableProps, GetProp, TableColumnType } from "antd";
import { variables } from "@/app";
import {
    SearchOutlined,
    SortAscendingOutlined,
    SortDescendingOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import type {
    FilterConfirmProps,
    Key,
    SortOrder,
} from "antd/es/table/interface";
import { useRouter } from "next-intl/client";
import { createStyles } from "antd-style";
import moment from "moment";
import fetchClient from "@/lib/fetch-client";
import { VoucherActionBar } from "@/components/Voucher/VoucherActionBar";
import { EditVoucherForm } from "@/components/Voucher/EditVoucherForm";
import { AssignVoucherForm } from "@/components/Voucher/AssignVoucher";
import { useTranslations } from "next-intl";

const useStyle = createStyles(({ token }) => ({
    "my-modal-body": {},
    "my-modal-mask": {},
    "my-modal-header": {},
    "my-modal-footer": {},
    "my-modal-content": {},
}));
type ColumnsType<T> = TableProps<T>["columns"];
type TablePaginationConfig = Exclude<
    GetProp<TableProps, "pagination">,
    boolean
>;
interface DataType {
    key: React.Key;
    id: number;
    name: string;
    description: string;
    promo_code: string;
    type: string;
    amount: number;
    maximum_reduce: number;
    quantity: number;
    minimum_paid: number;
    begin_date: Date;
    end_date: Date;
    can_redeem: boolean;
    redeemedNumber: number;
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

type DataIndex = keyof DataType;

const Voucher: React.FC = () => {
    const router = useRouter();
    const [checker, setChecker] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef<InputRef>(null);
    const [data, setData] = useState<DataType[]>();
    const [loading, setLoading] = useState(false);
    const [selectedVouchers, setSelectedVouchers] = useState<DataType[]>();
    const [open, setOpen] = useState(false);
    const [voucher, setVoucher] = useState<number>(0);
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

    const t = useTranslations("Voucher");
    const t_general = useTranslations("General");

    const fetchData = async () => {
        setLoading(true);
        try {
            let filterQueriesStr = "";
            for (const key in tableParams.filters) {
                filterQueriesStr = `${filterQueriesStr}&${key}=${tableParams.filters[key]}`;
            }
            let sortQueries =
                tableParams.sorter?.field && tableParams.sorter?.order
                    ? `&sort=${tableParams.sorter?.field}&order=${
                          tableParams.sorter?.order === "ascend"
                              ? "asc"
                              : "desc"
                      }`
                    : "";

            const results = await fetchClient({
                url: `/vouchers/all?page=${tableParams.pagination?.current}
            &pageSize=${tableParams.pagination?.pageSize}${sortQueries}`,
                data_return: true,
            });
            const data = results.data.map((item: any) => ({
                ...item,
                key: item.id,
            }));
            setData(data);
            setLoading(false);
            setTableParams({
                ...tableParams,
                pagination: {
                    ...tableParams.pagination,
                    pageSize: results.pageSize,
                    current: parseInt(results.page, 10),
                    total: results.totalCount,
                },
            });
        } catch (error: any) {
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

    const handleSearch = (
        selectedKeys: string[],
        confirm: (param?: FilterConfirmProps) => void,
        dataIndex: DataIndex
    ) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleUpdate = async (id: number) => {
        setVoucher(id);
        setOpen(true);
    };

    const handleReset = (clearFilters: () => void) => {
        clearFilters();
        setSearchText("");
    };
    const getColumnSearchProps = (
        dataIndex: DataIndex
    ): TableColumnType<DataType> => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
            close,
        }: any) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) =>
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                    }
                    onPressEnter={() =>
                        handleSearch(
                            selectedKeys as string[],
                            confirm,
                            dataIndex
                        )
                    }
                    style={{ marginBottom: 8, display: "block" }}
                />
                <Space>
                    <Button
                        type='primary'
                        onClick={() =>
                            handleSearch(
                                selectedKeys as string[],
                                confirm,
                                dataIndex
                            )
                        }
                        icon={<SearchOutlined />}
                        size='small'
                        style={{ width: 90 }}
                    >
                        {t_general("search")}
                    </Button>
                    <Button
                        onClick={() =>
                            clearFilters && handleReset(clearFilters)
                        }
                        size='small'
                        style={{ width: 90 }}
                    >
                        {t_general("reset")}
                    </Button>
                    <Button
                        type='link'
                        size='small'
                        onClick={() => {
                            confirm({ closeDropdown: false });
                            setSearchText((selectedKeys as string[])[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        {t_general("filter")}
                    </Button>
                    <Button
                        type='link'
                        size='small'
                        onClick={() => {
                            close();
                        }}
                    >
                        {t_general("close")}
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined
                style={{ color: filtered ? "#1677ff" : undefined }}
            />
        ),
        onFilter: (value: any, record: any) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes((value as string).toLowerCase()),
        onFilterDropdownOpenChange: (visible: any) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text: string) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ""}
                />
            ) : (
                text
            ),
    });

    const rowSelection = {
        onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
            setSelectedVouchers(selectedRows);
        },
        getCheckboxProps: (record: DataType) => ({
            disabled: record.name === "",
            name: record.name,
        }),
    };

    const handleAssignModal = (id: number) => {
        setVoucher(id);
        setOpen(true);
    };

    const columns: ColumnsType<DataType> = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            render: (text, record) => (
                <span
                    className='text-blue-600 cursor-pointer'
                    onClick={() =>
                        router.push(`vouchers/${record.id.toString()}`)
                    }
                >
                    {text}
                </span>
            ),
        },
        {
            title: t('name'),
            dataIndex: "name",
            key: "name",
        },
        {
            title: t('description'),
            dataIndex: "description",
            key: "description",
        },
        {
            title: t('promo-code'),
            dataIndex: "promo_code",
            key: "promo_code",
        },
        {
            title: t('type'),
            dataIndex: "type",
            key: "type",
        },
        {
            title: t('amount'),
            dataIndex: "amount",
            key: "amount",
        },
        {
            title: t('maximum'),
            dataIndex: "maximum_reduce",
            key: "maximum_reduce",
        },
        {
            title: t('quantity'),
            dataIndex: "quantity",
            key: "quantity",
            render: (text, record) => (
                <span>
                    {record.redeemedNumber}/{text}
                </span>
            ),
            ...getColumnSearchProps("quantity"),
        },
        {
            title: t('minimum-paid'),
            dataIndex: "minimum_paid",
            key: "minimum_paid",
            ...getColumnSearchProps("minimum_paid"),
        },
        {
            title: t('begin'),
            dataIndex: "begin_date",
            key: "begin_date",
            render: (text, record) => {
                return <>{moment(text).format("MMMM Do YYYY")}</>;
            },
            ...getColumnSearchProps("begin_date"),
        },
        {
            title: t('end'),
            dataIndex: "end_date",
            key: "end_date",
            render: (text, record) => {
                return <>{moment(text).format("MMMM Do YYYY")}</>;
            },
            ...getColumnSearchProps("begin_date"),
        },
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
            setTableParams((prev) => ({
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
            setTableParams((prev) => ({
                pagination,
                filters,
                sorter: {
                    field: sorter?.field || prev.sorter?.field,
                    order: sorter?.order || prev.sorter?.order,
                },
            }));
        }

        setChecker((prevState) => !prevState);
    };

    const handleSortFieldChange = (key: string) => {
        setTableParams((prev) => ({
            ...prev,
            sorter: { ...prev.sorter, field: key },
        }));
        setChecker((prevState) => !prevState);
    };

    const handleToggleSorter = () => {
        setTableParams((prev) => ({
            ...prev,
            sorter: {
                ...prev.sorter,
                order: prev.sorter?.order === "ascend" ? "descend" : "ascend",
            },
        }));
        setChecker((prevState) => !prevState);
    };

    const handleClearFilter = () => {
        setTableParams((prev: any) => ({
            ...prev,
            filters: {},
        }));
    };

    const handleClearAll = () => {
        setTableParams((prev: any) => ({
            ...prev,
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
        }));
        setSearchText("");
        setSearchedColumn("");
    };

    const handleCloseError = () => {
        console.log(error);
        setError({ isError: false, title: "", message: "" });
    };
    return (
        <>
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
                <div className='w-full flex flex-col justify-start gap-5'>
                    <VoucherActionBar
                        dataSelected={selectedVouchers}
                        fetchData={fetchData}
                    />
                    {error.isError && (
                        <Alert
                            message={error.title}
                            description={error.message}
                            type='error'
                            showIcon
                            onClose={handleCloseError}
                            closeIcon
                        />
                    )}
                    <div className='border bg-white shadow p-3 w-full'>
                        <div className='flex items-center gap-2'>
                            <p>{t_general('sort')}: </p>
                            <Select
                                placeholder='Columns'
                                value={
                                    tableParams.sorter?.field?.toString() ||
                                    "id"
                                }
                                onChange={handleSortFieldChange}
                                options={columns
                                    .filter(
                                        (item) =>
                                            item.key !== "fullname" &&
                                            item.key !== "action"
                                    )
                                    .map((item) => ({
                                        value: item.key,
                                        label: item.title,
                                    }))}
                            />

                            <p>{t_general('order')}: </p>

                            <Button
                                onClick={handleToggleSorter}
                                icon={
                                    tableParams.sorter?.order === "ascend" ? (
                                        <SortAscendingOutlined />
                                    ) : (
                                        <SortDescendingOutlined />
                                    )
                                }
                            />
                        </div>
                    </div>
                    <div className='w-full h-auto'>
                        <Table
                            rowSelection={{
                                ...rowSelection,
                            }}
                            columns={columns}
                            pagination={{
                                className: "bg-white rounded px-4 py-2",
                                showTotal: (total: number) =>
                                    `Total ${total} items`,
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
        </>
    );
};

export default Voucher;
