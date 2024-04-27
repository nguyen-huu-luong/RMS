import { Order } from "../Models";
import { IBaseRepository } from "./IBaseRepository";
export interface IOrderRepository extends IBaseRepository<Order> { 
    viewOrders(userId: number): Promise<any>;
    updateStatus(data: any): Promise<any>;
    getOne(userId?: number, orderId?:number): Promise<any>;
    createOrder(userId: number, data: any): Promise<any>;
    getDailyOrder(): Promise<any>;
    getMonthlyOrder(): Promise<any>;
    getYearlyOrder(): Promise<any>;
    getOrdersByDate(beginDate?: Date, endDate?: Date): Promise<any>;
    getYearlyTopProduct(): Promise<any>;
    getMonthlyTopProduct(): Promise<any>;
    getCustomTopProduct(beginDate?: Date, endDate?: Date): Promise<any>;
    getChart(beginDate?: Date, endDate?: Date): Promise<any>;
    getByCond(cond: any): Promise<any>;
} 
