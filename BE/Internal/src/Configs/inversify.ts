import { Container } from "inversify";
import {OrderRepository} from "../Repositories/implementation/OrderRepository";
import { TYPES } from "../Repositories/type";
import {
	IOrderRepository,
	IClientRepository,
	IEmployeeRepository,
    EmployeeRepository,
} from "../Repositories";
import { ClientRepository,  } from "../Repositories";

class InversifyContainer {
	private container;

	constructor() {
		this.container = new Container();
	}

	public getContainer(): Container {
		this.register();
		return this.container;
	}

	public register() {
		// register repository here
		this.container.bind<IClientRepository>(TYPES.IClientRepository).to(ClientRepository);
		this.container.bind<IOrderRepository>(TYPES.IOrderRepository).to(OrderRepository);
		this.container.bind<IEmployeeRepository>(TYPES.IEmployeeRepository).to(EmployeeRepository);
	}
}

const containerObj = new InversifyContainer();
export default containerObj.getContainer();;
