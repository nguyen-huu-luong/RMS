import { injectable } from "inversify";
import "reflect-metadata";
import { IClientRepository } from "../IClientRepository";
import { BaseRepository } from "./BaseRepository";
import { Client } from "../../Models";
import Token from "../../Models/Token";
import { REFRESH_TOKEN } from "../../Constants";
import message from "../../Utils/Message";
import { Op } from "sequelize";

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
            "birthday",
            "score",
            "createdAt",
            "updatedAt",
        ]);
    }

    public async findByEmail(email: string): Promise<Client | null> {
        return await this._model.findOne({ where: { email: email } });
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
                clientAmounts.set(client.getDataValue("id"), totalAmount);
            }
            const clientAmountsArray: [number, number, number][] = Array.from(clientAmounts).map(([clientId, amount]) => [clientId, amount, -10]);;
            clientAmountsArray.sort((a, b) => b[1] - a[1]);
            const topClients = clientAmountsArray.slice(0, 10);
            const previousMonth = await this.getCustomTopCustomer(startOfLastMonth, endOfLastMonth);
            if (previousMonth) {
                const result: [number, number, number][] = topClients.map(([clientId, amount], index) => {
                    const indexInPrevious = previousMonth.findIndex((pre: any) => pre[0] === clientId);
                    const indexChange = indexInPrevious !== -1 ? indexInPrevious - index : -10;
                    return [clientId, amount, indexChange];
                });
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
                clientAmounts.set(client.getDataValue("id"), totalAmount);
            }
            const clientAmountsArray: [number, number, number][] = Array.from(clientAmounts).map(([clientId, amount]) => [clientId, amount, -10]);;
            clientAmountsArray.sort((a, b) => b[1] - a[1]);
            const topClients = clientAmountsArray.slice(0, 10);
            const previousYear = await this.getCustomTopCustomer(startOfLastYear, endOfLastYear);    
            if (previousYear) {
                const result: [number, number, number][] = topClients.map(([clientId, amount], index) => {
                    const indexInPrevious = previousYear.findIndex((pre: any) => pre[0] === clientId);
                    const indexChange = indexInPrevious !== -1 ? indexInPrevious - index : -10;
                    return [clientId, amount, indexChange];
                });
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
				clientAmounts.set(client.getDataValue("id"), totalAmount);
			}
			const clientAmountsArray: [number, number][] = Array.from(clientAmounts);
			clientAmountsArray.sort((a, b) => b[1] - a[1]);
			const topClients = clientAmountsArray.slice(0, 10);
			return topClients;
		} catch (err) {
			message.queryError(err);
		}
	}
}
