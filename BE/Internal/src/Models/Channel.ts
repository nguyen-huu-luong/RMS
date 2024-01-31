import { DataTypes, Model } from "sequelize";
import Loader from "../Loaders";
import Client from "./Client";
import Message from "./Message";

class Channel extends Model {
    getMessages: any;
    public static associate() {
        Channel.belongsTo(Client, {
            foreignKey: {
                name: "clientId",
                allowNull: false,
            },
        });
        Channel.hasMany(Message, {
          foreignKey: {
            name: "channelId",
            allowNull: false,
          },
          sourceKey: "id",
        });
    }
}
Channel.init(
    {
        status: DataTypes.STRING,
        last_update: DataTypes.DATE
    },
    {
        sequelize: Loader.sequelize,
        modelName: "Channel",
    }
);
export default Channel;
