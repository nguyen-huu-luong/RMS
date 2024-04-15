import { Client } from "../Models";
import { IBaseRepository } from "./IBaseRepository";

export interface IClientRepository extends IBaseRepository<Client> {
    findByEmail(email : string) : Promise<Client | null> ;
    removeToken(token: string, user: Client): Promise<Client> ;
    getMonthlyTopCustomer(): Promise<any> ;
    getYearlyTopCustomer(): Promise<any> ;
    getCustomTopCustomer(beginDate?: Date, endDate?:Date): Promise<any> ;

}

