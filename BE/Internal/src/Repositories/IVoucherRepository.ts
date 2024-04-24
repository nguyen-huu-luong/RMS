import Voucher from "../Models/Voucher";
import { IBaseRepository } from "./IBaseRepository";

export interface IVoucherRepository extends IBaseRepository<Voucher> {  
    findByCode(code: string): Promise<any> ;
}


