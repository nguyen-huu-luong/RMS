
import { DataTypes, Model } from "sequelize";
import Loader from "../Loaders";
import Client from "./Client";

class Notification extends Model {
    public static associate() {
        Notification.belongsTo(Client, {
            foreignKey: {
                name: "clientId",
                allowNull: false,
            },
        });
    }
}
Notification.init(
    {
        content: DataTypes.STRING,
        status: DataTypes.BOOLEAN,
        orderStatus: DataTypes.STRING,
    },
    {
        sequelize: Loader.sequelize,
        modelName: "Notification",
    }
);
export default Notification;