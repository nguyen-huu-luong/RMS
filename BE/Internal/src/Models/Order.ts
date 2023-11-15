import { Model, DataTypes } from "sequelize";
import Loader from "../Loaders";
import { Product, Client, OrderItem, Table } from ".";
import TableOrder from "./TableOrder";
class Order extends Model {
	static associate() {
		Order.belongsTo(Client, {
			foreignKey: {
				name: "clientId",
			},
		});

		Order.belongsToMany(Product, {
			through: OrderItem,
			foreignKey: "orderId",
			otherKey: "productId",
		});

		Order.belongsToMany(Table, {
			through: TableOrder,
			foreignKey: "orderId",
			otherKey: "tableId",
		});
	}
}

Order.init(
	{
		status: DataTypes.STRING,
		descriptions: DataTypes.STRING,
		discountAmount: DataTypes.FLOAT,
		amount: DataTypes.FLOAT,
		num_items: DataTypes.INTEGER,
		shippingAddress: DataTypes.STRING,
		paymentMethod: DataTypes.STRING,
	},
	{ sequelize: Loader.sequelize }
);

export default Order;
