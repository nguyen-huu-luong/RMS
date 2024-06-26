import { ErrorName, HttpStatusCode } from '../Constants';
import { container } from '../Configs';
import { QueryOptions, TYPES } from '../Types/type';
import { IClientRepository } from '../Repositories/IClientRepository';
import { IOrderRepository } from "../Repositories/IOrderRepository";
import { ICartRepository, IProductRepository } from '../Repositories';
import { IGroupRepository } from '../Repositories';
import { Product, Client } from '../Models';
import { CustomError, RecordNotFoundError } from '../Errors';
import { Group } from '../Models';
import { Op, where } from 'sequelize';
import * as dotenv from 'dotenv';
import Sequelize from 'sequelize';
import { sequelize } from '../Configs';
import { IChannelRepository } from '../Repositories/IChannelRepository';
import { IMessageRepository } from '../Repositories/IMessageRepository';
const axios = require('axios').default;


// export interface IClientService {
//     getAll: (options?: QueryOptions) => Promise<Array<any>[]> ;
//     getById: (id: number) => Promise<Client> ; 
//     create: (data: any)  => Promise<Client> ;
//     update: (id: number, data: any) => Promise<Client> ;
//     delete: (id: number) => Promise<boolean> ;
//     search: (key: string, by: string) => Promise<Client[]> ;
//     sort: (by: string) => Promise<Client[]> ; 
// }

export class ClientService {
    constructor(
        private clientRepository = container.get<IClientRepository>(TYPES.IClientRepository),
        private orderRepository = container.get<IOrderRepository>(
            TYPES.IOrderRepository
        ),
        private cartRepository = container.get<ICartRepository>(TYPES.ICartRepository),
        private groupRepository = container.get<IGroupRepository>(TYPES.IGroupRepository),
        private messageRepository = container.get<IMessageRepository>(TYPES.IMessageRepository),
    ) { }

    public async getAll(options?: QueryOptions) {
        const result = await this.clientRepository.all({ ...options, associations: ["Group"] } as QueryOptions);
        return {
            ...result
        }
    }

    public async getById(id: number) {
        let customerInfo: any = await this.clientRepository.findById(id);
        let group = await this.groupRepository.findByCond({
            where: {
                id: customerInfo.groupId
            }
        })
        let orderInfo = await this.orderRepository.viewOrders(id);

        return { ...customerInfo["dataValues"], orderInfo, group: group }
    }
    public async create(data: any) {
        const { phone, email, type } = data;
        const user = await this.clientRepository.findByEmail(email)

        if (user) {
            throw new CustomError(HttpStatusCode.Conflict, ErrorName.CONFLICT, `User existss with id=<${user.id}>`)
        }

        if (!type && typeof type === "string") {
            data.type = "lead"
        } else if (type.toLocaleLowerCase() === "customer") {
            data.type = "customer"
        }
        const client = await this.clientRepository.create(data)
        await client.createChannel()
        const channel = await client.getChannel();
        await this.messageRepository.create({
            content: "Welcome to home cuisine!",
            employeeId: 1,
            clientId: null,
            channelId: channel.getDataValue("id"),
        });
        return client;
    }

    public async update(id: number, data: any) {
        const user = this.clientRepository.findById(id);
        if (!user) {
            throw new RecordNotFoundError()
        }
        return await this.clientRepository.update(id, data);
    }

    public async delete(id: number) {
        return await this.clientRepository.delete(id);
    }

    public async deleteMany(ids: number[]) {
        return await this.clientRepository.deleteManyClients(ids)
    }

