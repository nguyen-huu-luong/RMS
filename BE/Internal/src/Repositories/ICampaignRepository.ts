import { Campaign, Cart } from "../Models";
import { CampaignData } from "../Services";
import { IBaseRepository } from "./IBaseRepository";

export interface ICamPaignRepository extends IBaseRepository<Campaign> {
  updateCampaign(
    id: number,
    data: CampaignData,
  ): Promise<Object>;
}
