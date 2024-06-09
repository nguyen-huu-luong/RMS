import { NextFunction, Request, Response } from "express";
import { Message } from "../Utils";
import { HttpStatusCode } from "../Constants";
import { container } from "../Configs";
import statusMess from "../Constants/statusMess";
import { IVoucherRepository } from "../Repositories/IVoucherRepository";
import { QueryOptions, TYPES } from "../Types/type";
import { validationResult } from "express-validator";
// @ts-ignore
import * as faker from "faker";

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
                data = await client.getVouchers({
                    where: {
                        "$ClientVoucher.status$": false,
                    },
                });
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
            let promo_code = faker.random.alphaNumeric(10);
            let voucher = await this.voucherRepository.findByCode(promo_code);
            let data: any;
            while (voucher.length != 0) {
                promo_code = faker.random.alphaNumeric(10);
                voucher = await this.voucherRepository.findByCode(promo_code);
            }
            data = await this.voucherRepository.create({
                ...req.body.data,
                promo_code: promo_code,
                redeemedNumber: 0,
            });
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

    public async getVoucherClients(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const status: number = HttpStatusCode.Success;
            const data = await this.voucherRepository.findById(
                parseInt(req.params.id)
            );
            const clients = await data.getClients();
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
            if (req.query.profit) {
                const profit: number = req.query.profit
                    ? parseFloat(req.query.profit as string)
                    : 0;
                const clients = await this.clientRepository.findByProfit(
                    profit,
                    parseInt(req.params.id)
                );

                if (clients.length > 0) {
                    if (
                        clients.length >
                        voucher.getDataValue("quantity") -
                            voucher.getDataValue("redeemedNumber")
                    ) {
                        return res.status(HttpStatusCode.Success).send({
                            message: "Not enough quantity",
                            more:
                                clients.length -
                                (voucher.getDataValue("quantity") -
                                    voucher.getDataValue("redeemedNumber")),
                        });
                    }
                    await Promise.all(
                        clients.map(async (client: any) => {
                            const clientVouchers = await voucher.getClients({
                                where: { id: client.id },
                            });
                            if (clientVouchers.length === 0) {
                                await voucher.addClient(client, {
                                    through: {
                                        status: false,
                                        createdAt: new Date(),
                                        updatedAt: new Date(),
                                    },
                                });
                            }
                        })
                    );
                    const redeemedClient = await voucher.getClients();
                    await voucher.update({
                        redeemedNumber: redeemedClient.length,
                    });
                    await voucher.save();
                    Message.logMessage(req, status);
                    return res.status(status).send(statusMess.Success);
                } else {
                    Message.logMessage(req, status);
                    return res
                        .status(HttpStatusCode.Success)
                        .send("Already assigned");
                }
            } else {
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
                                    status: false,
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

    public async redeemVoucher(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            console.log(req.params);
            const status: number = HttpStatusCode.Success;
            const voucher = await this.voucherRepository.findByCode(
                req.params.id
            );
            if (voucher.length == 0) {
                Message.logMessage(req, status);
                return res.status(status).send("Voucher does not exist");
            }
            const client = await this.clientRepository.findById(req.userId);
            if (voucher[0].getDataValue("can_redeem")) {
                const clientVoucher = await client.getVouchers({
                    where: {
                        "$ClientVoucher.voucherId$":
                            voucher[0].getDataValue("id"),
                    },
                });
                if (clientVoucher.length > 0) {
                    Message.logMessage(req, status);
                    return res
                        .status(status)
                        .send("You have already redeemed this voucher");
                }
                if (
                    voucher[0].getDataValue("quantity") ==
                    voucher[0].getDataValue("redeemedNumber")
                ) {
                    Message.logMessage(req, status);
                    return res
                        .status(status)
                        .send("The vouchers have been taken all");
                }
                await voucher[0].addClient(client, {
                    through: {
                        status: false,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                });
                await voucher[0].update({
                    redeemedNumber:
                        voucher[0].getDataValue("redeemedNumber") + 1,
                });
                await voucher[0].save();
                Message.logMessage(req, status);
                return res.status(status).send(statusMess.Success);
            }
            Message.logMessage(req, status);
            return res.status(status).send("Can not be redeem");
        } catch (err) {
            console.log(err);
            next(err);
        }
    }
}
