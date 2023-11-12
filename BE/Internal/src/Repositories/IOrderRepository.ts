export interface IOrderRepository {
    viewOrders(): Promise<any>;
    createOrder(data: any): Promise<any>;
    assignOrder(data: any): Promise<any>;
}
