import { DataTypes, Model } from "sequelize";
import Loader from "../Loaders";

class ClientVoucher extends Model {}

ClientVoucher.init(
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
		voucherId: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			references: {
				model: "Vouchers",
				key: "id",
			},
			allowNull: false,
			onDelete: "CASCADE",
		},
		quantity: {
			allowNull: false,
			type: DataTypes.INTEGER,	
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
		modelName: "ClientVoucher",
	}
);


export default ClientVoucher;