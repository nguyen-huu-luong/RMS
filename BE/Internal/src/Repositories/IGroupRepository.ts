import Group from "../Models/Group";
import { IBaseRepository } from "./IBaseRepository";

export interface IGroupRepository extends IBaseRepository<Group> {  
    findByCond(cond: any) : Promise<any>;
    getTotalPerGroup() : Promise<any>;
}

