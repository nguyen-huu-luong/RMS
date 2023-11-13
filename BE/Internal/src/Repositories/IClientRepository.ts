import { Client } from "../Models";
import { IBaseRepository } from "./IBaseRepository";

export interface IClientRepository extends IBaseRepository {
    findByEmail(email : string) : Promise<Client | null> ;
}

