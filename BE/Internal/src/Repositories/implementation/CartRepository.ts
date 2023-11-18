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
    public async addProduct(data: any) {
        try {
            const cartId = data.cartId;
            const productId = data.productId;
            const quantity = data.quantity;
            const [cartItem] = await CartItem.findOrCreate({
                where: {
                    cartId: cartId,
                    productId: productId,
                }
            });
			const product = await Product.findByPk(productId)
            if (!cartItem.isNewRecord) {
                await cartItem.update({
                    quantity: cartItem.getDataValue("quantity") + quantity,
					amount: (cartItem.getDataValue("quantity") + quantity) * product?.getDataValue('price')
                });
            }
			await this.updateCart(cartId);
            return await cartItem.save()
        } catch (err) {
            message.queryError(err);
        }
    }
    public async removeProduct(data: any) {
        try {
            const cartId = data.cartId;
            const productId = data.productId;
            const cartItem = await CartItem.findOne({
                where: {
                    cartId: cartId,
                    productId: productId,
                },
            });
            await cartItem?.destroy();
			await this.updateCart(cartId);
        } catch (err) {
            message.queryError(err);
        }
    }
    public async updateProduct(data: any) {
        try {
            const cartId = data.cartId;
            const productId = data.productId;
            const quantity = data.quantity;
            const cartItem = await CartItem.findOne({
                where: {
                    cartId: cartId,
                    productId: productId,
                },
            });
			const product = await Product.findByPk(productId)
            if (quantity === 0) {
                await this.removeProduct(data);
            } else {
                await cartItem?.update({
                    quantity: quantity,
					amount: quantity * product?.getDataValue('price')
                });
            }
			await this.updateCart(cartId);
        } catch (err) {
            message.queryError(err);
        }
    }
    public async getCartItems(data: any) {
        try {
            const cartId = data.cartId;
            const cartItem = await CartItem.findAll({
                where: {
                    cartId: cartId,
                },
            });

            return JSON.stringify(cartItem);
        } catch (err) {
            message.queryError(err);
        }
    }
    public async updateCart(cartId: number) {
        try {
            const cartItems = await CartItem.findAll({
                where: {
                    cartId: cartId,
                },
            });
            const totalItems = cartItems.reduce((total, cartItems) => total + cartItems.getDataValue('quantity'), 0);
			const totalAmount = cartItems.reduce((sum, cartItems) => sum + cartItems.getDataValue('amount'), 0);
			const cart = await this.findById(cartId);
			await cart.update({total: totalItems, amount: totalAmount });
            return;
        } catch (err) {
            message.queryError(err);
        }
    }
}
