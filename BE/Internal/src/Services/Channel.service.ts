import { NextFunction, Request, Response } from "express";
import { Message } from "../Utils";
import { HttpStatusCode } from "../Constants";
import { container } from "../Configs";
import statusMess from "../Constants/statusMess";
import { IChannelRepository } from "../Repositories/IChannelRepository";
import { TYPES } from "../Repositories/type";
import { validationResult } from "express-validator";
/// <reference path="./types/globle.d.ts" />
import { ValidationError, RecordNotFoundError } from "../Errors";
import { IClientRepository, IEmployeeRepository } from "../Repositories";

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

    public async getChannel(req: Request, res: Response, next: NextFunction) {
        try {
            const status: number = HttpStatusCode.Success;
            let data: any;
            let response: any;
            if (req.action === "read:own") {
                const client = await this.clientRepository.findById(req.userId);
                const channel = await client.getChannel();
                response = {
                    channel: channel,
                };
            } else {
                const channel = await this.channelRepository.all();
                response = {
                    channel: channel,
                };
            }
            res.status(status).send(response);
            Message.logMessage(req, status);
        } catch (err) {
            console.log(err);
            next(err);
        }
    }

    public async getMessages(req: Request, res: Response, next: NextFunction) {
        try {
            const status: number = HttpStatusCode.Success;
            let response: any;
            if (req.action === "read:own") {
                const client = await this.clientRepository.findById(req.userId);
                const channel = await client.getChannel();
                const message = await channel.getMessages();
                const size = req.query.size
                    ? parseInt(req.query.size as string, 10)
                    : 10;
                const page = req.query.page
                    ? parseInt(req.query.page as string, 10)
                    : 1;
                response = {
                    message: message.slice(-(size * page)),
                };
            } else {
                const channel = await this.channelRepository.findById(
                    req.body.channelId
                );
                const message = await channel.getMessages();
                response = {
                    channel: message,
                };
            }
            res.status(status).send(response);
            Message.logMessage(req, status);
        } catch (err) {
            console.log(err);
            next(err);
        }
    }

    public async sendMessage(req: Request, res: Response, next: NextFunction) {
        try {
            const status: number = HttpStatusCode.Success;
            if (req.action === "create:own") {
                const client = await this.clientRepository.findById(req.userId);
                const channel = await client.getChannel();
                await client.createMessage({
                    ...req.body,
                    clientId: req.userId,
                    channelId: channel.getDataValue("id"),
                });
            } else {
                const employee = await this.employeeRepository.findById(
                    req.userId
                );
                await employee.createMessage({
                    ...req.body,
                    employeeId: req.userId,
                });
            }
            res.status(status).send(statusMess.Success);
            Message.logMessage(req, status);
        } catch (err) {
            console.log(err);
            next(err);
        }
    }
}
