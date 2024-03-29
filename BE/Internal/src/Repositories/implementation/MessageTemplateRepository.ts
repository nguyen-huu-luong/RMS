import { injectable } from "inversify";
import "reflect-metadata";
import { BaseRepository } from "./BaseRepository";
import { Messagetemplate } from "../../Models";
import Token from "../../Models/Token";
import { IMessageTemplateRepository } from "../IMessaggeTemplateRepository"

@injectable()
export class MessageTemplateRepository
	extends BaseRepository<Messagetemplate>
	implements IMessageTemplateRepository
{
	constructor() {
		super(Messagetemplate, ["id","name" ,"type","content","description", "createdAt", "updatedAt"]);
	}

	
}
