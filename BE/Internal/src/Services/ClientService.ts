import { ErrorName, HttpStatusCode } from '../Constants';
import { container } from '../Configs';
import { QueryOptions, TYPES } from '../Types/type';
import { IClientRepository } from '../Repositories/IClientRepository';
import { IOrderRepository } from "../Repositories/IOrderRepository";
import { ICartRepository, IProductRepository } from '../Repositories';
import { IGroupRepository } from '../Repositories';
import { Product, Client } from '../Models';
import { CustomError, RecordNotFoundError } from '../Errors';
import { Op, where } from 'sequelize';
import * as dotenv from 'dotenv';
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
        private productRepository = container.get<IProductRepository>(TYPES.IProductRepository),
        private groupRepository = container.get<IGroupRepository>(TYPES.IGroupRepository),

    ) { }

    public async getAll(options?: QueryOptions) {
        const result = await this.clientRepository.all(options);
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
        let orderInfo = await await this.orderRepository.viewOrders(id);

        return { ...customerInfo["dataValues"], orderInfo, group: group }
    }
    public async create(data: any) {
        const { phone, email, type } = data;
        const user = await this.clientRepository.findByEmail(email)

        if (user) {
            throw new CustomError(HttpStatusCode.Conflict, ErrorName.CONFLICT, "User exists")
        }

        if (!type) {
            data.type = "Lead"
        } else if (type === "customer") {
            data.type = "Customer"
        }
        return await this.clientRepository.create(data)
    }

    public async update(id: number, data: any) {
        const user = this.clientRepository.findById(id);
        if (!user) {
            throw new RecordNotFoundError()
        }
        return await this.clientRepository.update(id, data);
    }

    public async delete(id: number) {
        const user = this.clientRepository.findById(id);
        if (!user) {
            throw new RecordNotFoundError()
        }
        return await this.clientRepository.delete(id);
    }

    public async search(key: string, by: string) {
        return []
    }

    public async sort(by: string) {
        return []
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

    public updateCustomerGroup = async (group_info: any, update_convert_time: boolean) => {
        console.log("Update")
        if (update_convert_time) {
            await Promise.all(
                group_info.map(async (item: any) => {
                    await this.clientRepository.updateBaseCond({
                        groupId: item.groupId,
                        type: "customer",
                        convertDate: new Date()
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
                                        [Op.ne]: item.groupId
                                    }
                                },
                            ]
                        }
                    })
                }
                )
            )
        }
        else {
            await Promise.all(
                group_info.map(async (item: any) => {
                    await this.clientRepository.update(item.id, {
                        groupId: item.groupId,
                    })
                }
                )
            )
        }
    }

    public segmentProcess = async (customers: any, update_convert_time = false) => {
        const res = await axios.post(`http://${process.env.FLASK_HOST}:${process.env.FLASK_PORT}/api/segment`, customers);
        await this.updateCustomerGroup(res.data, update_convert_time)
    }

    public segmentCustomerAll = async () => {
        try {
            const customers = await this.clientRepository.findByCond({
                attributes: ['id', 'birthday', 'profit', 'total_items'],
                where: {
                    type: "customer"
                }
            })

            if (customers.length > 0) {
                await this.segmentProcess(customers)
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
            const customer = await this.clientRepository.findByCond({
                attributes: ['id', 'birthday', 'profit', 'total_items'],
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
}
