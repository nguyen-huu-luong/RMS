import {ErrorName, HttpStatusCode} from '../Constants';
import { container } from '../Configs';
import { QueryOptions, TYPES } from '../Types/type';
import { IClientRepository } from '../Repositories/IClientRepository';
import { IOrderRepository } from "../Repositories/IOrderRepository"; 
import { ICartRepository, IProductRepository } from '../Repositories';
import { Product, Client } from '../Models';
import { CustomError, RecordNotFoundError } from '../Errors';
import { Op, where } from 'sequelize';


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
        private productRepository = container.get<IProductRepository>(TYPES.IProductRepository)

    ) {}

    public async getAll(options?: QueryOptions) {
        const result =  await this.clientRepository.all(options);
        return {
            ...result
        }
    }

    public async getById(id: number) {
        let customerInfo = await this.clientRepository.findById(id);
        let orderInfo = await await this.orderRepository.viewOrders(id);
        return {...customerInfo["dataValues"], orderInfo}
    } 
    public async create(data: any)  {
        const {phone, email} = data;
        const user = await this.clientRepository.findByEmail(email)

        if (user) {
            throw new CustomError(HttpStatusCode.Conflict, ErrorName.CONFLICT, "User exists")
        }

        return await this.clientRepository.create(data)
    }
    
    public async update(id: number, data: any) {
        const user = this.clientRepository.findById(id) ;
        if (!user) {
            throw new RecordNotFoundError()
        } 
        return await this.clientRepository.update(id, data); 
    }
    

    public async delete(id: number) {
        const user = this.clientRepository.findById(id) ;
        if (!user) {
            throw new RecordNotFoundError()
        } 
        return await this.clientRepository.delete(id) ; 
    }

    public async search(key: string, by: string) {
        return []
    }

    public async sort(by: string ) {
        return []
    }

    public getOpportunityCustomer =  async () => {
        const carts = await this.cartRepository.findByCond(
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
                    model: Product
                },
                {   model: Client}]
            }
        )

        return carts

    }
}
