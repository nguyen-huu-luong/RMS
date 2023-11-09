export interface ICustomerRepository {
    viewCustomers(): Promise<any>;
    createCustomer(data: any): Promise<any>;
}
