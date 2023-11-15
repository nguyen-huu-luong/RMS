import { Client } from "../Models";
import { IBaseRepository } from "./IBaseRepository";

export interface IClientRepository extends IBaseRepository<Client> {
    findByEmail(email : string) : Promise<Client | null> ;
    removeToken(token: string, user: Client): Promise<Client> ;
    clearTokens(userId: number): Promise<any> ;

}

