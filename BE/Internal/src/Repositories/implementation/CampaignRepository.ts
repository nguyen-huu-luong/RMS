import { injectable } from "inversify";
import "reflect-metadata";
import { BaseRepository } from "./BaseRepository";
import { Campaign } from "../../Models";
import { ICamPaignRepository } from "../ICampaignRepository";
import { RecordNotFoundError } from "../../Errors";
import { CampaignData, TrackUrlData } from "../../Services";
import { sequelize } from "../../Configs";
import { Transaction } from "sequelize";
import shortid from "shortid";
import ClickEvent from "../../Models/ClickEvent";
import OpenEvent from "../../Models/OpenEvent";

@injectable()
export class CampaignRepository
	extends BaseRepository<Campaign>
	implements ICamPaignRepository {
	constructor() {
		super(Campaign);
	}

	public async findById(id: number, attributes?: string[]): Promise<Campaign> {
		const campaign = await this._model.findByPk(id, {
			include: [{ all: true }],
		});

		if (!campaign) {
			throw new RecordNotFoundError();
		}

		return campaign;
	}

	public async updateCampaign(
		id: number,
		data: CampaignData,
	): Promise<Object> {
		console.log("Update compaign api")
		const t = await sequelize.getSequelize().transaction();
		try {
			console.log(data)
			let campaign = await this.findById(id);
			const { targetlists, emailCampaigns, ...campaignInfo } = data;
			if (targetlists) {
				console.log("update targetlist", targetlists)
				await this.updateTargetlistCampaign(campaign, targetlists.action, targetlists.ids, t);
			}

			if (emailCampaigns) {
				console.log("update email Campaigns", targetlists)
				await campaign.setEmailCampaigns(emailCampaigns.ids, { transaction: t })
			}

			campaign = await campaign.update(campaignInfo, { transaction: t });
			campaign = await campaign.reload({ transaction: t, include: [{ all: true }] })
			await t.commit()

			return campaign
		} catch (error) {
			await t.rollback()
			console.log(error)

			throw error
		}
	};

	public async createTrackUrl(campaginId: number, data: TrackUrlData): Promise<any> {
		const campaign = await this.findById(campaginId);

		const result = await campaign.createTrackUrl({ ...data, codeToInsert: shortid.generate() });

		return result
	}

	public async deleteTrackUrl(campaginId: number, trackUrlId: number): Promise<any> {
		const campaign = await this.findById(campaginId);

		await campaign.removeTrackUrl(trackUrlId);

		return true
	}

	public async getStatistic(campaignId: number) {
		const campaign = await Campaign.findOne({
			where: { id: campaignId },
			attributes: [
				"Campaign.id",
				[sequelize.getSequelize().literal('(COUNT("ClickEvents"."campaignId"))'), "numClicks"],
				[sequelize.getSequelize().literal('(COUNT("OpenEvents"."campaignId"))'), "numOpens"],
			],
			include: [
				{ model: ClickEvent, attributes: [] },
				{ model: OpenEvent, attributes: [] },
			],
			group: ["Campaign.id"]
		});

		if (!campaign) {
			throw new RecordNotFoundError()
		}

		return campaign

	}

	private async updateTargetlistCampaign(campaignInstance: Campaign, action: string, ids: number[], t?: Transaction) {
		if (action === "add") {
			console.log("add target list to campaign")
			await campaignInstance.addTargetLists(ids, { transaction: t })
		} else if (action === "remove") {
			await campaignInstance.removeTargetLists(ids, { transaction: t })
		} else if (action === "replace") {
			await campaignInstance.setTargetLists(ids, { transaction: t })
		}
	}


}
