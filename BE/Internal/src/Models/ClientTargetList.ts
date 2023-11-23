import { DataTypes, Model } from "sequelize";
import Loader from "../Loaders";

class ClientTargetList extends Model {}

ClientTargetList.init(
	{
		clientId: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			references: {
				model: "Clients",
				key: "id",
			},
			allowNull: false,
			onDelete: "CASCADE",
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
		createdAt: {
			allowNull: false,
			type: DataTypes.DATE,
		},
		updatedAt: {
			allowNull: false,
			type: DataTypes.DATE,
		},
	},
	{
		sequelize: Loader.sequelize,
		modelName: "ClientTargetList",
	}
);


export default ClientTargetList;