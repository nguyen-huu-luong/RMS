import Category from "../Models/Category";
import { IBaseRepository } from "./IBaseRepository";

export interface ICategoryRepository extends IBaseRepository<Category> { 
    getByCond(cond: any): Promise<any>;
}

