import Customer from "../model/customer";
import message from "../define/message";

class CustomerRepository {
    protected customer: any;

    constructor() {
        this.customer = Customer;
    }

    public async viewCustomers() {
        try {
            const allCustomer: Customer = await this.customer.findAll();
            return JSON.stringify(allCustomer)
        }
        catch (err) {
            message.queryError(err);
        }
    }

    public async createCustomer(data: any) {
        try {
            await this.customer.create(data);
        }
        catch (err) {
            message.queryError(err);
        }
    }
}

export default CustomerRepository;