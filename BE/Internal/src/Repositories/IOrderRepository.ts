import { Cart } from "../Models";
import { IBaseRepository } from "./IBaseRepository";
export interface IOrderRepository extends IBaseRepository<Cart> { 
    viewOrders(userId: number): Promise<any>;
    createOrder(userId:number, data: any): Promise<any>;
    adminCreateOrder(data: any): Promise<any>;
    removeOrder(orderId: number): Promise<any>;
    updateStatus(data: any): Promise<any>;
    adminViewOrders(): Promise<any>;
}
