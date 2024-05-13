import { injectable } from "inversify";
import "reflect-metadata";
import { IPos_notificationRepository } from "../IPos_notificationRepository";
import { BaseRepository } from "./BaseRepository";
import Pos_notification from "../../Models/Pos_notification";

@injectable()
export class Pos_notificationRepository
	extends BaseRepository<Pos_notification>
	implements IPos_notificationRepository
{
	constructor() {
		super(Pos_notification);
	}

}
