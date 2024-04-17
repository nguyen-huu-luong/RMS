import { injectable } from "inversify";
import "reflect-metadata";
import { ISubscriberRepository } from "../ISubscriberRepository";
import { BaseRepository } from "./BaseRepository";
import { Subscriber } from "../../Models";
@injectable()
export class SubscriberRepository
	extends BaseRepository<Subscriber>
	implements ISubscriberRepository
{
	constructor() {
		super(Subscriber);
	}

	public async findByCond(cond: any) {
		return await this._model.findAll(cond)
	}
}
