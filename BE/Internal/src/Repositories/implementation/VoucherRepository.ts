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

}
