import { container } from "../Configs";
import { QueryOptions, TYPES } from "../Types/type";
import { ISubscriberRepository } from "../Repositories";
import { Request, Response, NextFunction } from "express";
import { where } from "sequelize";

export class SubscriberService {
  constructor(
    private subsriberRepository = container.get<ISubscriberRepository>(
      TYPES.ISubscriberRepository
    )
  ) {}
    
    public async createSubscriber(req: Request, res: Response, next: NextFunction){
        try{
            const subscribers = await this.subsriberRepository.findByCond({
                where: {
                    email: req.body.email
                }
            })
            if (subscribers.length > 0) {
                return {status: "Failed", message: "This email existed"}
            }

            await this.subsriberRepository.create(req.body)
            return {status: "Success"}
        }
        catch(err){
            console.log(err)
            return {status: "Failed"}
        }
    }
}
