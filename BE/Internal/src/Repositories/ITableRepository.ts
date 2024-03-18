import { Table } from "../Models";
import { IBaseRepository } from "./IBaseRepository";

export interface ITableRepository extends IBaseRepository<Table> { 
    viewTables(floors: any): Promise<any>;
}

