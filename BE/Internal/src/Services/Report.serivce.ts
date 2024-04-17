import { ErrorName, HttpStatusCode } from "../Constants";
import { container } from "../Configs";
import { ChartQueryOptions, QueryOptions, TYPES } from "../Types/type";
import { IOrderRepository } from "../Repositories/IOrderRepository";
import { IClientRepository, IProductRepository } from "../Repositories";

export class ReportService {
    constructor(
        private orderRepository = container.get<IOrderRepository>(
            TYPES.IOrderRepository
        ),
        private productRepository = container.get<IProductRepository>(
            TYPES.IProductRepository
        ),
        private clientRepository = container.get<IClientRepository>(
            TYPES.IClientRepository
        )
    ) { }

    public async getProfit(options?: ChartQueryOptions) {
        if (options?.type === "DAILY"){
            const { todayOrders, yesterdayOrders } = await this.orderRepository.getDailyOrder();
            const todayProfit = todayOrders.reduce((amount: number, order: any) => amount + order.amount, 0);
            const yesterdayProfit = yesterdayOrders.reduce((amount: number, order: any) => amount + order.amount, 0);
            return {
                now: todayProfit,
                before: yesterdayProfit
            }
        } else if (options?.type === "MONTHLY"){
            const { currentMonthOrders, lastMonthOrders } = await this.orderRepository.getMonthlyOrder();
            const currentMonthProfit = currentMonthOrders.reduce((amount: number, order: any) => amount + order.amount, 0);
            const lastMonthProfit = lastMonthOrders.reduce((amount: number, order: any) => amount + order.amount, 0);
            return {
                now: currentMonthProfit,
                before: lastMonthProfit
            };
        } else if (options?.type === "YEARLY"){
            const { currentYearOrders, lastYearOrders } = await this.orderRepository.getYearlyOrder();
            const currentYearProfit = currentYearOrders.reduce((amount: number, order: any) => amount + order.amount, 0);
            const lastYearProfit = lastYearOrders.reduce((amount: number, order: any) => amount + order.amount, 0);
            return {
                now: currentYearProfit,
                before: lastYearProfit
            };
        } else if (options?.type === "CUSTOM"){
            const { orders } = await this.orderRepository.getOrdersByDate(options.beginDate, options.endDate)
            const profit = orders.reduce((amount: number, order: any) => amount + order.amount, 0);
            return {
                now: profit,
                before: 0
            }
        }
    }

    public async getLead(options?: ChartQueryOptions) {

    }

    public async getProductChart(options?: ChartQueryOptions) {
        if (options?.type === "MONTHLY"){
            const topProducts = await this.orderRepository.getMonthlyTopProduct();
            const topProductDetails = await Promise.all(topProducts.map(async ([productId, quantity, indexChange]: [number, number, number]) => {
                const product = await this.productRepository.findById(productId);
                return { product, quantity, indexChange };
            }));
            return {
                topProducts: topProductDetails
            };
        } else if (options?.type === "YEARLY"){
            const topProducts = await this.orderRepository.getYearlyTopProduct();
            const topProductDetails = await Promise.all(topProducts.map(async ([productId, quantity, indexChange]: [number, number, number]) => {
                const product = await this.productRepository.findById(productId);
                return { product, quantity, indexChange };
            }));
            return {
                topProducts: topProductDetails
            };
        } else if (options?.type === "CUSTOM"){
            const topProducts = await this.orderRepository.getCustomTopProduct(options.beginDate, options.endDate);
            const topProductDetails = await Promise.all(topProducts.map(async ([productId, quantity]: [number, number]) => {
                const product = await this.productRepository.findById(productId);
                return { product, quantity };
            }));
            return {
                topProducts: topProductDetails
            };
        }
    }

    public async getCustomerChart(options?: ChartQueryOptions) {
        if (options?.type === "MONTHLY"){
            const topCustomer = await this.clientRepository.getMonthlyTopCustomer();
            const topCustomerDetails = await Promise.all(topCustomer.map(async ([clientId, amount, indexChange]: [number, number, number]) => {
                const client = await this.clientRepository.findById(clientId);
                return { client, amount, indexChange };
            }));
            return {
                topCustomer: topCustomerDetails
            };
        } else if (options?.type === "YEARLY"){
            const topCustomer = await this.clientRepository.getYearlyTopCustomer();
            const topCustomerDetails = await Promise.all(topCustomer.map(async ([clientId, amount, indexChange]: [number, number, number]) => {
                const client = await this.clientRepository.findById(clientId);
                return { client, amount, indexChange };
            }));
            return {
                topCustomer: topCustomerDetails
            };
        } else if (options?.type === "CUSTOM"){
            const topCustomer = await this.clientRepository.getCustomTopCustomer(options.beginDate, options.endDate);
            const topCustomerDetails = await Promise.all(topCustomer.map(async ([clientId, amount]: [number, number]) => {
                const client = await this.clientRepository.findById(clientId);
                return { client, amount };
            }));
            return {
                topCustomer: topCustomerDetails
            };
        }
    }
}
