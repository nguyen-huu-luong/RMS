import { BelongsToManySetAssociationsMixin, DataTypes, Model } from "sequelize";
import Loader from "../Loaders";
import Campaign from "./Campaign";
import TargetList from "./Targetlist";
import EmailCampaignTargetList from "./EmailCampaignTargetlist";
import MessageTemplate from "./Messagetemplate";

class TrackUrl extends Model {
	declare id:number ;
	static associate() {
		TrackUrl.belongsTo(Campaign, {
			foreignKey: {
				name: "campaignId",
			},
            onDelete: "SET NULL"
		});
	}
}
TrackUrl.init(
	{
		name: {
            type: DataTypes.STRING,
            allowNull: false 
        },
        redirectUrl: {
            type: DataTypes.STRING,
            allowNull: false
        },
		codeToInsert: {
            type: DataTypes.STRING,
            allowNull: false
        }
	},
	{
		sequelize: Loader.sequelize,
	}
);

export default TrackUrl;
