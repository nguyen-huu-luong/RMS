import { DataTypes, Model } from "sequelize";
import Loader from "../Loaders";

class CampaignTargetList extends Model {}

CampaignTargetList.init(
	{
		campaignId: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			references: {
				model: "Campaigns",
				key: "id",
			},
			allowNull: false,
			onDelete: "CASCADE",
		},
		targetListId: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			references: {
				model: "TargetLists",
				key: "id",
			},
			allowNull: false,
			onDelete: "CASCADE",
		},
		createdAt: {
			allowNull: false,
			type: DataTypes.DATE,
		},
		updatedAt: {
			allowNull: false,
			type: DataTypes.DATE,
		},
	},
	{
		sequelize: Loader.sequelize,
		modelName: "CampaignTargetList",
	}
);


export default CampaignTargetList;