import { injectable } from "inversify";
import "reflect-metadata";
import { IFloorRepository } from "../IFloorRepository";
import { BaseRepository } from "./BaseRepository";
import { Floor } from "../../Models";
@injectable()
export class FloorRepository
	extends BaseRepository<Floor>
	implements IFloorRepository
{
	constructor() {
		super(Floor);
	}

}
