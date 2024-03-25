import { Table } from "../Models";
import { IBaseRepository } from "./IBaseRepository";

export interface ITableRepository extends IBaseRepository<Table> { 
    viewTables(floors: any): Promise<any>;
    createTable(table_name: any, floor: any): Promise<any>;
    findTable(table_name: any): Promise<any>;
    deleteTable(table_names: any): Promise<any>;
    updateNumRes(num: number, table_ids: any): Promise<any>;
}

