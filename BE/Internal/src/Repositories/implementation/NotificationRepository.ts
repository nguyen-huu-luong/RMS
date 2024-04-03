import { injectable } from "inversify";
import "reflect-metadata";
import { INotificationRepository } from "../INotificationRepository";
import { BaseRepository } from "./BaseRepository";
import Notification from "../../Models/Notification";

@injectable()
export class NotificationRepository
	extends BaseRepository<Notification>
	implements INotificationRepository
{
	constructor() {
		super(Notification);
	}

}
