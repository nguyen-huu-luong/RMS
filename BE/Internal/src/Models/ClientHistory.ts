import { Model, DataTypes } from "sequelize";
import Loader from "../Loaders";
import { Product, Client, Order } from ".";
import Voucher from "./Voucher";

class ClientHistory extends Model {
    getProducts: any;
    addProduct: any;
    addProducts: any;
    setVoucher: any;
    setProducts: any;
    setProduct: any;
	static associate() {
		ClientHistory.belongsTo(Client, {
			foreignKey: {
				name: "clientId",
				allowNull: false,
			},
		});

		ClientHistory.belongsTo(Product, {
            foreignKey: {
                name: "productId",
                allowNull: true,
            },
		});

		ClientHistory.belongsTo(Order, {
            foreignKey: {
                name: "orderId",
                allowNull: true,
            },
		});
	}
}

ClientHistory.init(
	{
		action: DataTypes.STRING,
	},
	{ sequelize: Loader.sequelize }
);

export default ClientHistory;
