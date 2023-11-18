import { Cart } from "../Models";
import { IBaseRepository } from "./IBaseRepository";

export interface ICartRepository extends IBaseRepository<Cart> {  
    // findById(id: number, attributes?: string[]): Promise<M>;
    // create(data: any): Promise<M>;
    // update(id: number, data: any): Promise<M>;
    // delete(id: number): Promise<boolean>;
    addProduct(data: any): Promise<any>;
    removeProduct(data: any): Promise<any>;
    updateProduct(data: any): Promise<any>;
    getCartItems(data: any): Promise<any>;
}

