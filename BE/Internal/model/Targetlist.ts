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
import Loader from "../loader";
import Client from "./Client";
import { CampaignTargetList, Campaign, ClientTargetList } from ".";
class TargetList extends Model {
	public static associate() {
		TargetList.belongsToMany(Client, {
			through: ClientTargetList,
			foreignKey: "targetListId",
			otherKey: "clientId",
		});

		TargetList.belongsToMany(Campaign, {
			through: CampaignTargetList,
			foreignKey: "targetListId",
			otherKey: "campaignId",
		});
	}
}
TargetList.init(
	{
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		description: {
			type: DataTypes.STRING,
		},
	},
	{
		sequelize: Loader.sequelize,
	}
);

export default TargetList;
