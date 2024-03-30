import { injectable } from "inversify";
import "reflect-metadata";
import { ICartRepository } from "../ICartRepository";
import { BaseRepository } from "./BaseRepository";
import { Cart, CartItem, Product } from "../../Models";
import message from "../../Utils/Message";

@injectable()
export class CartRepository
    extends BaseRepository<Cart>
    implements ICartRepository
{
    constructor() {
        super(Cart);
    }
    public async getCart(userId: number) {
        try {
            const cart = await this._model.findOne({
                where: {
                    clientId: userId,
                },
            });
            return cart;
        } catch (err) {
            message.queryError(err);
        }
    }

    public async getCartTable(tableId: number) {
        try {
            const cart = await this._model.findOne({
                where: {
                    tableId: tableId,
                },
            });
            return cart;
        } catch (err) {
            message.queryError(err);
        }
    }
}
