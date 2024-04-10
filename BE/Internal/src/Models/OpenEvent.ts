import { DataTypes, Model } from "sequelize";
import Loader from "../Loaders";
import Client from "./Client";
import Message from "./Message";
import Campaign from "./Campaign";

class OpenEvent extends Model {
    public static associate() {
        OpenEvent.belongsTo(Campaign, {
            foreignKey: {
                name: "campaignId",
                allowNull: false,
            },
        });
    }
}
OpenEvent.init(
    {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        timeOpen: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        sequelize: Loader.sequelize,
        modelName: "OpenEvent",
    }
);
export default OpenEvent;
