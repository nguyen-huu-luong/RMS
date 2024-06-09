import { Job, Queue, QueueOptions, Worker, tryCatch } from "bullmq";
import { EmailService } from "./Email.service";
import { container } from "../Configs";
import { ITargetListRepository } from "../Repositories/ITargetListRepository";
import { TYPES } from "../Types/type";
import { Client } from "../Models";
import { IMessageTemplateRepository } from "../Repositories";
import { IEmailCampaignRepository } from "../Repositories/IEmailCampaignRepository";

export enum QUEUE_NAMES {
    DEFAULT = "DEFAULT",
    CAMPAIGN = "campaign",
}

export enum JobType {
    SEND_EMAIL = "send-email",
    UPDATE_EMAIL_CAMPAIGN_STATUS = "Update email campaign status",
    SEND_EMAIL_TO_TARGETLIST = "send email to targetlists",
}

export class QueueService {
    private queues!: Record<string, Queue>;
    private defaultQueue!: Queue;
    private defaultQueueWorker!: Worker;

    private campaignQueue!: Queue;
    private campaignWorker!: Worker;

    private static instance: any;

    private static QUEUE_OPTIONS: QueueOptions = {
        defaultJobOptions: {
            removeOnComplete: false,
            removeOnFail: false,
        },
        connection: {
            host: process.env.REDIS_HOST,
            port: Number(process.env.REDIS_PORT) || 6379
        }
    };

    constructor() {
        if (QueueService.instance instanceof QueueService) {
            return QueueService.instance;
        }

        this.queues = {};
        QueueService.instance = this;

        this.initiateQueues();
        this.instantiateWorkers();
    }

    async initiateQueues() {
        this.defaultQueue = new Queue(
            QUEUE_NAMES.DEFAULT,
            QueueService.QUEUE_OPTIONS
        );
        this.queues[QUEUE_NAMES.DEFAULT] = this.defaultQueue;

        this.campaignQueue = new Queue(
            QUEUE_NAMES.CAMPAIGN,
            QueueService.QUEUE_OPTIONS
        );
        this.queues[QUEUE_NAMES.CAMPAIGN] = this.campaignQueue;
    }

    async instantiateWorkers() {
        this.defaultQueueWorker = new Worker(
            QUEUE_NAMES.DEFAULT,
            async (job: Job) => {
                switch (job.name) {
                    case JobType.SEND_EMAIL:
                        try {
                            const emailService = new EmailService();
                            const { campaignId, ...emailData } = job.data;
                            console.log("sending email......");
                            await emailService.sendEmail(
                                emailData,
                                Number(campaignId)
                            );
                        } catch (error) {
                            throw new Error(error?.toString());
                        }
                }
            },
            { connection: QueueService.QUEUE_OPTIONS.connection }
        );

        this.defaultQueueWorker.on("failed", () => {});
        this.defaultQueueWorker.on("completed", () => {});
        this.defaultQueueWorker.on("progress", () => {});

        this.campaignWorker = new Worker(
            QUEUE_NAMES.CAMPAIGN,
            async (job: Job) => {
                switch (job.name) {
                    case JobType.SEND_EMAIL:
                        let {
                            campaignId,
                            emailCampaignId,
                            delay,
                            templateId,
                            content,
                            ...emailData
                        } = job.data;
                        let html = content;
                        let type = "text";
                        if (templateId) {
                            const templateRepository =
                                container.get<IMessageTemplateRepository>(
                                    TYPES.IMessageTemplateRepository
                                );
                            const template = await templateRepository.findById(
                                templateId
                            );
                            html = template.getDataValue("content");
                            if ( template.getDataValue("type") === "dnd") {
                                type = "mjml"
                            }
                        }
                            
                        console.log(html, type)

                        if (job.data.finalEmail) {
                            console.log("Final: ", job.data.to);
                            this.campaignQueue.add(
                                JobType.UPDATE_EMAIL_CAMPAIGN_STATUS,
                                { emailCampaignId, status: "completed" }
                            );
                        } else {
                            console.log(job.data.to);
                        }

                        const emailService = new EmailService();
                        await emailService.sendEmail(
                            { ...emailData, html, type },
                            campaignId
                        );
                        break;
                    case JobType.UPDATE_EMAIL_CAMPAIGN_STATUS:
                        try {
                            const emailCampaignId = job.data.emailCampaignId;
                            const emailCampaignRepository =
                                container.get<IEmailCampaignRepository>(
                                    TYPES.IEmailCampaignRepository
                                );

                            await emailCampaignRepository.update(
                                emailCampaignId,
                                { status: job.data.status }
                            );
                            // update email campaign status
                        } catch (error) {
                            console.log(error);
                            throw error;
                        }
                        break;
                    case JobType.SEND_EMAIL_TO_TARGETLIST:
                        try {
                            const {
                                targetlistIds,
                                campaignId,
                                emailCampaignId,
                                startDate,
                                ...emailData
                            } = job.data;
                            console.log(
                                new Date(startDate).toLocaleDateString()
                            );
                            console.log(new Date().toLocaleDateString());
                            const delay =
                                new Date(startDate).getTime() -
                                new Date().getTime();

                            console.log(delay);
                            console.log(
                                targetlistIds,
                                campaignId,
                                emailCampaignId,
                                startDate,
                                emailData
                            );
                            const clientEmails: Set<string> = new Set([]);
                            const targetlistRepository =
                                container.get<ITargetListRepository>(
                                    TYPES.ITargetListRepository
                                );

                            for (let id of targetlistIds) {
                                console.log(Number(id));
                                let targetlist =
                                    await targetlistRepository.getById(
                                        Number(id)
                                    );
                                if (targetlist) {
                                    let clients = await targetlist.getClients();
                                    clients.forEach((item: Client) => {
                                        let email: string =
                                            item.getDataValue("email");
                                        email && clientEmails.add(email);
                                    });
                                } else {
                                    console.log("Khoong timf thay targetlis");
                                }
                            }
                            console.log(clientEmails);

                            let count = 0;
                            if (clientEmails.size === 0) {
                                this.campaignQueue.add(
                                    JobType.UPDATE_EMAIL_CAMPAIGN_STATUS,
                                    { emailCampaignId, status: "completed" }
                                );
                            } else {
                                this.campaignQueue.add(
                                    JobType.UPDATE_EMAIL_CAMPAIGN_STATUS,
                                    {
                                        emailCampaignId,
                                        status: "inProgress",
                                    },
                                    { delay: delay - 1000 }
                                );
                                clientEmails.forEach(
                                    (email: string, index: string) => {
                                        console.log(
                                            "Send email to ",
                                            email,
                                            "after ",
                                            delay,
                                            " (s)"
                                        );
                                        console.log(
                                            new Date(startDate).toLocaleString()
                                        );
                                        console.log(
                                            new Date().toLocaleString()
                                        );
                                        count++;
                                        this.campaignQueue.add(
                                            JobType.SEND_EMAIL,
                                            {
                                                ...emailData,
                                                to: email,
                                                campaignId,
                                                emailCampaignId,
                                                finalEmail:
                                                    clientEmails.size === count,
                                            },
                                            { delay, priority: count }
                                        );
                                    }
                                );
                            }
                        } catch (error) {
                            console.log(error);
                            throw error;
                        }
                        break;
                    default:
                        break;
                }
            },
            { connection: QueueService.QUEUE_OPTIONS.connection }
        );

        this.campaignWorker.on("failed", (job?: Job) => {
            console.log(job && job.failedReason);
        });
    }

    getQueue(name: string) {
        return this.queues[name];
    }

    getQueues() {
        return Object.values(this.queues);
    }
}
