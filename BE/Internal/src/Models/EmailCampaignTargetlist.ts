import { DataTypes, Model } from "sequelize";
import Loader from "../Loaders";
import EmailCampaign from "./EmailCampaign";

class EmailCampaignTargetList extends Model {}

EmailCampaignTargetList.init(
  {
    emailId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: "EmailCampaigns",
            key: "id"
        },
        allowNull: false,
        onDelete: "CASCADE"
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
  },
  {
    sequelize: Loader.sequelize,
    modelName: "EmailCampaignTargetList",
  }
);

export default EmailCampaignTargetList;
