import {
	Model,
	DataTypes,
	type HasManyAddAssociationMixin,
	type HasManySetAssociationsMixin,
	type HasManyGetAssociationsMixin,
	type HasManyRemoveAssociationsMixin,
	type HasOneGetAssociationMixin,
	type HasOneSetAssociationMixin,
	type HasOneCreateAssociationMixin,
} from "sequelize";
import Loader from "../Loaders";
import TargetList from "./Targetlist";
import CampaignTargetList from "./CampaignTargetList";
import EmailCampaign from "./EmailCampaign";

class Campaign extends Model {
	public static associate() {
		Campaign.belongsToMany(TargetList, {
			through: CampaignTargetList,
			foreignKey: "campaignId",
			otherKey: "targetListId",
		});

		Campaign.hasMany(EmailCampaign, {
			foreignKey: {
				name: "campaignId",
                allowNull: false
			},
		});
	}
}

Campaign.init(
	{
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1, 255],
			},
		},
		type: {
			type: DataTypes.STRING,
		},
		status: {
			type: DataTypes.STRING,
		},
		startDate: {
			type: DataTypes.DATE,
		},
		endDate: {
			type: DataTypes.DATE,
		},
		budget: {
			type: DataTypes.FLOAT,
		},
		unit: {
			type: DataTypes.STRING,
		},
		totalSent: {
			type: DataTypes.INTEGER,
		},
	},
	{
		sequelize: Loader.sequelize,
	}
);
export default Campaign;
