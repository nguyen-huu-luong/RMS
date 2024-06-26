import { Product } from "../Models";
import { IBaseRepository } from "./IBaseRepository";

export interface IProductRepository extends IBaseRepository<Product> {
    findByCond(cond: any) : Promise<any> ;
    getOne(id: number  | string): Promise<Product |  null>;
    findByName(name_pattern: any) : Promise<any> ;
}

