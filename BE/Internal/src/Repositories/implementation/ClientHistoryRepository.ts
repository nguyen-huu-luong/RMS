
import message from "../../Utils/Message";
import { injectable } from "inversify";
import "reflect-metadata";
import { BaseRepository } from "./BaseRepository";
import { ClientHistory } from "../../Models";
import { IClientHistoryRepository } from "../IClientHistoryRepository";

@injectable()
export class ClientHistoryRepository extends BaseRepository<ClientHistory> implements IClientHistoryRepository {
    constructor() {
        super(ClientHistory);
    }

}
