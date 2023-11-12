import { Model, DataTypes } from "sequelize";
import Loader from "../loader";
import { Product, Client, OrderItem } from ".";

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
