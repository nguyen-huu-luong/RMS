import { Container } from "inversify";
import OrderRepository from "../repository/implementation/OrderRepository";
import { TYPES } from "../repository/type";
import { IOrderRepository } from "../repository/IOrderRepository";
import { IClientRepository } from "../repository/IClientRepository";
import { ClientRepository } from "../repository/implementation/ClientRepository";
import { EmployeeRepository } from "../repository/implementation/EmployeeRepository";
import { IEmployeeRepository } from "../repository/IEmployeeRepository";

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
        this.container.bind<IClientRepository>(TYPES.IClientRepository).to(ClientRepository)
        this.container.bind<IOrderRepository>(TYPES.IOrderRepository).to(OrderRepository)
        this.container.bind<IEmployeeRepository>(TYPES.IEmployeeRepository).to(EmployeeRepository)
        // this.container.bind<IBaseRepository>(TYPES.IBaseRepository).to(BaseRepository)
    }
}

const containerObj = new InversifyContainer()
const container = containerObj.getContainer()
export default container;
