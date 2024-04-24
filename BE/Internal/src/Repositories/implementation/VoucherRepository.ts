import { injectable } from "inversify";
import "reflect-metadata";
import { IVoucherRepository } from "../IVoucherRepository";
import { BaseRepository } from "./BaseRepository";
import { Voucher } from "../../Models";
@injectable()
export class VoucherRepository
    extends BaseRepository<Voucher>
    implements IVoucherRepository
{
    constructor() {
        super(Voucher);
    }

    public async findByCode(code: string) {
        return await this._model.findAll({
            where: { promo_code: code },
        });
    }
}
