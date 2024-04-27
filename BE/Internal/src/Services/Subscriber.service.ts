import { container } from "../Configs";
import { QueryOptions, TYPES } from "../Types/type";
import { IClientRepository } from "../Repositories";
import { Request, Response, NextFunction } from "express";
import { Op, where } from "sequelize";

export class SubscriberService {
  constructor(
    private clientRepository = container.get<IClientRepository>(
        TYPES.IClientRepository
      )
  ) {}
    
    public async createSubscriber(req: Request, res: Response, next: NextFunction){
        try{
            const fullnames = req.body.name.split(' ')
            let firstname:string
            let lastname: string

            if (fullnames.length > 1) {
                firstname = fullnames[0]
                lastname = fullnames.slice(1).join(' ')
            }
            else {
                firstname = fullnames[0]
                lastname = " "
            }

            const subscribers = await this.clientRepository.findByCond({
                where: {
                    [Op.or]: {
                        email: req.body.email,
                        phone: req.body.phone
                    }
                }
            })

            if (subscribers.length > 0) {
                return {status: "Failed", message: "This email or phone existed"}
            }

            const {name, ...customInfo} = req.body

            await this.clientRepository.create({...customInfo, firstname: firstname, lastname: lastname})
            return {status: "Success"}
        }
        catch(err){
            console.log(err)
            return {status: "Failed"}
        }
    }
}
