import { Container } from "inversify";
import OrderRepository from "../repository/implementation/order.repository";
import { ICustomerRepository } from "../repository/ICustomerRepository";
import { TYPES } from "../repository/type";
import { CustomerRepository } from "../repository/implementation/customer.repository";
import { IOrderRepository } from "../repository/IOrderRepository";

class InversifyContainer {
    private container ;

    constructor() {
        this.container = new Container()
    } 

    public getContainer(): Container {
        this.register()
        return this.container;
    }

    public register() {
        // register repository here
        this.container.bind<ICustomerRepository>(TYPES.ICustomerRepository).to(CustomerRepository)
        this.container.bind<IOrderRepository>(TYPES.IOrderRepository).to(OrderRepository)
    }
}

const containerObj = new InversifyContainer()
const container = containerObj.getContainer()
export default container;