    public getOpportunityCustomer = async (sort_factor: any, order: any) => {
        let carts: any
        if (sort_factor == "amount") {
            carts = await this.cartRepository.findByCond(
                {
                    attributes: ['id', 'clientId', 'amount'],
                    where: {
                        clientId: {
                            [Op.ne]: null
                        },
                        amount: {
                            [Op.ne]: 0
                        }
                    },
                    order: [
                        [sort_factor, order]
                    ],
                    include: [{
                        model: Product,
                    },
                    {
                        model: Client,
                    }]
                }
            )
        }
        else if (sort_factor == "fullname") {
            carts = await this.cartRepository.findByCond(
                {
                    attributes: ['id', 'clientId', 'amount'],
                    where: {
                        clientId: {
                            [Op.ne]: null
                        },
                        amount: {
                            [Op.ne]: 0
                        }
                    },
                    include: [{
                        model: Product,
                    },
                    {
                        model: Client,
                        as: 'Client',
                    }],
                    order: [
                        ['Client', 'firstname', order],
                        ['Client', 'lastname', order],
                    ],
                }
            )
        }

        else if (sort_factor == "type") {
            carts = await this.cartRepository.findByCond(
                {
                    attributes: ['id', 'clientId', 'amount'],
                    where: {
                        clientId: {
                            [Op.ne]: null
                        },
                        amount: {
                            [Op.ne]: 0
                        }
                    },
                    include: [{
                        model: Product,
                    },
                    {
                        model: Client,
                        as: 'Client',
                    }],
                    order: [
                        ['Client', 'type', order]
                    ],
                }
            )
        }

        return carts

    }

    public updateCustomerGroup = async (group_info: any, update_segment_time: boolean) => {
        if (update_segment_time) {
            await Promise.all(
                group_info.map(async (item: any) => {
                    await this.clientRepository.updateBaseCond({
                        groupId: item.groupId + 1,
                        segmentDate: new Date()
                    }, {
                        where: {
                            id: item.id,
                            [Op.or]: [
                                {
                                    groupId: {
                                        [Op.is]: null
                                    }
                                },
                                {
                                    groupId: {
                                        [Op.ne]: item.groupId + 1
                                    }
                                },
                            ]
                        }
                    })
                    await this.clientRepository.updateBaseCond({
                        lastPurchase: new Date()
                    }, {
                        where: {
                            id: item.id
                        }
                    })
                }
                )
            )
        }
        else {
            for (let i = 0; i < group_info.length; i++) {
                let client: any = await this.clientRepository.findById(group_info[i].id)
                let segmentDate = client.createdAt
                segmentDate.setDate(segmentDate.getDate() + Math.floor(Math.random() * 30))
                await this.clientRepository.update(client.id, {
                    groupId: group_info[i].groupId + 1,
                    segmentDate: segmentDate
                })
            }
        }
    }

    public segmentProcess = async (customers: any, update_segment_time: any) => {
        const res = await axios.post(`http://${process.env.FLASK_HOST}:${process.env.FLASK_PORT}/api/segment`, customers);
        await this.updateCustomerGroup(res.data, update_segment_time)
    }

    public segmentCustomerAll = async () => {
        try {
            const customers = await this.clientRepository.findByCond({
                attributes: ['id', 'birthday', 'profit', 'total_items', 'lastPurchase'],
                where: {
                    type: "customer"
                }
            })

            if (customers.length > 0) {
                await this.segmentProcess(customers, false)
            }

            return { "status": "success" }
        }
        catch (err) {
            console.log(err)
            return { "status": "failed" }
        }
    }

    public segmentCustomer = async (id_: number) => {
        try {
            let customer: any = await this.clientRepository.findByCond({
                attributes: ['id', 'birthday', 'profit', 'total_items', 'lastPurchase'],
                where: {
                    id: id_,
                }
            })

            if (customer.length > 0) {
                await this.segmentProcess(customer, true)
            }
            return { "status": "success" }
        }
        catch (err) {
            console.log(err)
            return { "status": "failed" }
        }
    }

