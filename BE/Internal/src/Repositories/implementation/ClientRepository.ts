import { injectable } from "inversify";
import "reflect-metadata";
import { IClientRepository } from "../IClientRepository";
import { BaseRepository } from "./BaseRepository";
import { Client } from "../../Models";
import Token from "../../Models/Token";
import { REFRESH_TOKEN } from "../../Constants";
import message from "../../Utils/Message";
import { Op, Sequelize } from "sequelize";
@injectable()
export class ClientRepository
    extends BaseRepository<Client>
    implements IClientRepository
{
    constructor() {
        super(Client, [
            "id",
            "firstname",
            "lastname",
            "phone",
            "email",
            "gender",
            "type",
            "birthday",
            "source",
            "score",
            "groupId",
            "createdAt",
            "updatedAt",
        ]);
    }

    public async findByEmail(email: string): Promise<Client | null> {
        return await this._model.findOne({ where: { email: email } });
    }

    public async findByProfit(profit: number, voucherId: number) {
        const clients = await this._model.findAll({
            where: { profit: { [Op.gt]: profit } },
        });
        const clientsWithoutVoucher = await Promise.all(
            clients.map(async (client: Client) => {
                const voucher = await client.getVouchers({
                    where: {
                        id: voucherId,
                    },
                });
                if (voucher.length === 0) return client;
            })
        );
        const res = clientsWithoutVoucher.filter(
            (client) => client !== undefined
        );
        return res;
    }

    public async findByType(type: string) {
        return await this._model.findAll({
            where: { type: type },
        });
    }

    public async removeToken(token: string, user: Client): Promise<Client> {
        let tokens = await user.getTokens();
        tokens = tokens.filter((tokenObj: Token) => tokenObj.value !== token);

        return await user.save();
    }

    public async getMonthlyTopCustomer() {
        try {
            const today = new Date();
            const startOfMonth = new Date(
                today.getFullYear(),
                today.getMonth(),
                1
            );
            const endOfMonth = today;
            const startOfLastMonth = new Date(
                today.getFullYear(),
                today.getMonth() - 1,
                1
            );
            const endOfLastMonth = startOfMonth;
            const clients = await this._model.findAll();
            const clientAmounts: Map<number, number> = new Map();
            for (const client of clients) {
                const orders = await client.getOrders({
                    where: {
                        createdAt: {
                            [Op.between]: [startOfMonth, endOfMonth],
                        },
                        status: "Done",
                    },
                });
                let totalAmount = 0;
                for (const order of orders) {
                    totalAmount += order.getDataValue("amount");
                }
                if (totalAmount > 0) {
                    clientAmounts.set(client.getDataValue("id"), totalAmount);
                }
            }
            const clientAmountsArray: [number, number, number][] = Array.from(
                clientAmounts
            ).map(([clientId, amount]) => [clientId, amount, -10]);
            clientAmountsArray.sort((a, b) => b[1] - a[1]);
            const topClients = clientAmountsArray.slice(
                0,
                Math.min(10, clientAmountsArray.length)
            );
            const previousMonth = await this.getCustomTopCustomer(
                startOfLastMonth,
                endOfLastMonth
            );
            if (previousMonth) {
                const result: [number, number, number][] = topClients.map(
                    ([clientId, amount], index) => {
                        const indexInPrevious = previousMonth.findIndex(
                            (pre: any) => pre[0] === clientId
                        );
                        const indexChange =
                            indexInPrevious !== -1
                                ? indexInPrevious - index
                                : -10;
                        return [clientId, amount, indexChange];
                    }
                );
                return result;
            } else {
                return topClients;
            }
        } catch (err) {
            message.queryError(err);
        }
    }

    public async getYearlyTopCustomer() {
        try {
            const today = new Date();
            const startOfYear = new Date(today.getFullYear(), 0, 1);
            const endOfYear = new Date();
            const startOfLastYear = new Date(today.getFullYear() - 1, 0, 1);
            const endOfLastYear = startOfYear;
            const clients = await this._model.findAll();
            const clientAmounts: Map<number, number> = new Map();
            for (const client of clients) {
                const orders = await client.getOrders({
                    where: {
                        createdAt: {
                            [Op.between]: [startOfYear, endOfYear],
                        },
                        status: "Done",
                    },
                });
                let totalAmount = 0;
                for (const order of orders) {
                    totalAmount += order.getDataValue("amount");
                }
                if (totalAmount > 0) {
                    clientAmounts.set(client.getDataValue("id"), totalAmount);
                }
            }
            const clientAmountsArray: [number, number, number][] = Array.from(
                clientAmounts
            ).map(([clientId, amount]) => [clientId, amount, -10]);
            clientAmountsArray.sort((a, b) => b[1] - a[1]);
            const topClients = clientAmountsArray.slice(
                0,
                Math.min(10, clientAmountsArray.length)
            );
            const previousYear = await this.getCustomTopCustomer(
                startOfLastYear,
                endOfLastYear
            );
            if (previousYear) {
                const result: [number, number, number][] = topClients.map(
                    ([clientId, amount], index) => {
                        const indexInPrevious = previousYear.findIndex(
                            (pre: any) => pre[0] === clientId
                        );
                        const indexChange =
                            indexInPrevious !== -1
                                ? indexInPrevious - index
                                : -10;
                        return [clientId, amount, indexChange];
                    }
                );
                return result;
            } else {
                return topClients;
            }
        } catch (err) {
            message.queryError(err);
        }
    }

    public async getCustomTopCustomer(beginDate: Date, endDate: Date) {
        try {
            const clients = await this._model.findAll();
            const clientAmounts: Map<number, number> = new Map();
            for (const client of clients) {
                const orders = await client.getOrders({
                    where: {
                        createdAt: {
                            [Op.between]: [beginDate, endDate],
                        },
                        status: "Done",
                    },
                });
                let totalAmount = 0;
                for (const order of orders) {
                    totalAmount += order.getDataValue("amount");
                }
                if (totalAmount > 0) {
                    clientAmounts.set(client.getDataValue("id"), totalAmount);
                }
            }
            const clientAmountsArray: [number, number][] =
                Array.from(clientAmounts);
            clientAmountsArray.sort((a, b) => b[1] - a[1]);
            const topClients = clientAmountsArray.slice(
                0,
                Math.min(10, clientAmountsArray.length)
            );
            return topClients;
        } catch (err) {
            message.queryError(err);
        }
    }

    public async getDailyConversion() {
        try {
            const today = new Date();
            const startOfToday = new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate()
            );
            const endOfToday = today;
            const yesterday = new Date();
            yesterday.setDate(today.getDate() - 1);
            yesterday.setDate(today.getDate() - 1);
            const startOfYesterday = new Date(
                yesterday.getFullYear(),
                yesterday.getMonth(),
                yesterday.getDate()
            );
            const endOfYesterday = new Date(
                yesterday.getFullYear(),
                yesterday.getMonth(),
                yesterday.getDate() + 1
            );
            const [todayConversions, yesterdayConversions] = await Promise.all([
                this._model.findAll({
                    where: {
                        convertDate: {
                            [Op.between]: [startOfToday, endOfToday],
                        },
                    },
                }),
                this._model.findAll({
                    where: {
                        convertDate: {
                            [Op.between]: [startOfYesterday, endOfYesterday],
                        },
                    },
                }),
            ]);
            return {
                todayConversions: todayConversions,
                yesterdayConversions: yesterdayConversions,
            };
        } catch (err) {
            message.queryError(err);
        }
    }

    public async getMonthlyConversion() {
        try {
            const today = new Date();
            const startOfMonth = new Date(
                today.getFullYear(),
                today.getMonth(),
                2
            );
            const endOfMonth = today;
            const startOfLastMonth = new Date(
                today.getFullYear(),
                today.getMonth() - 1,
                1
            );
            const endOfLastMonth = new Date(
                today.getFullYear(),
                today.getMonth(),
                1
            );
            const [currentMonthConversions, lastMonthConversions] =
                await Promise.all([
                    this._model.findAll({
                        where: {
                            convertDate: {
                                [Op.between]: [startOfMonth, endOfMonth],
                            },
                        },
                    }),
                    this._model.findAll({
                        where: {
                            convertDate: {
                                [Op.between]: [
                                    startOfLastMonth,
                                    endOfLastMonth,
                                ],
                            },
                        },
                    }),
                ]);
            return {
                currentMonthConversions: currentMonthConversions,
                lastMonthConversions: lastMonthConversions,
            };
        } catch (err) {
            message.queryError(err);
        }
    }

    public async getYearlyConversion() {
        try {
            const today = new Date();
            const startOfYear = new Date(today.getFullYear(), 0, 1);
            const endOfYear = today;
            const startOfLastYear = new Date(today.getFullYear() - 1, 0, 1);
            const endOfLastYear = startOfYear;
            const [currentYearConversions, lastYearConversions] =
                await Promise.all([
                    this._model.findAll({
                        where: {
                            convertDate: {
                                [Op.between]: [startOfYear, endOfYear],
                            },
                        },
                    }),
                    this._model.findAll({
                        where: {
                            convertDate: {
                                [Op.between]: [startOfLastYear, endOfLastYear],
                            },
                        },
                    }),
                ]);
            return {
                currentYearConversions: currentYearConversions,
                lastYearConversions: lastYearConversions,
            };
        } catch (err) {
            message.queryError(err);
        }
    }

    public async getConversionsByDate(
        beginDate: Date,
        endDate: Date = new Date()
    ) {
        try {
            const conversions = await this._model.findAll({
                where: {
                    convertDate: {
                        [Op.between]: [beginDate, endDate],
                    },
                },
            });
            return { conversions: conversions };
        } catch (err) {
            message.queryError(err);
        }
    }

    public async getConversionChart(beginDate?: Date, endDate?: Date) {
        try {
            const leads = await this._model.findAll({
                where: {
                    [Op.or]: [
                        {
                            type: "lead",
                            createdAt: {
                                [Op.between]: [beginDate, endDate],
                            },
                        },
                        {
                            type: "customer",
                            createdAt: {
                                [Op.between]: [beginDate, endDate],
                            },
                        },
                    ],
                },
                attributes: [
                    [Sequelize.literal(`DATE("createdAt")`), "date"],
                    [Sequelize.literal(`COUNT(*)`), "count"],
                ],
                group: ["date"],
            });

            const customers = await this._model.findAll({
                where: {
                    type: "customer",
                    convertDate: {
                        [Op.between]: [beginDate, endDate],
                    },
                },
                attributes: [
                    [Sequelize.literal(`DATE("convertDate")`), "date"],
                    [Sequelize.literal(`COUNT(*)`), "count"],
                ],
                group: ["date"],
            });
            const leadsMap = Object.fromEntries(
                leads.map((item: any) => [
                    item.getDataValue("date"),
                    item.getDataValue("count"),
                ])
            );
            const customersMap = Object.fromEntries(
                customers.map((item: any) => [
                    item.getDataValue("date"),
                    item.getDataValue("count"),
                ])
            );

            const dates = new Set([
                ...leads.map((item: any) => item.getDataValue("date")),
                ...customers.map((item: any) => item.getDataValue("date")),
            ]);
            const result = [];
            for (const date of dates) {
                result.push({
                    date,
                    newLeads: leadsMap[date] || 0,
                    newCustomers: customersMap[date] || 0,
                });
            }
            return { conversions: result };
        } catch (err) {
            message.queryError(err);
        }
    }

    public async checkExist(email: string) {
        return await this._model.findAll({
            where: {
                email: email,
            },
        });
    }

    public async findByCond(cond: any) {
        return await this._model.findAll(cond);
    }

    public async updateBaseCond(value: any, cond: any) {
        return await this._model.update(value, cond);
    }

    public async deleteManyClients(ids: number[]) {
        const result = await this._model.destroy({
            where: {
                id: ids,
            },
        });

        console.log(result);
        return result;
    }
}
