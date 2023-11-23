import { Model } from "sequelize";

interface IBaseRepository<M extends Model> {
    all(attributes?: string[]): Promise<M[]>;
  
    findById(id: number, attributes?: string[]): Promise<M>;
  
    create(data: any): Promise<M>;
  
    update(id: number, data: any): Promise<M>;
  
    delete(id: number): Promise<boolean>;
  }
  
  export { IBaseRepository };