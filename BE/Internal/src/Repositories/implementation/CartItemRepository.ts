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
    public async createItem(data: any) {
        try {
            const [cartItem] = await this._model.findOrCreate({
                where: {
                    cartId: data.cartId,
                    productId: data.productId,
                },
            });
            if (!cartItem.isNewRecord) {
                await cartItem.update({
                    quantity: cartItem.getDataValue("quantity") + data.quantity,
                    amount:
                        (cartItem.getDataValue("quantity") + data.quantity) *
                        data.price,
                });
            }
            return await cartItem.save();
        } catch (err) {
            message.queryError(err);
        }
    }
    public async getAll(cartId: number) {
        try {
            return await this._model.findAll({
                where: { cartId: cartId },
                order: [["createdAt", "DESC"]],
            });
        } catch (err) {
            message.queryError(err);
        }
    }
    public async deleteAll(cartId: number) {
        try {
            return await this._model.destroy({
                where: { cartId: cartId },
            });
        } catch (err) {
            message.queryError(err);
        }
    }
    public async getOne(cartId: number, productId: number) {
        try {
            return await this._model.findOne({
                where: { cartId: cartId, productId: productId },
            });
        } catch (err) {
            message.queryError(err);
        }
    }
    public async deleteOne(cartId: number, productId: number) {
        try {
            const cartItem = await this._model.findOne({
                where: { cartId: cartId, productId: productId },
            });
            await cartItem?.destroy();
            return;
        } catch (err) {
            message.queryError(err);
        }
    }
    public async updateOne(cartId: number, productId: number, data: any) {
        try {
            const cartItem = await this._model.findOne({
                where: { cartId: cartId, productId: productId },
            });
            await cartItem?.update({
                amount: data.amount,
                quantity: data.quantity,
            });
            return;
        } catch (err) {
            message.queryError(err);
        }
    }
}
