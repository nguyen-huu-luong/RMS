import {ErrorName, HttpStatusCode} from '../Constants';
import { container } from '../Configs';
import { QueryOptions, TYPES } from '../Types/type';
import { IClientRepository } from '../Repositories/IClientRepository';  
import { CustomError, RecordNotFoundError } from '../Errors';


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
        private clientRepository = container.get<IClientRepository>(TYPES.IClientRepository)
    ) {}

    public async getAll(options?: QueryOptions) {
        return await this.clientRepository.all(options);
    }

    public async getById(id: number) {
        return await this.clientRepository.findById(id);
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
}
