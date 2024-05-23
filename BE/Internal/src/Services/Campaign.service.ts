import { ErrorName, HttpStatusCode } from "../Constants";
import { container, sequelize } from "../Configs";
import { QueryOptions, TYPES } from "../Types/type";
import { IClientRepository } from "../Repositories/IClientRepository";
import { IOrderRepository } from "../Repositories/IOrderRepository";
import {
    BadRequestError,
    CustomError,
    InternalServerError,
    RecordNotFoundError,
    ValidationError,
} from "../Errors";
import { ICamPaignRepository } from "../Repositories/ICampaignRepository";
import { Model, Transaction } from "sequelize";
import { ITargetListRepository } from "../Repositories/ITargetListRepository";
import { EmailCampaign } from "../Models";
import { IEmailCampaignRepository } from "../Repositories/IEmailCampaignRepository";
import { JobType, QUEUE_NAMES, QueueService } from "./Queue.service";
import JobService from "./JobService";

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
    targetlistIds?: number [];
    emailCampaigns?: AssociationWithResourceType;
    trackUrls?: number[];
};

export type TargetListData = {
    id: number;
    name: string;
    description: string;
};


export type EmailCampaignData = {
    name: string,
    status: string,
    startDate: string,
    subject: string,
    targetlistIds: Array<any>,
    templateId: number,
    sendFrom: string,
    content: string
}

export type TrackUrlData = {
    name: string,
    redirectUrl: string
}

export class CampaignService {
    constructor(
        private campaignRepository = container.get<ICamPaignRepository>(
            TYPES.ICampaignRepository
        ),
        private targetlistRepository = container.get<ITargetListRepository>(
            TYPES.ITargetListRepository
        ) ,
        private emailCampaignRepository = container.get<IEmailCampaignRepository>(
            TYPES.IEmailCampaignRepository
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

        const { TargetLists, EmailCampaigns, TrackUrls, ...rest } = JSON.parse(
            JSON.stringify(campaignInfo)
        );
        return {
            ...rest,
            targetLists: TargetLists,
            emailCampaigns: EmailCampaigns,
            trackUrls: TrackUrls,
        };
    }

    public async create(data: CampaignData) {
        const { name, type, status, startDate, endDate, budget, targetlistIds } = data;

        const campaign =  await this.campaignRepository.create({
            name,
            type,
            status,
            startDate,
            endDate,
            budget,
        });

        if (targetlistIds) {
            await campaign.addTargetLists(targetlistIds)
        } 

        return campaign 
    }

    public async update(id: number, data: CampaignData) {
        if (data.targetlists) {
            // validate actions
            if (!["add", "remove", "replace"].includes(data.targetlists.action)) {
                throw new ValidationError(
                    "Invalid params targetlist.action. Allow action in ['add', 'remove', 'replace']"
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

    public async getEmailCampaign(campaignId: number, emailId: number) {
        const emailCampaign = await this.emailCampaignRepository.findById(emailId)

        return emailCampaign
    }

    public async getAllJob(campaignId: number | string, emailCampaignId: number | string, ) {
        const jobService = new JobService()

        const result = await jobService.getAll(QUEUE_NAMES.CAMPAIGN, {
            data: {
                campaignId,
                emailCampaignId,
            }
        })

        return result ;
    }

    public async createEmailCampaign(campaignId: number, data: EmailCampaignData) {
        console.log(data)
        const {name , startDate, subject, sendFrom, targetlistIds, templateId, content} = data

        let status = "Pending"
        const campaignQueue = new QueueService().getQueue(QUEUE_NAMES.CAMPAIGN) ;
        
        console.log(new Date(startDate).toLocaleString())
        console.log(new Date().toLocaleString())
        console.log(new Date(startDate).getTime() - new Date().getTime())
        
        const emailCampaign = await this.emailCampaignRepository.create({
            name, status, startDate, subject, sendFrom, campaignId
        }) 
        
        console.log(targetlistIds)
        if (targetlistIds) {
            await emailCampaign.setTargetLists(targetlistIds) ;
        }
        
        campaignQueue.add(JobType.SEND_EMAIL_TO_TARGETLIST, {
            campaignId, 
            emailCampaignId: emailCampaign.getDataValue("id"),
            targetlistIds,
            startDate,
            sendFrom,
            templateId,
            content,
            subject
        })

        return emailCampaign ;
    }

    public async deleteEmailCampaign(campaignId: number, emailId: number) {
        return await this.emailCampaignRepository.delete(emailId, {campaignId})
    } 

    public async createTrackUrl(campaignId : number, data: TrackUrlData) {
        return await this.campaignRepository.createTrackUrl(campaignId, data)
    }

    public async deleteTrackUrl(campaignId : number, trackUrlId: number) {
        return await this.campaignRepository.deleteTrackUrl(campaignId, trackUrlId)
    }

    public async getCampaignStatisTic(id : number) {
        return await this.campaignRepository.getStatistic(id) 
    }

    private checkArrayContains = (arr: number[], targetArray: number[]) =>
        arr.every((item) => targetArray.includes(item));
}
