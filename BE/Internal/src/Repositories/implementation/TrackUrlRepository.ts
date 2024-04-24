import Customer from "../../Models/Client";
import message from "../../Utils/Message";
import { injectable } from "inversify";
import "reflect-metadata";
import { BaseRepository } from "./BaseRepository";
import { Employee } from "../../Models";
import { IEmployeeRepository } from "../IEmployeeRepository";
import TrackUrl from "../../Models/TrackUrl";
import { ITrackUrlRepository } from "../IITrackUrlRepository";

@injectable()
export class TrackUrlRepository extends BaseRepository<TrackUrl> implements ITrackUrlRepository {
    constructor() {
        super(TrackUrl);
    }

    public async findByCode(code: string) {
        return await this._model.findOne({where: {codeToInsert: code}})
    } 



    
}
