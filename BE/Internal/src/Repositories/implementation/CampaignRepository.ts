import { injectable } from "inversify";
import "reflect-metadata";
import { BaseRepository } from "./BaseRepository";
import { Campaign } from "../../Models";
import { ICamPaignRepository } from "../ICampaignRepository";
import TargetList from "../../Models/Targetlist";
import { RecordNotFoundError } from "../../Errors";
import { CampaignData } from "../../Services";
import { sequelize } from "../../Configs";
import { StringDataType, Transaction } from "sequelize";

@injectable()
export class CampaignRepository
	extends BaseRepository<Campaign>
	implements ICamPaignRepository {
	constructor() {
		super(Campaign);
	}

	public async findById(id: number, attributes?: string[]): Promise<Campaign> {
		const campaign = await this._model.findByPk(id, {
			include: { model: TargetList, as: "TargetLists" },
		});

		if (!campaign) {
			throw new RecordNotFoundError();
		}

		return campaign;
	}

	public async updateCampaign (
		id: number,
		data: CampaignData,
	) : Promise<Object> {
		console.log("Update compaign api")
		const t = await sequelize.getSequelize().transaction();
		try {
			let campaign = await this.findById(id) ;
			const {targetlists, emailCampaigns, ...campaignInfo} = data ;
			if (targetlists) {
				console.log("update targetlist", targetlists)
				await this.updateTargetlistCampaign(campaign, targetlists.action , targetlists.ids,  t );
			}
	
			if (emailCampaigns) {
				await campaign.setEmailCampaign(emailCampaigns.ids, {transaction: t})
			}

			await campaign.update(campaignInfo, {transaction: t});
			campaign = await campaign.save({transaction: t})
			await t.commit()
	
			return JSON.parse(JSON.stringify(campaign))
		} catch (error) {
			await t.rollback() 
			console.log(error)
			
			throw error
		}
	};

	private async updateTargetlistCampaign(campaignInstance: Campaign, action: string, ids: number[], t?: Transaction) {
		if (action === "add") {
			console.log("add target list to campaign")
			await campaignInstance.addTargetLists(ids, {transaction: t})
		} else if (action === "remove") {
			await campaignInstance.removeTargetLists(ids, {transaction: t})
		} else if (action === "replace") {
			await campaignInstance.removeTargetLists(ids, {transaction: t})
		} 
	}
}
