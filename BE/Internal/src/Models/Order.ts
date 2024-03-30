import { Model, DataTypes } from "sequelize";
import Loader from "../Loaders";
import { Product, Client, OrderItem, Table } from ".";
import Voucher from "./Voucher";
class Order extends Model {
    getProducts: any;
    addProduct: any;
    addProducts: any;
    setVoucher: any;
	static associate() {
		Order.belongsTo(Client, {
			foreignKey: {
				name: "clientId",
				allowNull: true,
			},
		});

		Order.belongsToMany(Product, {
			through: OrderItem,
			foreignKey: "orderId",
			otherKey: "productId",
		});

		Order.belongsTo(Table, {
            foreignKey: {
                name: "tableId",
                allowNull: true,
            },
		});

		Order.belongsTo(Voucher, {
            foreignKey: {
                name: "voucherId",
                allowNull: true,
            },
        });

		Order.belongsTo(Table, {
            foreignKey: {
                name: "tableId",
                allowNull: true,
            },
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
		shippingCost: DataTypes.FLOAT,
		paymentMethod: DataTypes.STRING,
	},
	{ sequelize: Loader.sequelize }
);

export default Order;
