import { Model, DataTypes, Sequelize } from "sequelize";
import Loader from "../Loaders";

class Permission extends Model {}

Permission.init(
	{
		role: DataTypes.STRING,
		resource: DataTypes.STRING,
		action: DataTypes.STRING,
		attributes: DataTypes.STRING,
	},
	{
		sequelize: Loader.sequelize,
		modelName: "Permission",
	}
);

export default Permission ;


