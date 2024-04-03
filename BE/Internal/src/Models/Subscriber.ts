import { DataTypes, Model } from "sequelize";
import Loader from "../Loaders";

class Subscriber extends Model {
    public static associate() {}
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