    public getTotalPerGroup = async () => {
        try {
            const groups = await this.clientRepository.findByCond({
                attributes: ['Group.name', [Sequelize.fn('count', Sequelize.col('Group.name')), 'num_customers']],
                include: [{ model: Group, as: "Group", attributes: ['name'] }],
                group: ['Group.name', 'Group.id'],
                where: {
                    groupId: {
                        [Op.ne]: null
                    }
                },
                order: [
                    ['Group', 'name', 'ASC'],
                ]
            })

            let temp_groups: any = []
            for (let idx in groups) {
                const temp = groups[idx].dataValues
                let element = {
                    name: temp.Group.name,
                    num_customers: temp.num_customers
                }
                temp_groups.push(element)
            }

            return temp_groups
        }
        catch (err) {
            console.log(err)
            return "Error"
        }
    }

    public getTotalPerGroupFilter = async (type: string, data?: any) => {
        try {
            let groups: any
            if (type === "Customize") {
                const sequelizeObj = sequelize.getSequelize()
                let start_date = data.start_date
                let end_date = data.end_date

                const [group_temp, metadata_group_temp] = await sequelizeObj.query(`SELECT "segmentDate",
                                                                                            SUM(CASE WHEN "groupId" = 1 THEN 1 ELSE 0 END) AS "Group 0",
                                                                                            SUM(CASE WHEN "groupId" = 2 THEN 1 ELSE 0 END) AS "Group 1",
                                                                                            SUM(CASE WHEN "groupId" = 3 THEN 1 ELSE 0 END) AS "Group 2",
                                                                                            SUM(CASE WHEN "groupId" = 4 THEN 1 ELSE 0 END) AS "Group 3",
                                                                                            SUM(CASE WHEN "groupId" = 5 THEN 1 ELSE 0 END) AS "Group 4",
                                                                                            SUM(CASE WHEN "groupId" = 6 THEN 1 ELSE 0 END) AS "Group 5"
                                                                                        FROM "Clients" JOIN "Groups" as groups ON "groupId" = groups.id
                                                                                        WHERE "segmentDate" >= '${start_date}' AND "segmentDate" <= '${end_date}'
                                                                                        GROUP BY "segmentDate"
                                                                                        ORDER BY "segmentDate" ASC`);

                groups = group_temp
            }
            else if (type == "Year") {
                const sequelizeObj = sequelize.getSequelize()
                const [year_base, metadata_year_base] = await sequelizeObj.query(`SELECT date_trunc('year', "segmentDate") AS year, 
                                                                            SUM(CASE WHEN "groupId" = 1 THEN 1 ELSE 0 END) AS "Group 0",
                                                                            SUM(CASE WHEN "groupId" = 2 THEN 1 ELSE 0 END) AS "Group 1",
                                                                            SUM(CASE WHEN "groupId" = 3 THEN 1 ELSE 0 END) AS "Group 2",
                                                                            SUM(CASE WHEN "groupId" = 4 THEN 1 ELSE 0 END) AS "Group 3",
                                                                            SUM(CASE WHEN "groupId" = 5 THEN 1 ELSE 0 END) AS "Group 4",
                                                                            SUM(CASE WHEN "groupId" = 6 THEN 1 ELSE 0 END) AS "Group 5"
                                                                        FROM "Clients" JOIN "Groups" as groups ON "groupId" = groups.id
                                                                        GROUP BY year
                                                                        ORDER BY year ASC
                                                                    `);
                groups = year_base
            }
            else if (type == "Month") {
                const sequelizeObj = sequelize.getSequelize()
                const [month_base, metadata_month_base] = await sequelizeObj.query(`SELECT date_trunc('month', "segmentDate") AS month, date_trunc('year', "segmentDate") AS year,
                                                                            SUM(CASE WHEN "groupId" = 1 THEN 1 ELSE 0 END) AS "Group 0",
                                                                            SUM(CASE WHEN "groupId" = 2 THEN 1 ELSE 0 END) AS "Group 1",
                                                                            SUM(CASE WHEN "groupId" = 3 THEN 1 ELSE 0 END) AS "Group 2",
                                                                            SUM(CASE WHEN "groupId" = 4 THEN 1 ELSE 0 END) AS "Group 3",
                                                                            SUM(CASE WHEN "groupId" = 5 THEN 1 ELSE 0 END) AS "Group 4",
                                                                            SUM(CASE WHEN "groupId" = 6 THEN 1 ELSE 0 END) AS "Group 5"
                                                                        FROM "Clients" JOIN "Groups" as groups ON "groupId" = groups.id
                                                                        GROUP BY year, month
                                                                        ORDER BY year ASC, month ASC

                                                                    `);
                groups = month_base
            }
            else if (type == "Sumarize") {
                const sequelizeObj = sequelize.getSequelize()
                const [gender, metadata_gender] = await sequelizeObj.query(`SELECT groups.name, gender, groups.description
                                                                        FROM "Clients" JOIN "Groups" as groups ON "groupId" = groups.id
                                                                        GROUP BY groups.name, groups.id, gender, groups.description
                                                                        HAVING gender IN (
                                                                            SELECT gender FROM "Clients" as clients
                                                                            WHERE "clients"."groupId" = groups.id
                                                                            GROUP BY clients.gender
                                                                            ORDER BY COUNT(clients.gender) ASC
                                                                            LIMIT 1 
                                                                        )
                                                                        ORDER BY groups.name ASC
                                                                    `);

                const [source, metadata_source] = await sequelizeObj.query(`SELECT groups.name, source
                                                                    FROM "Clients" JOIN "Groups" as groups ON "groupId" = groups.id
                                                                    GROUP BY groups.name, groups.id, source
                                                                    HAVING source IN (
                                                                        SELECT source FROM "Clients" as clients
                                                                        WHERE "clients"."groupId" = groups.id
                                                                        GROUP BY clients.source
                                                                        ORDER BY COUNT(clients.source) ASC
                                                                        LIMIT 1 
                                                                    )
                                                                    ORDER BY groups.name ASC
                                                                `);

                //     const [avg_convert_time, metadata_avg_convert_time] = await sequelizeObj.query(`SELECT groups.name, avg(DATE_PART('day', "Clients"."createdAt"::timestamp - "segmentDate"::timestamp)) as avg_convert_date
                //                                                         FROM "Clients" JOIN "Groups" as groups ON "groupId" = groups.id
                //                                                         GROUP BY groups.name, groups.id
                //                                                         ORDER BY groups.name ASC
                // `);
                let temp_groups = []
                for (let idx in gender) {
                    let temp_gender: any = gender[idx]
                    let temp_source: any = source[idx]
                    // let temp_avg_convert_time: any = avg_convert_time[idx]
                    let element = {
                        name: temp_gender.name,
                        description: temp_gender.description,
                        gender: temp_gender.gender ? "Male" : "Female",
                        source: temp_source.source,
                        // avg_convert_day: parseInt(temp_avg_convert_time.avg_convert_date)
                    }
                    temp_groups.push(element)

                }
                groups = temp_groups
            }

            return groups
        }
        catch (err) {
            console.log(err)
            return "Error"
        }
    }

    public getCustomerPerGroup = async (groupIds: any = []) => {
        let customers: any
        if (groupIds.length == 0) {
            customers = await this.clientRepository.findByCond({
                include: [{
                    model: Group, as: "Group", attributes: ['name', "description"]
                }],
                where: {
                    type: "customer",
                    groupId: {
                        [Op.ne]: null
                    }
                },
                order: [
                    ['groupId', 'ASC']
                ]

            })
        }
        else {
            customers = await this.clientRepository.findByCond({
                include: [{
                    model: Group, as: "Group", attributes: ['name', "description"], where: {
                        id: {
                            [Op.in]: groupIds
                        }
                    }
                }],
                where: {
                    type: "customer",
                    groupId: {
                        [Op.ne]: null
                    }
                },
                order: [
                    ['groupId', 'ASC']
                ],
            })
        }
        return customers
    }

}