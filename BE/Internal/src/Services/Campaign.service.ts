import { ErrorName, HttpStatusCode } from "../Constants";
import { container, sequelize } from "../Configs";
import { QueryOptions, TYPES } from "../Types/type";
import { IClientRepository } from "../Repositories/IClientRepository";
import { IOrderRepository } from "../Repositories/IOrderRepository";
import {
    CustomError,
    InternalServerError,
    RecordNotFoundError,
    ValidationError,
} from "../Errors";
import { ICamPaignRepository } from "../Repositories/ICampaignRepository";
import { Model, Transaction } from "sequelize";
import { ITargetListRepository } from "../Repositories/ITargetListRepository";

type AssociationWithResourceType = {
    action: string;
    ids: number[];
};
export type CampaignData = {
    name: string;
    type?: string;
    status?: string;
    startDate?: Date;
    endDate?: number;
    budget?: number;
    targetlists?: AssociationWithResourceType;
    emailCampaigns?: AssociationWithResourceType;
    trackUrls?: number[];
};

export type TargetListData = {
    id: number;
    name: string;
    description: string;
};

export class CampaignService {
    constructor(
        private campaignRepository = container.get<ICamPaignRepository>(
            TYPES.ICampaignRepository
        ),
        private targetlistRepository = container.get<ITargetListRepository>(
            TYPES.ITargetListRepository
        )
    ) { }

    public async getAll(options?: QueryOptions) {
        const result = await this.campaignRepository.all(options);
        return {
            ...result,
        };
    }

    public async getById(id: number) {
        const campaignInfo = await this.campaignRepository.findById(id);

        const { TargetLists, EmailCampaign, TrackUrls, ...rest } = JSON.parse(
            JSON.stringify(campaignInfo)
        );
        return {
            ...rest,
            targetLists: TargetLists,
            emailCampaign: EmailCampaign,
            trackUrls: TrackUrls,
        };
    }

    public async create(data: CampaignData) {
        const { name, type, status, startDate, endDate, budget } = data;

        return await this.campaignRepository.create({
            name,
            type,
            status,
            startDate,
            endDate,
            budget,
        });
    }

    public async update(id: number, data: CampaignData) {
        if (data.targetlists) {
            // validate actions
            if (!["add", "remove", "replace"].includes(data.targetlists.action)) {
                throw new ValidationError(
                    "Invalid params targetlist.action. Allow action in ['add', 'remove', 'replace'"
                );
            }
            const allTargetListIds = await this.targetlistRepository.getIds();
            if (!this.checkArrayContains(data.targetlists.ids, allTargetListIds)) {
                throw new InternalServerError("Invalid parameter targetListIds");
            }
        }

        console.log(data);

        const newCampaign = await this.campaignRepository.updateCampaign(id, data);
        const { TargetLists, EmailCampaign, TrackUrls, ...rest } = JSON.parse(
            JSON.stringify(newCampaign)
        );
        return {
            ...rest,
            targetLists: TargetLists,
            emailCampaign: EmailCampaign,
            trackUrls: TrackUrls,
        };
    }

    public async delete(id: number) {
        const campaign = this.campaignRepository.findById(id);
        if (!campaign) {
            throw new RecordNotFoundError();
        }
        return await this.campaignRepository.delete(id);
    }

    public async deleteMany(ids: number[]) {
        for (let id of ids) {
            console.log(id);
            await this.delete(id);
        }

        return true;
    }

    private checkArrayContains = (arr: number[], targetArray: number[]) =>
        arr.every((item) => targetArray.includes(item));
}
