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
	BelongsToManySetAssociationsMixin,
	BelongsToManyAddAssociationMixin,
	BelongsToManyRemoveAssociationMixin,
	BelongsToManyAddAssociationsMixin,
	BelongsToManyRemoveAssociationsMixin,
} from "sequelize";
import Loader from "../Loaders";
import TargetList from "./Targetlist";
import CampaignTargetList from "./CampaignTargetList";
import EmailCampaign from "./EmailCampaign";
import ClickEvent from "./ClickEvent";
import OpenEvent from "./OpenEvent";

class Campaign extends Model {
	declare setTargetLists: BelongsToManySetAssociationsMixin<TargetList, TargetList["id"]>;
	declare addTargetList: BelongsToManyAddAssociationMixin<TargetList, TargetList["id"]> ;
	declare addTargetLists: BelongsToManyAddAssociationsMixin<TargetList, TargetList["id"]> ;
	declare removeTargetList: BelongsToManyRemoveAssociationMixin<TargetList, number> ;
	declare removeTargetLists: BelongsToManyRemoveAssociationsMixin<TargetList, number> ;

	declare setEmailCampaign: HasManySetAssociationsMixin<EmailCampaign, number>;

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

		Campaign.hasMany(ClickEvent, {
			foreignKey: {
				name: "campaignId",
                allowNull: false
			},
		});

		Campaign.hasMany(OpenEvent, {
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
