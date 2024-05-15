import {
	Model,
	DataTypes,
	
	BelongsToManyAddAssociationMixin,
	BelongsToManyAddAssociationsMixin,
	BelongsToManySetAssociationsMixin,
	BelongsToManyRemoveAssociationMixin,
	BelongsToManyRemoveAssociationsMixin,
	BelongsToManyGetAssociationsMixinOptions,
	BelongsToManyGetAssociationsMixin,
} from "sequelize";
import Loader from "../Loaders";
import Client from "./Client";
import { CampaignTargetList, Campaign, ClientTargetList, EmailCampaign } from ".";
import EmailCampaignTargetList from "./EmailCampaignTargetlist";
class TargetList extends Model {
	declare getClients: BelongsToManyGetAssociationsMixin<Client>
	declare setClients: BelongsToManySetAssociationsMixin<Client, Client["id"]>;
	declare addClient:  BelongsToManyAddAssociationMixin<Client, Client["id"]> ;
	declare addClients:   BelongsToManyAddAssociationsMixin<Client, Client["id"]> ;
	declare removeClient: BelongsToManyRemoveAssociationMixin<Client, number> ;
	declare removeClients: BelongsToManyRemoveAssociationsMixin<Client, number> ;
	declare id: number
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

		TargetList.belongsToMany(EmailCampaign, {
			through: EmailCampaignTargetList,
			foreignKey: "targetListId",
			otherKey: "emailId"
		})
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
