import { injectable } from "inversify";
import "reflect-metadata";
import { IClientRepository } from "../IClientRepository";
import { BaseRepository } from "./BaseRepository";
import {Client} from "../../model/";

@injectable()
export class ClientRepository extends BaseRepository<Client> implements IClientRepository {
    constructor() {
        super(Client);
    }

    public async findByEmail(email: string): Promise<Client | null> {
        return await this._model.findOne({where: {email: email}})
    }

}
