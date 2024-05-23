import { container } from "../Configs";
import { QueryOptions, TYPES } from "../Types/type";
import { IClientRepository, ISubscriberRepository } from "../Repositories";
import { Request, Response, NextFunction } from "express";
import { Op, where } from "sequelize";

export class SubscriberService {
  constructor(
    private clientRepository = container.get<IClientRepository>(
        TYPES.IClientRepository
      ),
      private subscriberRepository = container.get<ISubscriberRepository>(
        TYPES.ISubscriberRepository
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

            let lead = await this.clientRepository.findByCond({
                where: {
                    [Op.or]: {
                        email: req.body.email,
                        phone: req.body.phone
                    }
                }
            })

            if (lead.length == 0) {
                const {name, ...customInfo} = req.body
                await this.clientRepository.create({...customInfo, firstname: firstname, lastname: lastname})
            }

            lead = await this.clientRepository.findByCond({
                where: {
                    [Op.or]: {
                        email: req.body.email,
                        phone: req.body.phone
                    }
                }
            })

            const lead_id = lead[0].id

            let subscriber = await this.subscriberRepository.findByCond({
                where: {
                    [Op.or]: {
                        email: req.body.email,
                        phone: req.body.phone
                    }
                }
            })

            if (subscriber.length > 0) {
                return {status: "Failed", message: "This email or phone existed"}
            }

            const {name, ...customInfo} = req.body
            await this.subscriberRepository.create({...customInfo, firstname: firstname, lastname: lastname, clientId: lead_id})

            return {status: "Success"}
        }
        catch(err){
            console.log(err)
            return {status: "Failed"}
        }
    }
}
