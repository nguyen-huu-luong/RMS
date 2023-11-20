import { CartItem } from "../Models";
import { IBaseRepository } from "./IBaseRepository";

export interface ICartItemRepository extends IBaseRepository<CartItem> {
    createItem(data: any): Promise<any>;
    getAll(cartId: number): Promise<any>;
    getOne(cartId: number, productId: number): Promise<any>;
    deleteOne(cartId: number, productId: number): Promise<any>;
    updateOne(cartId: number, productId: number, data:any): Promise<any>;
    deleteAll(cartId: number): Promise<any>;
}
