import { NextFunction, Request, Response } from "express";
import { Message } from "../Utils";
import { HttpStatusCode } from "../Constants";
import { container } from "../Configs";
import statusMess from "../Constants/statusMess";
import { IChannelRepository } from "../Repositories/IChannelRepository";
import { TYPES } from "../Repositories/type";
import { Op } from "sequelize";

/// <reference path="./types/globle.d.ts" />
import { IClientRepository, IEmployeeRepository } from "../Repositories";
import moment from "moment";
export class ChannelService {
    constructor(
        private channelRepository = container.get<IChannelRepository>(
            TYPES.IChannelRepository
        ),
        private clientRepository = container.get<IClientRepository>(
            TYPES.IClientRepository
        ),
        private employeeRepository = container.get<IEmployeeRepository>(
            TYPES.IEmployeeRepository
        )
    ) {}

    // public async getChannel(req: Request, res: Response, next: NextFunction) {
    //     try {
    //         const status: number = HttpStatusCode.Success;
    //         let response: any;
    //         if (req.action == "read:own") {
    //             console.log("Lỗi 1 ********")
    //             const client = await this.clientRepository.findById(req.userId);
    //             const channel = await client.getChannel();
    //             response = {
    //                 channel: channel,
    //             };
    //             Message.logMessage(req, status);
    //             res.status(status).send(response);
    //             return
    //         } else if (req.action == "read:any") {
    //             console.log("Lỗi 2 ********")
    //             const channels = await this.channelRepository.all();
    //             const returnChannels = await Promise.all(
    //                 channels.map(async (channel) => {
    //                     const messages = await channel.getMessages({
    //                         order: [["createdAt", "DESC"]],
    //                         limit: 1,
    //                     });
    //                     const user = await channel.getClient();
    //                     return {
    //                         channel: channel,
    //                         latestMessage: messages[0],
    //                         updateTime: messages[0]
    //                             ? messages[0].createdAt
    //                             : null,
    //                         userAvatar: user.getDataValue("avatar"),
    //                         userName:
    //                             user.getDataValue("lastname") +
    //                             " " +
    //                             user.getDataValue("firstname"),
    //                     };
    //                 })
    //             );
    //             returnChannels.sort((a, b) => {
    //                 const timeA = moment(a.updateTime);
    //                 const timeB = moment(b.updateTime);
    //                 if (timeA.isBefore(timeB)) {
    //                     return 1;
    //                 } else if (timeA.isAfter(timeB)) {
    //                     return -1;
    //                 } else {
    //                     return 0;
    //                 }
    //             });
    //             response = {
    //                 channel: returnChannels,
    //             };
    //             Message.logMessage(req, status);
    //             res.status(status).send(response);
    //             return
    //         } else return
    //     } catch (err) {
    //         console.log(err);
    //         next(err);
    //     }
    // }

    // public async getMessages(req: Request, res: Response, next: NextFunction) {
    //     try {
    //         const status: number = HttpStatusCode.Success;
    //         let response: any;
    //         let message: any;

    //         if (req.action == "read:own") {
    //             console.log("Lỗi 3 ********")
    //             const client = await this.clientRepository.findById(req.userId);
    //             const channel = await client.getChannel();
    //             message = await channel.getMessages();
    //             const size = req.query.size
    //                 ? parseInt(req.query.size as string, 10)
    //                 : 10;
    //             const page = req.query.page
    //                 ? parseInt(req.query.page as string, 10)
    //                 : 1;
    //             response = {
    //                 channel: channel.getDataValue('id'),
    //                 message: message.slice(-(size * page)),
    //             };
    //             Message.logMessage(req, status);
    //             res.status(status).send(response);
    //             return
    //         } else if (req.action == "read:any") {
    //             console.log("Lỗi 4 ********")
    //             const channelId = req.query.channelId
    //                 ? parseInt(req.query.channelId as string, 10)
    //                 : 0;
    //             const channel = await this.channelRepository.findById(
    //                 channelId
    //             );
    //             message = await channel.getMessages();
    //             const size = req.query.size
    //                 ? parseInt(req.query.size as string, 10)
    //                 : 10;
    //             const page = req.query.page
    //                 ? parseInt(req.query.page as string, 10)
    //                 : 1;
    //             response = {
    //                 channel: channel.getDataValue('id'),
    //                 message: message.slice(-(size * page)),
    //             };
    //             Message.logMessage(req, status);
    //             res.status(status).send(response);
    //             return
    //         } else {
    //             return
    //         }
    //     } catch (err) {
    //         console.log(err);
    //         next(err);
    //     }
    // }

    // public async sendMessage(req: Request, res: Response, next: NextFunction) {
    //     try {
    //         const status: number = HttpStatusCode.Success;
    //         if (req.action == "create:own") {
    //             const client = await this.clientRepository.findById(req.userId);
    //             const channel = await client.getChannel();
    //             await client.createMessage({
    //                 ...req.body,
    //                 clientId: req.userId,
    //                 channelId: channel.getDataValue("id"),
    //             });
    //             Message.logMessage(req, status);
    //             res.status(status).send(statusMess.Success);
    //             return
    //         } else if (req.action == "create:any") {
    //             const employee = await this.employeeRepository.findById(
    //                 req.userId
    //             );
    //             await employee.createMessage({
    //                 ...req.body,
    //                 employeeId: req.userId,
    //             });
    //             Message.logMessage(req, status);
    //             res.status(status).send(statusMess.Success);
    //             return
    //         } else return
    //     } catch (err) {
    //         console.log(err);
    //         next(err);
    //     }
    // }

