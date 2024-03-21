import { Floor } from "../Models";
import { IBaseRepository } from "./IBaseRepository";

export interface IFloorRepository extends IBaseRepository<Floor> {
    createFloor(floor_name: any): Promise<any>;
    findFloor(floor_name: any): Promise<any>;
    findOne(floor_name: any): Promise<any>;
    findAllFloor(): Promise<any>
    deleteFloor(table_names: any): Promise<any>;
}