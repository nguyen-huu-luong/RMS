import { Campaign, Cart } from "../Models";
import { CampaignData, TrackUrlData } from "../Services";
import { IBaseRepository } from "./IBaseRepository";

export interface ICamPaignRepository extends IBaseRepository<Campaign> {
  updateCampaign(
    id: number,
    data: CampaignData,
  ): Promise<Object>;

  createTrackUrl(campaignId: number, data: TrackUrlData): Promise<any> ;
  deleteTrackUrl(campaignId: number, trackUrlId: number): Promise<any> ;
  getStatistic(campaignsId: number): Promise<any>
}
