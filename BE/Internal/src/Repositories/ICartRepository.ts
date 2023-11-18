import { promises } from "dns";
import { Cart } from "../Models";
import { IBaseRepository } from "./IBaseRepository";

export interface ICartRepository extends IBaseRepository<Cart> {  
    // findById(id: number, attributes?: string[]): Promise<M>;
    // create(data: any): Promise<M>;
    // update(id: number, data: any): Promise<M>;
    // delete(id: number): Promise<boolean>;
    getCart(userId: number): Promise<any>;
    addProduct(userId: number, data: any): Promise<any>;
    removeProduct(userId: number, data: any): Promise<any>;
    updateProduct(userId: number, data: any): Promise<any>;
    getCartItems(userId: number): Promise<any>;
}

