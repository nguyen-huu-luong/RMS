import { injectable } from "inversify";
import "reflect-metadata";
import { BaseRepository } from "./BaseRepository";
import Channel from "../../Models/Channel";
import OpenEvent from "../../Models/OpenEvent";
import { IClickEventRepository } from "../IClickEventRepository";
import ClickEvent from "../../Models/ClickEvent";

@injectable()
export class ClickEventRepository
	extends BaseRepository<ClickEvent>
	implements IClickEventRepository
{
	constructor() {
		super(ClickEvent);
	}

}
