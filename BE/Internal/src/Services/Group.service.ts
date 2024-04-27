import { container } from "../Configs";
import { QueryOptions, TYPES } from "../Types/type";
import { IGroupRepository, IClientRepository } from "../Repositories";
import { Request, Response, NextFunction } from "express";
import { where } from "sequelize";

export class GroupService {
  constructor(
    private groupRepository = container.get<IGroupRepository>(
      TYPES.IGroupRepository
    ),
    private clientRepository = container.get<IClientRepository>(
      TYPES.IClientRepository
    )
  ) {}
    
    public async getTotalPerGroup(req: Request, res: Response, next: NextFunction){
        try{
            const totalPerGroup = await this.groupRepository.getTotalPerGroup()
            res.send(totalPerGroup)

        }
        catch(err){
            console.log(err)
            return {status: "Failed"}
        }
    }

    public async getAllGroup(req: Request, res: Response, next: NextFunction){
      try{
        const group_names = await this.groupRepository.findByCond({
          attributes: ["name"]
        })
        return group_names

    }
    catch(err){
        console.log(err)
        return {status: "Failed"}
    }
    }
}
