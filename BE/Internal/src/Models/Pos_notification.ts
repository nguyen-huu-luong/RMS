
import { DataTypes, Model } from "sequelize";
import Loader from "../Loaders";

class Pos_notification extends Model {
    public static associate() {
    }
}
Pos_notification.init(
    {
        content: DataTypes.STRING,
        table: DataTypes.INTEGER
    },
    {
        sequelize: Loader.sequelize,
        modelName: "Pos_notification",
    }
);
export default Pos_notification;