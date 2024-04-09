import { container } from "../Configs";
import { QueryOptions, TYPES } from "../Types/type";
import { IClientRepository, INotificationRepository } from "../Repositories";
import { UnauthorizedError } from "../Errors";

export class NotificationService {
    constructor(
        private notificationRepository = container.get<INotificationRepository>(
            TYPES.INotificationRepository
        ),
        private clientRepository = container.get<IClientRepository>(
            TYPES.IClientRepository
        )
    ) { }

    public async getAll(userId: number) {
        const client = await this.clientRepository.findById(userId);
        const res = await client.getNotifications({ order: [["createdAt", "DESC"]],});
        return {
            res
        };
    }

    public async getById(userId: number, id: number) {
        let client = await this.clientRepository.findById(userId);
        let res = await client.getNotifications({where:{
            id: id
        }});
        return { res };
    }

    public async create(id: number, data: any) {
        const client = await this.clientRepository.findById(id);
        const res = await client.createNotification(
            data
        )
        return res;
    }

    public async getNumber(userId: number) {
        let client = await this.clientRepository.findById(userId);
        let res = (await client.getNotifications()).length;
        return res;
    }

    public async updateById(userId: number, id: number) {
        let client = await this.clientRepository.findById(userId);
        let notification = await this.notificationRepository.update(id, {status: true});
        return await notification.save()
    }
}
