import { Model, DataTypes } from "sequelize";
import Loader from "../loader";

class Order extends Model {
	static associate() {}
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

export default Order ;
