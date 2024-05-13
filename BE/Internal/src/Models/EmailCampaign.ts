import { BelongsToManySetAssociationsMixin, DataTypes, Model } from "sequelize";
import Loader from "../Loaders";
import Campaign from "./Campaign";
import TargetList from "./Targetlist";
import EmailCampaignTargetList from "./EmailCampaignTargetlist";
import MessageTemplate from "./Messagetemplate";

class EmailCampaign extends Model {
	declare setTargetLists: BelongsToManySetAssociationsMixin<TargetList, TargetList["id"]>
	declare id:number ;
	static associate() {
		EmailCampaign.belongsTo(Campaign, {
			foreignKey: {
				name: "campaignId",
			},
		});

		EmailCampaign.belongsToMany(TargetList, {
			through: EmailCampaignTargetList,
			foreignKey: "emailId",
			otherKey: "targetListId"
		})

		EmailCampaign.belongsTo(MessageTemplate, {
			foreignKey: {
				name: "templateId",
				allowNull: true,
			},
		})
	}
}
EmailCampaign.init(
	{
		name: DataTypes.STRING,
		status: DataTypes.STRING,
		startDate: DataTypes.DATE,
		subject: DataTypes.STRING,
		sendFrom: DataTypes.STRING,
		sendTo: DataTypes.STRING,
	},
	{
		sequelize: Loader.sequelize,
	}
);

export default EmailCampaign;
