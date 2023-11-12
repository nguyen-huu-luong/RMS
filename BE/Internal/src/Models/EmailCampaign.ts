import { DataTypes, Model } from "sequelize";
import Loader from "../Loaders";
import Campaign from "./Campaign";

class EmailCampaign extends Model {
	/**
	 * Helper method for defining associations.
	 * This method is not a part of Sequelize lifecycle.
	 * The `models/index` file will call this method automatically.
	 */
	static associate() {
		EmailCampaign.belongsTo(Campaign, {
			foreignKey: {
				name: "campaignId",
			},
		});
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
