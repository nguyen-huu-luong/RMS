import { variables } from "@/app";
import { ConfigProvider, GetProp } from "antd";
import { AnyObject } from "antd/es/_util/type";
import Table, { TableProps } from "antd/es/table";
import { useState } from "react";

type ColumnsType<T> = TableProps<T>["columns"];
type TablePaginationConfig = Exclude<
    GetProp<TableProps, "pagination">,
    boolean
>;
interface IClientTable<T> {
    columns: ColumnsType<T>;
    dataSource: T[],
    onSelected?: {
        handle?: (selecteds: T[]) => void,
        render?: () => React.ReactNode
    },
    excludeDataHasIds?: number[]
}



export const ClientTable = <T extends AnyObject,>({ columns, excludeDataHasIds, onSelected, dataSource }: IClientTable<T>) => {
    const [data, setData] = useState<T[]>([]);
    const [isSelectedRows, setIsSelectedRows] = useState(false);


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



    return <>
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
                },
            }}
        >

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

                    }}
                    dataSource={dataSource}

                />
            </div>
        </ConfigProvider >
    </>
}