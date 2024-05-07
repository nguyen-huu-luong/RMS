import { ErrorName, HttpStatusCode } from "../Constants";
import { container } from "../Configs";
import { QueryOptions, TYPES } from "../Types/type";
import { IOrderRepository } from "../Repositories/IOrderRepository";
import { CustomError, RecordNotFoundError } from "../Errors";
import { IEmployeeRepository } from "../Repositories";
import PasswordUtil from "../Utils/Password";

export class EmployeeService {
    constructor(
        private employeeRepository = container.get<IEmployeeRepository>(
            TYPES.IEmployeeRepository
        ),
        private orderRepository = container.get<IOrderRepository>(
            TYPES.IOrderRepository
        )
    ) { }

    public async getAll(options?: QueryOptions) {
        const result = await this.employeeRepository.all(options);
        return {
            ...result,
        };
    }

    public async getById(id: number) {
        let customerInfo = await this.employeeRepository.findById(id);
        let orderInfo = await await this.orderRepository.viewOrders(id);
        return { ...customerInfo["dataValues"], orderInfo };
    }

    public async create(data: any) {
        const { username, email } = data;
        const user = await this.employeeRepository.findByUsername(username);
        console.log("user found: ", user)
        if (user) {
            throw new CustomError(
                HttpStatusCode.Conflict,
                ErrorName.CONFLICT,
                "User exists",
                (user.username === username && "username") || ( user.email === email && "email") || ""
            );
        }

        return await this.employeeRepository.create({
            ...data,
            hashedPassword: await PasswordUtil.hash(data.password),
            // isActive: true,
        });
    }

    public async update(id: number, data: any) {
        const user = this.employeeRepository.findById(id);
        if (!user) {
            throw new RecordNotFoundError();
        }

        return await this.employeeRepository.update(id, data);
    }

    public async delete(id: number) {
        const user = this.employeeRepository.findById(id);
        if (!user) {
            throw new RecordNotFoundError();
        }
        return await this.employeeRepository.delete(id);
    }
}
