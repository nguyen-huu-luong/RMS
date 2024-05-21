"use client";
import React, { useEffect, useState } from "react";
import {
    Button,
    Select,
    Empty,
    message,
    Table,
    Tag,
    Input,
    FormInstance,
    Modal,
} from "antd";
import fetchClient from "@/lib/fetch-client";
import Loading from "../loading";
import Link from "next-intl/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
interface AssignVoucherFormProps {
    voucherId: number;
    form: FormInstance;
    updateInformation: any;
}

export const AssignVoucherForm: React.FC<AssignVoucherFormProps> = (props) => {
    const [voucherClients, setVoucherClients] = useState<any[]>([]);
    const [selectedProfit, setSelectedProfit] = useState<number | null>(null);
    const [customProfit, setCustomProfit] = useState<string>("");
    const [showCustomInput, setShowCustomInput] = useState<boolean>(true);
    const { Option } = Select;
    const params = useParams<{ locale: string }>();
    const t = useTranslations('Voucher')

    useEffect(() => {
        fetchVoucherClients();
    }, [props.voucherId]);

    const columns = [
        {
            title: t('name'),
            dataIndex: "fullname",
            key: "fullname",
            render: (text: any, record: any) => (
                <Link locale={params.locale} href={`/customers/${record.id}`}>
                    {text}
                </Link>
            ),
        },
        {
            title: t('status'),
            dataIndex: "status",
            key: "status",
        },
    ];

    const fetchVoucherClients = async () => {
        try {
            const response = await fetchClient({
                url: `/vouchers/clients/${props.voucherId}`,
                method: "GET",
                data_return: true,
            });
            setVoucherClients(response || []);
        } catch (error) {
            console.error("Error fetching voucher client data:", error);
        }
    };

    const handleAddMore = async (addedQuantity: number) => {
        let fieldValues = await props.form.getFieldsValue();
        const quantity = await props.form.getFieldValue("quantity");
        await props.updateInformation({
            ...fieldValues,
            quantity: quantity + addedQuantity,
        });
        await handleAssign()
    };

    const handleAssign = async () => {
        try {
            if (selectedProfit !== null || customProfit !== null) {
                const response = await fetchClient({
                    url: `/vouchers/${props.voucherId}?profit=${
                        selectedProfit ? selectedProfit : customProfit
                    }`,
                    method: "POST",
                    data_return: true,
                });
                if (response === "Success") {
                    message.success(t('assign-success'));
                } else if (response === "Already assigned") {
                    message.warning(
                        t('all')
                    );
                } else {
                    Modal.confirm({
                        title: `${t('not-enough-1')} ${response.more} ${t('not-enough-2')}`,
                        autoFocusButton: null,
                        okButtonProps: {
                            style: {
                                backgroundColor: "#2b60ff",
                            },
                        },
                        okText: t('finish'),
                        onOk: () => handleAddMore(response.more),
                        footer: (_, { OkBtn, CancelBtn }) => (
                            <>
                                <CancelBtn />
                                <OkBtn />
                            </>
                        ),
                    });
                }
            }
            await fetchVoucherClients();
            props.form.resetFields();
        } catch (error) {
            console.error("Error assigning voucher:", error);
            message.error("Failed to assign voucher");
        }
    };

    const handleCustomInputChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { value } = e.target;
        console.log(value);
        setCustomProfit(value);
    };

    const handleSelectChange = (value: number) => {
        setSelectedProfit(value);
        setShowCustomInput(value === null);
    };

    if (!voucherClients) return <Loading />;

    return (
        <div className='flex flex-col justify-start gap-2'>
            <div>
                {t('select')}
                <Select
                    style={{ width: "100%" }}
                    placeholder='Please select'
                    value={selectedProfit}
                    onChange={handleSelectChange}
                    defaultValue={100000}
                >
                    <Option value={100000}> {">"} 100,000</Option>
                    <Option value={200000}> {">"} 200,000</Option>
                    <Option value={300000}> {">"} 300,000</Option>
                    <Option value={500000}>{">"} 500,000</Option>
                    <Option value={1000000}>{">"} 1,000,000</Option>
                    <Option value={2000000}>{">"} 2,000,000</Option>
                    <Option value={null}>{t('custom')}</Option>
                </Select>
                {showCustomInput && (
                    <Input
                        style={{ marginTop: "8px" }}
                        placeholder={t('select-custom')}
                        value={customProfit}
                        onChange={handleCustomInputChange}
                        type='number'
                    />
                )}
            </div>
            {selectedProfit || customProfit ? (
                <Button onClick={handleAssign}>{t('assign')}</Button>
            ) : (
                ""
            )}
            <div>
                {voucherClients.length === 0 ? (
                    <Empty description={t('empty')} />
                ) : (
                    <Table
                        columns={columns}
                        dataSource={voucherClients.map((client) => ({
                            key: client.id,
                            id: client.id,
                            fullname: `${client.firstname} ${client.lastname}`,
                            status: client.ClientVoucher.status
                                ? t('used')
                                : t('available'),
                        }))}
                        pagination={{ pageSize: 5 }}
                    />
                )}
            </div>
        </div>
    );
};
