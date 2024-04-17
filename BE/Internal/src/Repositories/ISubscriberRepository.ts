import { Subscriber } from "../Models";
import { IBaseRepository } from "./IBaseRepository";

export interface ISubscriberRepository extends IBaseRepository<Subscriber> {
    findByCond(cond: any): Promise<any>;  
}

