import { DataTypes, Model } from "sequelize";
import Loader from "../Loaders";
import Client from "./Client";
import Message from "./Message";
import Campaign from "./Campaign";

class ClickEvent extends Model {
    public static associate() {
        ClickEvent.belongsTo(Campaign, {
            foreignKey: {
                name: "campaignId",
                allowNull: false,
            },
        });
    }
}
ClickEvent.init(
    {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        timeClick: {
            type: DataTypes.DATE,
            allowNull: false,
        },

        url: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize: Loader.sequelize,
        modelName: "ClickEvent",
    }
);
export default ClickEvent;
