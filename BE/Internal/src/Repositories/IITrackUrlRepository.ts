import { Floor } from "../Models";
import TrackUrl from "../Models/TrackUrl";
import { IBaseRepository } from "./IBaseRepository";

export interface ITrackUrlRepository extends IBaseRepository<TrackUrl> {
    findByCode(code:string): Promise<any>
}