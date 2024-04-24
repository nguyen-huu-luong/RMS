import { injectable } from "inversify";
import "reflect-metadata";
import { BaseRepository } from "./BaseRepository";
import Channel from "../../Models/Channel";
import OpenEvent from "../../Models/OpenEvent";
import { IOpenEventrRepository } from "../IOpenEventRepository";

@injectable()
export class OpenEventRepository
	extends BaseRepository<OpenEvent>
	implements IOpenEventrRepository
{
	constructor() {
		super(OpenEvent);
	}

}
