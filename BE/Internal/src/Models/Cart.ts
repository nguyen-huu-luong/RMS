import {
	Model,
	DataTypes,
	type HasManyAddAssociationMixin,
	type HasManySetAssociationsMixin,
	type HasManyGetAssociationsMixin,
	type HasManyRemoveAssociationsMixin,
	type HasOneGetAssociationMixin,
	type HasOneSetAssociationMixin,
	type HasOneCreateAssociationMixin,
} from "sequelize";
import Loader from "../Loaders";
import Client from "./Client";
import Product from "./Product";
import CartItem from "./CartItem";
import Table from "./Table";
class Cart extends Model {
	public static associate() {
		Cart.belongsTo(Client, {
			foreignKey: {
				name: "clientId",
                allowNull: true
			},
		});

		Cart.belongsTo(Table, {
			foreignKey: {
				name: "tableId",
                allowNull: true
			},
		})

        Cart.belongsToMany(Product, {through: CartItem, foreignKey: "cartId", otherKey: 'productId'})
	}
}
Cart.init(
	{
		total: {
			type: DataTypes.FLOAT,
			allowNull: false,
			validate: {
				isFloat: true,
			},
			defaultValue: 0,
		},
		amount: {
			type: DataTypes.FLOAT,
			allowNull: false,
			validate: {
				isFloat: true,
			},
			defaultValue: 0,
		},
	},
	{
		sequelize: Loader.sequelize,
	}
);

export default Cart;
