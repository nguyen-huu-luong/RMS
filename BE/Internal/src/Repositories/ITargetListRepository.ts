import TargetList from "../Models/Targetlist";
import Token from "../Models/Token";
import { IBaseRepository } from "./IBaseRepository";

interface ITargetListRepository extends IBaseRepository<TargetList> {
   getIds(): Promise<number[]>
   getSubscriber(id: number | string): Promise<any>
   addSubscriber(id: number | string): Promise<any>
}

export {ITargetListRepository}