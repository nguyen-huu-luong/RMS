import Order from "../../model/order";
import Customer from "../../model/Client";
import message from "../../define/message";
import { injectable } from "inversify";
import "reflect-metadata";
import { IOrderRepository } from "../IOrderRepository";

@injectable()
class OrderRepository implements IOrderRepository {
    
    public async viewOrders() {
        try {
            const allOrder = await Order.findAll();
            return JSON.stringify(allOrder)
        }
        catch (err) {
            message.queryError(err);
        }
    }

    public async createOrder(data: any) {
        try {
            const order = await Order.create(data);
            console.log(order.getDataValue('id'))
        }
        catch (err) {
            message.queryError(err);
        }
    }

    public async assignOrder(data: any) {
        try {
            const orderId = data.order;
            const userId = data.user;
            const order = await Order.findOne({
                where: {
                    id: orderId
                }
            })
            const user = await Customer.findOne({
                where: {
                    id: userId
                }
            })
            if (order && user) {
                // await order.setCustomer(user);
            }
        }
        catch (err) {
            message.queryError(err);
        }
    }
}

export default OrderRepository;