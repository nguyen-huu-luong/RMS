import { Model } from "sequelize";
import { QueryOptions } from "../Types/type";

interface IBaseRepository<M extends Model> {
    all(options?: QueryOptions): Promise<M[]>;
  
    findById(id: number, attributes?: string[]): Promise<M>;

    getById(id: number, attributes?: string[]): Promise<M | null>
  
    create(data: any): Promise<M>;
  
    update(id: number, data: any): Promise<M>;
  
    delete(id: number): Promise<boolean>;
  }
  
  export { IBaseRepository };