import { NextFunction, Request, Response } from "express";
import { Message } from "../Utils";
import { HttpStatusCode } from "../Constants";
import { container } from "../Configs";
import statusMess from "../Constants/statusMess";
import { IVoucherRepository } from "../Repositories/IVoucherRepository";
import { QueryOptions, TYPES } from "../Types/type";
import { validationResult } from "express-validator";
/// <reference path="./types/globle.d.ts" />
import {
    ValidationError,
    RecordNotFoundError,
    BadRequestError,
} from "../Errors";
import { IClientRepository } from "../Repositories";
import { parseRequesQueries } from "../Helper/helper";

export class VoucherService {
    constructor(
        private voucherRepository = container.get<IVoucherRepository>(
            TYPES.IVoucherRepository
        ),
        private clientRepository = container.get<IClientRepository>(
            TYPES.IClientRepository
        )
    ) {}

    public async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            let data: any;
            if (!errors.isEmpty()) {
                throw new ValidationError(errors.array()[0].msg);
            }
            const status: number = HttpStatusCode.Success;
            if (req.action === "read:own") {
                const client = await this.clientRepository.findById(req.userId);
                data = await client.getVouchers();
            } else {
                const queries = { ...req.body, ...req.query };
                const options: QueryOptions = parseRequesQueries(queries);
                data = await this.voucherRepository.all(options);
            }
            Message.logMessage(req, status);
            return res.status(status).send(data);
        } catch (err) {
            console.log(err);
            next(err);
        }
    }
    public async updateVoucher(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const status: number = HttpStatusCode.Success;
            const data = await this.voucherRepository.update(
                parseInt(req.params.id),
                req.body
            );
            if (!data) {
                throw new RecordNotFoundError("Voucher do not exist");
            }
            Message.logMessage(req, status);
            return res.status(status).send(statusMess.Success);
        } catch (err) {
            console.log(err);
            next(err);
        }
    }
    public async createVoucher(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const status: number = HttpStatusCode.Success;
            console.log(req.body);
            const data = await this.voucherRepository.create(req.body.data);
            if (!data) {
                throw new RecordNotFoundError("Voucher do not exist");
            }
            Message.logMessage(req, status);
            return res.status(status).send(statusMess.Success);
        } catch (err) {
            console.log(err);
            next(err);
        }
    }
    public async deleteVoucher(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const status: number = HttpStatusCode.Success;
            const data = await this.voucherRepository.delete(
                parseInt(req.params.id)
            );
            if (!data) {
                throw new RecordNotFoundError("Voucher do not exist");
            }
            Message.logMessage(req, status);
            return res.status(status).send(statusMess.Success);
        } catch (err) {
            console.log(err);
            next(err);
        }
    }
    public async getVoucher(req: Request, res: Response, next: NextFunction) {
        try {
            const status: number = HttpStatusCode.Success;
            console.log(req.params.id);
            const data = await this.voucherRepository.findById(
                parseInt(req.params.id)
            );
            if (!data) {
                throw new RecordNotFoundError("Voucher do not exist");
            }
            Message.logMessage(req, status);
            return res.status(status).send(data);
        } catch (err) {
            console.log(err);
            next(err);
        }
    }

    public async getVoucherClients(req: Request, res: Response, next: NextFunction) {
        try {
            const status: number = HttpStatusCode.Success;
            const data = await this.voucherRepository.findById(
                parseInt(req.params.id)
            );
            const clients = await data.getClients()
            if (!data) {
                throw new RecordNotFoundError("Voucher do not exist");
            }
            Message.logMessage(req, status);
            return res.status(status).send(clients);
        } catch (err) {
            console.log(err);
            next(err);
        }
    }

    public async assignVouchers(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const status: number = HttpStatusCode.Success;
            const voucher = await this.voucherRepository.findById(
                parseInt(req.params.id)
            );
            if (!voucher) {
                throw new RecordNotFoundError("Voucher does not exist");
            }
            if (req.query.profit || req.query.type) {
                const profit: number = req.query.profit
                    ? parseFloat(req.query.profit as string)
                    : 0;
                const type: string = req.query.type
                    ? (req.query.type as string)
                    : "";

                const clients = await this.clientRepository.findByProfit(profit);

                if (clients) {
                    await Promise.all(
                        clients.map(async (client) => {
                            const clientVouchers = await voucher.getClients({
                                where: { id: client.id },
                            });
                            if (clientVouchers.length === 0) {
                                await voucher.addClient(client, {
                                    through: {
                                        quantity: 1,
                                        createdAt: new Date(),
                                        updatedAt: new Date(),
                                    },
                                });
                            }
                        })
                    );
                }
            } else {
                console.log(req.body.clientsIds)
                const clientsIds: number[] = req.body.clientsIds;
                if (!clientsIds || clientsIds.length === 0) {
                    throw new BadRequestError("No clients provided");
                }
                await Promise.all(
                    clientsIds.map(async (clientId) => {
                        const client = await this.clientRepository.findById(
                            clientId
                        );
                        if (!client) {
                            throw new RecordNotFoundError(
                                `Client with id ${clientId} not found`
                            );
                        }
                        const clientVouchers = await voucher.getClients({
                            where: { id: clientId },
                        });
                        if (clientVouchers.length === 0) {
                            await voucher.addClient(client, {
                                through: {
                                    quantity: 1,
                                    createdAt: new Date(),
                                    updatedAt: new Date(),
                                },
                            });
                        }
                    })
                );
            }

            Message.logMessage(req, status);
            return res.status(status).send(statusMess.Success);
        } catch (err) {
            console.log(err);
            next(err);
        }
    }

    public async consumeVoucher(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const status: number = HttpStatusCode.Success;
            const voucher = await this.voucherRepository.findById(
                parseInt(req.params.id)
            );
            if (!voucher) {
                throw new RecordNotFoundError("Voucher do not exist");
            }
            const client = await this.clientRepository.findById(
                req.body.clientId
            );
            if (!client) {
                throw new RecordNotFoundError("Client do not exist");
            }
            if (req.body.quantity === 0) {
                await voucher.removeClient(client);
            } else {
                await voucher.addVoucher(client, {
                    quantity: req.body.quantity,
                });
            }
            Message.logMessage(req, status);
            return res.status(status).send(statusMess.Success);
        } catch (err) {
            console.log(err);
            next(err);
        }
    }
}
