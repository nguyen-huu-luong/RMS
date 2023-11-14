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
import { IPermissionRepository } from "../Repositories/IPermissionRepository";
import { PermissionRepository } from "../Repositories/implementation/PermissionRepository";

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
		this.container.bind<IPermissionRepository>(TYPES.IPermissionRepository).to(PermissionRepository);
	}
}

const containerObj = new InversifyContainer();
export default containerObj.getContainer();;
