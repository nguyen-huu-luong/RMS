import { DataTypes, Model } from "sequelize";
import Order from "./Order";
import Product from "./Product";
import Loader from "../Loaders";

class OrderItem extends Model {}

OrderItem.init(
	{
		orderId: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			references: {
				model: Order,
				key: "id",
			},
			allowNull: false,
			onDelete: "CASCADE",
		},
		productId: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			references: {
				model: Product,
				key: "id",
			},
			allowNull: false,
			onDelete: "CASCADE",
		},
		amount: {
			type: DataTypes.FLOAT,
			allowNull: false,
			defaultValue: 0,
		},
		quantity: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0,
		},
		status: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: "",
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
		modelName: "OrderItem",
	}
);

export default OrderItem;
