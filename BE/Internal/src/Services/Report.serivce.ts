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
        let profitNow = 0;
        let profitBefore = 0;
        let orderNow = 0;
        let orderBefore = 0;
    
        if (options?.type === "DAILY") {
            const { todayOrders, yesterdayOrders } = await this.orderRepository.getDailyOrder();
            profitNow = todayOrders.reduce((amount: number, order: any) => amount + order.amount, 0);
            profitBefore = yesterdayOrders.reduce((amount: number, order: any) => amount + order.amount, 0);
            orderNow = todayOrders.length;
            orderBefore = yesterdayOrders.length;
        } else if (options?.type === "MONTHLY") {
            const { currentMonthOrders, lastMonthOrders } = await this.orderRepository.getMonthlyOrder();
            profitNow = currentMonthOrders.reduce((amount: number, order: any) => amount + order.amount, 0);
            profitBefore = lastMonthOrders.reduce((amount: number, order: any) => amount + order.amount, 0);
            orderNow = currentMonthOrders.length;
            orderBefore = lastMonthOrders.length;
        } else if (options?.type === "YEARLY") {
            const { currentYearOrders, lastYearOrders } = await this.orderRepository.getYearlyOrder();
            profitNow = currentYearOrders.reduce((amount: number, order: any) => amount + order.amount, 0);
            profitBefore = lastYearOrders.reduce((amount: number, order: any) => amount + order.amount, 0);
            orderNow = currentYearOrders.length;
            orderBefore = lastYearOrders.length;
        } else if (options?.type === "CUSTOM") {
            const { orders } = await this.orderRepository.getOrdersByDate(options.beginDate, options.endDate);
            profitNow = orders.reduce((amount: number, order: any) => amount + order.amount, 0);
            orderNow = orders.length;
        }
    
        return {
            profit: {
                now: profitNow,
                before: profitBefore,
            },
            orders: {
                now: orderNow,
                before: orderBefore,
            },
        };
    }

    public async getLead(options?: ChartQueryOptions) {

    }

    public async getChart(options?: ChartQueryOptions) {
        if (options?.type === "MONTHLY"){
            const today = new Date();
            const startOfMonth = new Date(
                today.getFullYear(),
                today.getMonth(),
                2
            );
            const endOfMonth = today;
            const chart = await this.orderRepository.getChart(startOfMonth, endOfMonth);
            return chart;
        } else if (options?.type === "YEARLY"){
            const today = new Date();
            const startOfYear = new Date(today.getFullYear(), 0, 1);
            const endOfYear = today;
            const chart = await this.orderRepository.getChart(startOfYear, endOfYear);
            return chart;
        } else if (options?.type === "CUSTOM"){
            const chart = await this.orderRepository.getChart(options.beginDate, options.endDate);
            return chart;
        }
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
