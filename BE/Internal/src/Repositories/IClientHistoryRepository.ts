import { ClientHistory } from "../Models";
import { IBaseRepository } from "./IBaseRepository";

export interface IClientHistoryRepository extends IBaseRepository<ClientHistory> {
    findByCond(cond: any): Promise<any>;
}

