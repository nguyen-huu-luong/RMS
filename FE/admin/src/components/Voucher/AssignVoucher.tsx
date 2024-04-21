import React, { useEffect, useState } from "react";
import { Button, Select, Empty, message } from "antd";
import fetchClient from "@/lib/fetch-client";
import Loading from "../loading";

interface AssignVoucherFormProps {
    voucherId: number;
    afterSubmit: () => void;
    afterCancel: () => void;
}

export const AssignVoucherForm: React.FC<AssignVoucherFormProps> = (props) => {
    const [clients, setClients] = useState<any[]>([]);
    const [voucherClients, setVoucherClients] = useState<any[]>([]);
    const [selectedClients, setSelectedClients] = useState<number[]>([]);
    const [selectedProfit, setSelectedProfit] = useState<number | null>(null);
    const { Option } = Select;

    useEffect(() => {
        fetchClientData();
        fetchVoucherClients();
    }, [props.voucherId]);

    const fetchClientData = async () => {
        try {
            const response = await fetchClient({
                url: `/customers/all`,
                method: "GET",
                data_return: true,
            });
            setClients(
                response.data.map((client: any) => ({
                    label: client.firstname + " " + client.lastname,
                    value: client.id,
                }))
            );
        } catch (error) {
            console.error("Error fetching client data:", error);
        }
    };

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

    const handleAssign = async () => {
        try {
            let assignedClients = selectedClients;
            if (selectedProfit !== null) {
                const response = await fetchClient({
                    url: `/vouchers/${props.voucherId}?profit=${selectedProfit}`,
                    method: "POST",
                });
                message.success("Assign voucher successfully");
                assignedClients = [];
            } else {
                const response = await fetchClient({
                    url: `/vouchers/${props.voucherId}`,
                    method: "POST",
                    body: { clientsIds: selectedClients },
                });
                message.success("Assign voucher successfully");
            }
            await fetchVoucherClients();
        } catch (error) {
            console.error("Error assigning voucher:", error);
            message.error("Failed to assign voucher");
        }
    };

    if (clients.length === 0) return <Loading />;

    return (
        <div className='flex flex-col justify-start gap-2'>
            <div>
                Select profit or customer:
                <Select
                    style={{ width: "100%" }}
                    placeholder='Please select'
                    defaultValue={null}
                    onChange={(value) => setSelectedProfit(value)}
                >
                    <Option value={500000}> {">"} 500,000</Option>
                    <Option value={1000000}>{">"} 1,000,000</Option>
                    <Option value={2000000}>{">"} 2,000,000</Option>
                    <Option value={3000000}>{">"} 3,000,000</Option>
                    <Option value={null}>Custom</Option>
                </Select>
            </div>
            {selectedProfit === null && (
                <div>
                    Select customer:
                    <Select
                        mode='multiple'
                        allowClear
                        style={{ width: "100%" }}
                        placeholder='Please select'
                        defaultValue={[]}
                        onChange={(values) => setSelectedClients(values)}
                    >
                        {clients.map((client) => (
                            <Option key={client.value} value={client.value}>
                                {client.label}
                            </Option>
                        ))}
                    </Select>
                </div>
            )}
            <Button onClick={handleAssign}>Assign</Button>
            <div>
                {voucherClients.length === 0 ? (
                    <Empty description='No voucher clients yet' />
                ) : (
                    voucherClients.map((voucherClient) => (
                        <div key={voucherClient.id}>
                            {voucherClient.firstname} {voucherClient.lastname}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
