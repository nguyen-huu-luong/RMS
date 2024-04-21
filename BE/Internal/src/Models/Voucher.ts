import { Model, DataTypes, Sequelize } from "sequelize";
import Loader from "../Loaders";
import Order from "./Order";
import ClientVoucher from "./ClientVoucher";
import Client from "./Client";

class Voucher extends Model {
    getClients: any;
    addClient: any;
    removeClient: any;
    addVoucher: any;
    static associate() {
      Voucher.hasMany(Order, {
        foreignKey: {
          name: "voucherId",
          allowNull: true,
        },
        sourceKey: "id",
      });
      Voucher.belongsToMany(Client, {
        through: ClientVoucher,
        foreignKey: "voucherId",
        otherKey: "clientId",
      });
    }

}

Voucher.init(
    {
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        promo_code: DataTypes.STRING,
        type: DataTypes.STRING,
        amount: DataTypes.INTEGER,
        maximum_reduce: DataTypes.INTEGER,
        quantity: DataTypes.INTEGER,
        minimum_paid: DataTypes.INTEGER,
        begin_date: DataTypes.DATE,
        end_date: DataTypes.DATE,
    },
    {
        sequelize: Loader.sequelize,
        modelName: "Voucher",
    }
);

export default Voucher;
