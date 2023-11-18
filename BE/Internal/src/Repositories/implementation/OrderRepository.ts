import Order from "../../Models/Order";
import Customer from "../../Models/Client";
import Cart from "../../Models/Cart";
import { CartItem, OrderItem, Product } from "../../Models";
import message from "../../Utils/Message";
import { injectable } from "inversify";
import "reflect-metadata";
import { IOrderRepository } from "../IOrderRepository";
import { BaseRepository } from "./BaseRepository";
@injectable()
export class OrderRepository
    extends BaseRepository<Order>
    implements IOrderRepository
{
    public async viewOrders(userId: number) {
        try {
            const allOrders = await Order.findAll({where:{
                clientId: userId
            }});
            return JSON.stringify(allOrders);
        } catch (err) {
            message.queryError(err);
        }
    }

    public async adminViewOrders() {
        try {
            const allOrders = await Order.findAll({});
            return JSON.stringify(allOrders);
        } catch (err) {
            message.queryError(err);
        }
    }

    public async createOrder(userId: number, data: any) {
        try {
            const order = await Order.create({...data, clientId: userId});
            const cart = await Cart.findOne({
                where: { clientId: userId },
            });
            await order.update({
                num_items: cart?.getDataValue("total"),
                amount: cart?.getDataValue("amount"),
            });
            const cartItems = await CartItem.findAll({
                where: { cartId: cart?.getDataValue("id") },
            });
            await Promise.all(
                cartItems.map(async (cartItem) => {
                    await OrderItem.create({
                        orderId: order.getDataValue("id"),
                        productId: cartItem.getDataValue("productId"),
                        quantity: cartItem.getDataValue("quantity"),
                        amount: cartItem.getDataValue("amount"),
                    });
                })
            );
            await CartItem.destroy({
                where: { cartId: cart?.getDataValue("id") },
            });
            await cart?.update({
                total: 0,
                amount: 0,
                updatedAt: new Date()
            });
            return await order.save();
        } catch (err) {
            message.queryError(err);
        }
    }
    public async adminCreateOrder(data: any) {
        try {
            const {products, ...orderData} = data;
            const clientId = orderData.clientId;
            const order = await Order.create(orderData);
            await Promise.all(
                products.map(async (item: any) => {
                    let product = await Product.findByPk(item.productId)
                    await OrderItem.create({
                        orderId: order.getDataValue("id"),
                        productId: item.productId,
                        quantity: item.quantity,
                        amount: product?.getDataValue("price") * item.quantity,
                    });
                })
            );
            const orderItems = await OrderItem.findAll({
                where: {
                    orderId: order.getDataValue("id"),
                },
            });
            const totalItems = orderItems.reduce(
                (total, orderItems) =>
                    total + orderItems.getDataValue("quantity"),
                0
            );
            const totalAmount = orderItems.reduce(
                (sum, orderItems) => sum + orderItems.getDataValue("amount"),
                0
            );
            await order.update({ num_items: totalItems, amount: totalAmount });
            return await order.save();
        } catch (err) {
            message.queryError(err);
        }
    }
    public async updateStatus(data: any) {
        try {
            const orderId = data.orderId;
            const status = data.status;
            const order = await Order.findOne({
                where: {
                    id: orderId,
                },
            });
            await order?.update({ status: status });
            return await order?.save();
        } catch (err) {
            message.queryError(err);
        }
    }
    public async removeOrder(orderId: number) {
        try {
            const order = await Order.findOne({
                where: {
                    id: orderId,
                },
            });
            return await order?.destroy();
        } catch (err) {
            message.queryError(err);
        }
    }
}
