import { NextFunction, Request, Response } from 'express';
import {Message} from '../Utils';
import {HttpStatusCode} from '../Constants';
import { container } from '../Configs';
import statusMess from '../Constants/statusMess';
import { IVoucherRepository } from '../Repositories/IVoucherRepository';
import { TYPES } from '../Repositories/type';
import { validationResult } from "express-validator";
/// <reference path="./types/globle.d.ts" />
import {
	ValidationError,
    RecordNotFoundError
} from "../Errors";
import { IClientRepository } from '../Repositories';

export class VoucherService {
    constructor(
        private voucherRepository = container.get<IVoucherRepository>(TYPES.IVoucherRepository),
        private clientRepository = container.get<IClientRepository>(TYPES.IClientRepository),
    ) {}

    public async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            console.log(req.action)
            const errors = validationResult(req);
            let data:any;
			if (!errors.isEmpty()) {
				throw new ValidationError(errors.array()[0].msg);
			}
            const status: number = HttpStatusCode.Success;
            if (req.action === "read:own") {
                const client = await this.clientRepository.findById(req.userId);
                data = await client.getVouchers();
            } else {
                data = await this.voucherRepository.all();
            }
            res.status(status).send(data);
            Message.logMessage(req, status);
        }
        catch (err) {
            console.log(err)
			next(err);
        }
    }
    public async updateVoucher(req: Request, res: Response, next: NextFunction) {
        try {
            const status: number = HttpStatusCode.Success;
            const data = await this.voucherRepository.update(parseInt(req.params.id), req.body);
            if (!data) {
				throw new RecordNotFoundError("Voucher do not exist");
			}
            res.status(status).send(statusMess.Success);
            Message.logMessage(req, status);
        }
        catch (err) {
            console.log(err)
			next(err);
        }
    }
    public async createVoucher(req: Request, res: Response, next: NextFunction) {
        try {
            const status: number = HttpStatusCode.Success;
            const data = await this.voucherRepository.create(req.body);
            if (!data) {
				throw new RecordNotFoundError("Voucher do not exist");
			}
            res.status(status).send(statusMess.Success);
            Message.logMessage(req, status);
        }
        catch (err) {
            console.log(err)
			next(err);
        }
    }
    public async deleteVoucher(req: Request, res: Response, next: NextFunction) {
        try {
            const status: number = HttpStatusCode.Success;
            const data = await this.voucherRepository.delete(parseInt(req.params.id));
            if (!data) {
				throw new RecordNotFoundError("Voucher do not exist");
			}
            res.status(status).send(statusMess.Success);
            Message.logMessage(req, status)
        }
        catch (err) {
            console.log(err)
			next(err);
        }
    }
    public async getVoucher(req: Request, res: Response, next: NextFunction) {
        try {
            const status: number = HttpStatusCode.Success;
            console.log(req.params.id)
            const data = await this.voucherRepository.findById(parseInt(req.params.id));
            if (!data) {
				throw new RecordNotFoundError("Voucher do not exist");
			}
            res.status(status).send(data);
            Message.logMessage(req, status);
        }
        catch (err) {
            console.log(err)
			next(err);
        }
    }

    public async assignVouchers(req: Request, res: Response, next: NextFunction) {
        try {
            const status: number = HttpStatusCode.Success;
            const voucher = await this.voucherRepository.findById(parseInt(req.params.id));
            if (!voucher) {
				throw new RecordNotFoundError("Voucher do not exist");
			}
            const client = await this.clientRepository.findById(
                req.body.clientId
            );
            if (!client) {
                throw new RecordNotFoundError("Product do not exist");
            }
            const clientVouchers = await voucher.getClients({
                where: { id: req.body.clientId },
            });
            if (clientVouchers.length > 0) {
                await voucher.addClient(client, {
                    through: {
                        quantity:req.body.quantity,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                });
            } else {
                await voucher.addClient(client, {
                    through: {
                        quantity: req.body.quantity,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                });
            }
            res.status(status).send(statusMess.Success);
            Message.logMessage(req, status);
        }
        catch (err) {
            console.log(err)
			next(err);
        }
    }

    public async consumeVoucher(req: Request, res: Response, next: NextFunction) {
        try {
            const status: number = HttpStatusCode.Success;
            const voucher = await this.voucherRepository.findById(parseInt(req.params.id));
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
            res.status(status).send(statusMess.Success);
            Message.logMessage(req, status);
        }
        catch (err) {
            console.log(err)
			next(err);
        }
    }
}
