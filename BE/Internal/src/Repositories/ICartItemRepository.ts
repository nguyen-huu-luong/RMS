import { CartItem } from "../Models";
import { IBaseRepository } from "./IBaseRepository";

export interface ICartItemRepository extends IBaseRepository<CartItem> {  
    findByCond( cond: any): Promise<any>;
    updateItems( cond: any, data: any): Promise<any>;
}

