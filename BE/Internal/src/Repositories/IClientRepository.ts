import { Client } from "../Models";
import { IBaseRepository } from "./IBaseRepository";

export interface IClientRepository extends IBaseRepository<Client> {
    findByEmail(email : string) : Promise<Client | null> ;
    findByType(type : string) : Promise<Client[] | null> ;
    findByProfit(profit : number) : Promise<Client[] | null> ;
    removeToken(token: string, user: Client): Promise<Client> ;
    checkExist(phone: string, email:string): Promise<any> ;
    findByCond(cond: any): Promise<any> ;
    updateBaseCond(value: any, cond: any): Promise<any> ;
}

