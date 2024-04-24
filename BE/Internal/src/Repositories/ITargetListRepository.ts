import TargetList from "../Models/Targetlist";
import Token from "../Models/Token";
import { IBaseRepository } from "./IBaseRepository";

interface ITargetListRepository extends IBaseRepository<TargetList> {
   getIds(): Promise<number[]>
}

export {ITargetListRepository}