import { OrderItem } from "../Models";
import { IBaseRepository } from "./IBaseRepository";

export interface IOrderItemRepository extends IBaseRepository<OrderItem> {
    createItem(data: any): Promise<any>;
    getAll(orderId: number): Promise<any>;
    getOne(orderId: number, productId: number): Promise<any>;
    deleteOne(orderId: number, productId: number): Promise<any>;
    updateOne(orderId: number, productId: number, data:any): Promise<any>;
}
