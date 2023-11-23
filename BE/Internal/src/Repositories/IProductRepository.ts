import { Product } from "../Models";
import { IBaseRepository } from "./IBaseRepository";

export interface IProductRepository extends IBaseRepository<Product> {
}

