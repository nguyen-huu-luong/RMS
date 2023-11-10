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
import Order from "./order";
import Loader from "../loader";
import ClientAccount from "./clientAccount";

class Client extends Model {
	// declare getOrders: HasManyGetAssociationsMixin<Order>;
	// declare setOrders: HasManySetAssociationsMixin<Order, Order>;
	// declare addOrders: HasManyAddAssociationMixin<Order, Order>;
	// declare removeOrders: HasManyRemoveAssociationsMixin<Order, Order>;
	// declare getClient: HasOneGetAssociationMixin<Client>;
	// declare setClient: HasOneSetAssociationMixin<Client, Client>;
	// declare createClient: HasOneCreateAssociationMixin<Client>;

	public static association() {
		// Client.assocOrder();
		// Client.assocAccount();
	}

	// public static assocOrder() {
	// 	Client.hasMany(Order);
	// }

	// public static assocAccount() {
	// 	Client.hasOne(ClientAccount);
	// }
}

Client.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      firstname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1, 50],
        },
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1, 50],
        },
      },
      gender: {
        type: DataTypes.BOOLEAN,
      },
      birthday: {
        type: DataTypes.DATE,
      },
      avatar: {
        type: DataTypes.BLOB,
      },
      score: {
        type: DataTypes.INTEGER,
      },
      address: {
        type: DataTypes.STRING,
      },
      source: {
        type: DataTypes.STRING,
      },
      type: {
        type: DataTypes.STRING,
        values: []
      },
    },
    { sequelize: Loader.sequelize }
  );
  
  export default Client;
