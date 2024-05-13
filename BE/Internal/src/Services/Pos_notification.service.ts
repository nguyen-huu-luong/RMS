import { ErrorName, HttpStatusCode } from "../Constants";
import { container } from "../Configs";
import { QueryOptions, TYPES } from "../Types/type";
import { IOrderRepository } from "../Repositories/IOrderRepository";
import { CustomError, RecordNotFoundError } from "../Errors";
import { IPos_notificationRepository } from "../Repositories";
import PasswordUtil from "../Utils/Password";

export class Pos_notificationService {
    constructor(
        private pos_notificationRepository = container.get<IPos_notificationRepository>(
            TYPES.IPos_notificationRepository
        ),
        private orderRepository = container.get<IOrderRepository>(
            TYPES.IOrderRepository
        )
    ) { }

    public async getAll() {
        let result = await this.pos_notificationRepository.all();
        result.sort((a: any, b: any) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        return result;
    }

    public async getById(id: number) {
        let customerInfo = await this.pos_notificationRepository.findById(id);
        let orderInfo = await await this.orderRepository.viewOrders(id);
        return { ...customerInfo["dataValues"], orderInfo };
    }

    public async create(data: any) {
        return await this.pos_notificationRepository.create(data);
    }

    public async delete(id: number) {
        const user = this.pos_notificationRepository.findById(id);
        if (!user) {
            throw new RecordNotFoundError();
        }
        return await this.pos_notificationRepository.delete(id);
    }
}
