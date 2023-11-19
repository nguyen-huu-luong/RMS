import { Container } from "inversify";
import {OrderRepository} from "../Repositories/implementation/OrderRepository";
import { TYPES } from "../Repositories/type";
import {
	IOrderRepository,
	IClientRepository,
	IEmployeeRepository,
    EmployeeRepository,
	IProductRepository,
	ICartRepository,
    ITokenRepository,
    TokenRepository,
} from "../Repositories";
import { ClientRepository,  } from "../Repositories";
import { IPermissionRepository } from "../Repositories/IPermissionRepository";
import { PermissionRepository } from "../Repositories/implementation/PermissionRepository";
import { ProductRepository } from "../Repositories";
import { CartRepository } from "../Repositories";

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
		this.container.bind<IProductRepository>(TYPES.IProductRepository).to(ProductRepository);
		this.container.bind<ICartRepository>(TYPES.ICartRepository).to(CartRepository);
		this.container.bind<ITokenRepository>(TYPES.ITokenRepository).to(TokenRepository);
	}
}

const containerObj = new InversifyContainer();
export default containerObj.getContainer();;
