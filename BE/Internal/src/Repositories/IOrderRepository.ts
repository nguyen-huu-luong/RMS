import { Cart } from "../Models";
import { IBaseRepository } from "./IBaseRepository";
export interface IOrderRepository extends IBaseRepository<Cart> { 
    viewOrders(): Promise<any>;
    createOrder(data: any): Promise<any>;
    removeOrder(orderId: number): Promise<any>;
    updateStatus(data: any): Promise<any>;
}
