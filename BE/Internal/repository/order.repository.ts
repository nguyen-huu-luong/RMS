import Order from "../model/order";
import Customer from "../model/customer";
import message from "../define/message";

class OrderRepository {
    protected order: any;
    protected customer: any

    constructor() {
        this.order = Order;
        this.customer = Customer
    }

    public async viewOrders() {
        try {
            const allCustomer: any = await this.order.findAll();
            return JSON.stringify(allCustomer)
        }
        catch (err) {
            message.queryError(err);
        }
    }

    public async createOrder(data: any) {
        try {
            await this.order.create(data);
        }
        catch (err) {
            message.queryError(err);
        }
    }

    public async assignOrder(data: any) {
        try {
            const orderId = data.order;
            const userId = data.user;
            const order: any = await this.order.findOne({
                where: {
                    id: orderId
                }
            })
            const user: any = await this.customer.findOne({
                where: {
                    id: userId
                }
            })
            await order.setCustomer(user);
        }
        catch (err) {
            message.queryError(err);
        }
    }
}

export default OrderRepository;