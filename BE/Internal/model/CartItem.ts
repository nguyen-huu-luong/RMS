import { DataTypes, Model } from "sequelize";
import Loader from "../loader";

class CartItem extends Model {}

CartItem.init(
	{
		cartId: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			references: {
				model: "Carts",
				key: "id",
			},
			allowNull: false,
			onDelete: "CASCADE",
		},
		productId: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			references: {
				model: "Products",
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
		modelName: "CartItem",
	}
);

export default CartItem;
