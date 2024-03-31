import { container } from "../Configs";
import { QueryOptions, TYPES } from "../Types/type";
import { IClientRepository, IMessageTemplateRepository } from "../Repositories";
import { InternalServerError, RecordNotFoundError } from "../Errors";
import { IClickEventRepository } from "../Repositories/IClickEventRepository";
import { IOpenEventrRepository } from "../Repositories/IOpenEventRepository";

export class TrackingService {
    constructor(
        private clientRepository = container.get<IClientRepository>(
            TYPES.IClientRepository
        ),
        private openEventRepository = container.get<IOpenEventrRepository>(
            TYPES.IOpenEventRepository
        ),
        private clickEventRepository = container.get<IClickEventRepository>(
            TYPES.IClickEventRepository
        )
    ) { }
    public async trackEmail(email: string, campaignId: string | number) {
        const recipent = await this.clientRepository.findByEmail(email);
        if (!recipent) {
            throw new RecordNotFoundError("Can't not found client in database");
        }

        const result = await this.openEventRepository.create({
            email,
            timeOpen: new Date(),
            campaignId,
        });

        return result;
    }

    public async trackUrl(
        email: string,
        campaignId: string | number,
        redirectUrl: string
    ) {
        const recipent = await this.clientRepository.findByEmail(email);
        if (!recipent) {
            throw new RecordNotFoundError("Can't not found client in database");
        }

        const result = await this.clickEventRepository.create({
            email, 
            timeClick: new Date(),
            url: redirectUrl,
            campaignId
        })

        return result && true;
    }
}
