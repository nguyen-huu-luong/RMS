import { DataTypes, Model } from "sequelize";
import Loader from "../Loaders";
import Client from './Client';
class Subscriber extends Model {
    public static associate() {
        Subscriber.belongsTo(Client, {
            foreignKey: {
                name: "clientId",
                allowNull: true
            },
        });
    }
}
Subscriber.init(
    {
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        phone: DataTypes.STRING,
    },
    {
        sequelize: Loader.sequelize,
        modelName: "Subscriber",
    }
);
export default Subscriber;
