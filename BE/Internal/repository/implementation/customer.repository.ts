import Customer from "../../model/customer";
import message from "../../define/message";
import { injectable } from "inversify";
import "reflect-metadata";
import { ICustomerRepository } from "../ICustomerRepository";

@injectable()
export class CustomerRepository implements ICustomerRepository {
    
    public async viewCustomers() {
        try {
            const allCustomer = await Customer.findAll();
            return JSON.stringify(allCustomer)
        }
        catch (err) {
            message.queryError(err);
        }
    }

    public async createCustomer(data: any) {
        try {
            await Customer.create(data);
        }
        catch (err) {
            message.queryError(err);
        }
    }
}
