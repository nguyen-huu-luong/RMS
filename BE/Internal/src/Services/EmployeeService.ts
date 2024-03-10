import {ErrorName, HttpStatusCode} from '../Constants';
import { container } from '../Configs';
import { QueryOptions, TYPES } from '../Types/type';
import { IClientRepository } from '../Repositories/IClientRepository';
import { IOrderRepository } from "../Repositories/IOrderRepository"; 
import { CustomError, RecordNotFoundError } from '../Errors';


export class EmpolyeeService {
    constructor( 
        private clientRepository = container.get<IClientRepository>(TYPES.IClientRepository),
        private orderRepository = container.get<IOrderRepository>(
            TYPES.IOrderRepository
        )
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
        let {birthday, gender, ...info} = data
        birthday = new Date(Date.parse(birthday))
        gender = Boolean(JSON.parse(gender))
        let clientInfo = {"birthday": birthday, "gender": gender, ...info}
        return await this.clientRepository.update(id, clientInfo); 
    }

    public async delete(id: number) {
        const user = this.clientRepository.findById(id) ;
        if (!user) {
            throw new RecordNotFoundError()
        } 
        return await this.clientRepository.delete(id) ; 
    }
}
