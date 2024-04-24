import "reflect-metadata";
import { injectable } from "inversify";
import { BaseRepository } from "./BaseRepository";
import { EmailCampaign } from "../../Models";
import { IEmailCampaignRepository } from "../IEmailCampaignRepository";
import { Transaction, where } from "sequelize";
import { sequelize } from "../../Configs";
import { RecordNotFoundError } from "../../Errors";

@injectable()
export class EmailCampaignRepository
  extends BaseRepository<EmailCampaign>
  implements IEmailCampaignRepository
{
  constructor() {
    super(EmailCampaign);
  }

  public async create(data: any) {
    const { campaignId, targetlistIds, templateId, ...info } = data;

    console.log("Create email campaign", data);
    const t = await sequelize.getSequelize().transaction();
    try {
      let emailCampaign = await this._model.create(data, { transaction: t });

      if (targetlistIds) {
        await emailCampaign.setTargetLists(targetlistIds, { transaction: t });
      }

      await emailCampaign.save({ transaction: t });

      await t.commit();
      return emailCampaign;
    } catch (error) {
      console.log(error);
      await t.rollback();
      throw error;
    }
  }

  public async delete(id: number, cond?: any): Promise<boolean> {
    const emailCampaign = await this._model.findOne({where: {id, campaignId: cond.campaignId}})

    console.log(JSON.stringify(emailCampaign))
    if (!emailCampaign) {
        throw new RecordNotFoundError("CANNOT delete record. Record not found")
    }

    await emailCampaign.destroy();
    return true;
  }
}
