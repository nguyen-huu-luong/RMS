import { injectable } from "inversify";
import "reflect-metadata";
import { ICartItemRepository } from "../ICartItemRepository";
import { BaseRepository } from "./BaseRepository";
import { CartItem } from "../../Models";
import message from "../../Utils/Message";

@injectable()
export class CartItemRepository
	extends BaseRepository<CartItem>
	implements ICartItemRepository
{
	constructor() {
		super(CartItem);
	}

	public async findByCond( cond: any) {
		try {
			let items = await this._model.findAll({
				where: cond
			})
	
			return items
		}
		catch (err) {
			message.queryError(err);
		}
	}

	public async updateItems( cond: any, data: any) {
		try {
			await this._model.update(data, {
				where: cond
			})
	
		}
		catch (err) {
			message.queryError(err);
		}
	}
}
