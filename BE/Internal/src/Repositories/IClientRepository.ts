import { Client } from "../Models";
import { IBaseRepository } from "./IBaseRepository";

export interface IClientRepository extends IBaseRepository<Client> {
    findByEmail(email : string) : Promise<Client | null> ;
    findByType(type : string) : Promise<Client[] | null> ;
    findByProfit(profit : number, voucherId: number) : Promise<any> ;
    removeToken(token: string, user: Client): Promise<Client> ;
    getMonthlyTopCustomer(): Promise<any> ;
    getYearlyTopCustomer(): Promise<any> ;
    getCustomTopCustomer(beginDate?: Date, endDate?:Date): Promise<any> ;
    getDailyConversion(): Promise<any>;
    getMonthlyConversion(): Promise<any>;
    getYearlyConversion(): Promise<any>;
    getConversionsByDate(beginDate?: Date, endDate?: Date): Promise<any>;
    getConversionChart(beginDate?: Date, endDate?: Date): Promise<any>;
    checkExist(phone: string, email:string): Promise<any> ;
    findByCond(cond: any): Promise<any> ;
    updateBaseCond(value: any, cond: any): Promise<any> ;
    deleteManyClients(ids: number[]): Promise<any>
}

