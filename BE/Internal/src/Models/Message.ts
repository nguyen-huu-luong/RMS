import { DataTypes, Model } from "sequelize";
import Loader from "../Loaders";
import Client from "./Client";
import Employee from "./Employee";
import Channel from "./Channel";

class Message extends Model {
    public static associate() {
        Message.belongsTo(Client, {
            foreignKey: {
                name: "clientId",
                allowNull: true,
            },
        });
        Message.belongsTo(Employee, {
            foreignKey: {
                name: "employeeId",
                allowNull: true,
            },
        });
        Message.belongsTo(Channel, {
            foreignKey: {
                name: "channelId",
                allowNull: false,
            },
        });
    }
}
Message.init(
    {
        content: DataTypes.STRING,
        status: DataTypes.STRING,
    },
    {
        sequelize: Loader.sequelize,
        modelName: "Message",
    }
);
export default Message;
