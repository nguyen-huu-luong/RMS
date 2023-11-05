import OrderController from '../controller/order.controller';

class OrderRouter {
    protected orderController: any = new OrderController();

    public initialize(router: any) {
        router.route('/order')
            .get(this.orderController.viewOrder)
            .post(this.orderController.createOrder)
            .put(this.orderController.updateOrder)
            .delete(this.orderController.deleteOrder);
    }
}


export default OrderRouter