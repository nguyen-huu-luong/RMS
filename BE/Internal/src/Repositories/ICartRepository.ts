import { Cart } from "../Models";
import { IBaseRepository } from "./IBaseRepository";

export interface ICartRepository extends IBaseRepository<Cart> {  
    getCart(userId: number): Promise<any>;
    getCartTable(tableId: number): Promise<any>;
    findByCond(condition: any): Promise<any>;
}