    public async getChannel(req: Request, res: Response, next: NextFunction) {
        try {
            const status: number = HttpStatusCode.Success;
            let response: any;
            const client = await this.clientRepository.findById(req.userId);
            const channel = await client.getChannel();
            response = {
                channel: channel,
            };
            Message.logMessage(req, status);
            if (res.headersSent) return;
            res.status(status).send(response);
            return;
        } catch (err) {
            console.log(err);
            next(err);
        }
    }

    public async getMessages(req: Request, res: Response, next: NextFunction) {
        try {
            const status: number = HttpStatusCode.Success;
            let response: any;
            let message: any;
            const client = await this.clientRepository.findById(req.userId);
            const channel = await client.getChannel();
            message = await channel.getMessages();
            const size = req.query.size
                ? parseInt(req.query.size as string, 10)
                : 10;
            const page = req.query.page
                ? parseInt(req.query.page as string, 10)
                : 1;
            response = {
                channel: channel.getDataValue("id"),
                message: message.slice(-(size * page)),
            };
            Message.logMessage(req, status);
            if (res.headersSent) return;
            res.status(status).send(response);
            return;
        } catch (err) {
            console.log(err);
            next(err);
        }
    }

    public async sendMessage(req: Request, res: Response, next: NextFunction) {
        try {
            const status: number = HttpStatusCode.Success;
            const client = await this.clientRepository.findById(req.userId);
            const channel = await client.getChannel();
            await client.createMessage({
                ...req.body,
                clientId: req.userId,
                channelId: channel.getDataValue("id"),
            });
            Message.logMessage(req, status);
            return res.status(status).send(statusMess.Success);
        } catch (err) {
            console.log(err);
            next(err);
        }
    }

    public async getAdminChannel(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const status: number = HttpStatusCode.Success;
            let response: any;
            const channels = await this.channelRepository.all();
            const returnChannels = await Promise.all(
                channels.map(async (channel) => {
                    const messages = await channel.getMessages({
                        order: [["createdAt", "DESC"]],
                        limit: 1,
                    });
                    const user = await channel.getClient();
                    return {
                        channel: channel,
                        latestMessage: messages[0],
                        updateTime: messages[0] ? messages[0].createdAt : null,
                        userAvatar: user.getDataValue("avatar"),
                        userName:
                            user.getDataValue("lastname") +
                            " " +
                            user.getDataValue("firstname"),
                    };
                })
            );
            returnChannels.sort((a, b) => {
                const timeA = moment(a.updateTime);
                const timeB = moment(b.updateTime);
                if (timeA.isBefore(timeB)) {
                    return 1;
                } else if (timeA.isAfter(timeB)) {
                    return -1;
                } else {
                    return 0;
                }
            });
            response = {
                channel: returnChannels,
            };
            Message.logMessage(req, status);
            if (res.headersSent) return;
            res.status(status).send(response);
            return;
        } catch (err) {
            console.log(err);
            next(err);
        }
    }

    public async adminGetMessage(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const status: number = HttpStatusCode.Success;
            let response: any;
            let message: any;
            const channelId = req.query.channelId
                ? parseInt(req.query.channelId as string, 10)
                : 0;
            const channel = await this.channelRepository.findById(channelId);
            message = await channel.getMessages();
            // const size = req.query.size
            //     ? parseInt(req.query.size as string, 10)
            //     : 10;
            // const page = req.query.page
            //     ? parseInt(req.query.page as string, 10)
            //     : 1;
            response = {
                channel: channel.getDataValue("id"),
                // message: message.slice(-(size * page)),
                message: message,
            };
            Message.logMessage(req, status);
            if (res.headersSent) return;
            res.status(status).send(response);
        } catch (err) {
            console.log(err);
            next(err);
        }
    }

    public async adminSendMessage(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const status: number = HttpStatusCode.Success;
            const employee = await this.employeeRepository.findById(req.userId);
            await employee.createMessage({
                ...req.body,
                employeeId: req.userId,
            });
            Message.logMessage(req, status);
            return res.status(status).send(statusMess.Success);
        } catch (err) {
            console.log(err);
            next(err);
        }
    }

    public async viewMessage(req: Request, res: Response, next: NextFunction) {
        try {
            const status: number = HttpStatusCode.Success;
            let messagesToUpdate;

            if (req.role === "user") {
                const client = await this.clientRepository.findById(req.userId);
                const channel = await client.getChannel();
                messagesToUpdate = await channel.getMessages({
                    where: {
                        status: "Not seen",
                        employeeId: {
                            [Op.not]: null,
                        },
                    },
                });
            } else if (req.role === "employee") {
                const employee = await this.employeeRepository.findById(
                    req.userId
                );
                const channel = await this.channelRepository.findById(
                    req.body.id
                );
                messagesToUpdate = await channel.getMessages({
                    where: {
                        status: "Not seen",
                        clientId: {
                            [Op.not]: null,
                        },
                    },
                });
            } else {
                return res.status(status).send(statusMess.Success);
            }

            if (messagesToUpdate.length > 0) {
                await Promise.all(
                    messagesToUpdate.map(async (message: any) => {
                        await message.update({ status: "Seen" });
                    })
                );
                Message.logMessage(req, status);
                return res.status(status).send(statusMess.Success);
            } else {
                return res.status(status).send(statusMess.Success);
            }
        } catch (err) {
            console.log(err);
            next(err);
        }
    }
}
