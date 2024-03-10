import { injectable } from "inversify";
import "reflect-metadata";
import { IMessageRepository } from "../IMessageRepository";
import { BaseRepository } from "./BaseRepository";
import Message from "../../Models/Message";

@injectable()
export class MessageRepository
	extends BaseRepository<Message>
	implements IMessageRepository
{
	constructor() {
		super(Message);
	}

}
