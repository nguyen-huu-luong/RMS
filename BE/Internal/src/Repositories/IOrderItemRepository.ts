import { OrderItem } from "../Models";
import { IBaseRepository } from "./IBaseRepository";
export interface IOrderItemRepository extends IBaseRepository<OrderItem> { 
    getBestSeller(num_product: number, order_vaid: any): Promise<any>;
    findByCond(cond: any): Promise<any>;
} 
