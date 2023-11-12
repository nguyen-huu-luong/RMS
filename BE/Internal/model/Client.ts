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
import bcrypt from "bcrypt";
import Loader from "../loader";
import Order from "./Order";
import Cart from "./Cart";
import Employee from "./Employee";
import TargetList from "./Targetlist";
import ClientTargetList from "./ClientTargetList";

class Client extends Model {
	declare getOrders: HasManyGetAssociationsMixin<Order>;
	declare setOrders: HasManySetAssociationsMixin<Order, Order>;
	declare addOrders: HasManyAddAssociationMixin<Order, Order>;
	declare removeOrders: HasManyRemoveAssociationsMixin<Order, Order>;
	declare getClient: HasOneGetAssociationMixin<Client>;
	declare setClient: HasOneSetAssociationMixin<Client, Client>;
	declare createClient: HasOneCreateAssociationMixin<Client>;

	declare isRegistered: boolean;
	declare firstname: string;
	declare lastname: string;
	declare hashedPassword: string;

	public static associate() {
		Client.hasMany(Order, {
			foreignKey: {
				name: "clientId",
				allowNull: false,
			},
			sourceKey: "id",
		});

		Client.hasOne(Cart, {
			foreignKey: {
				name: "clientId",
				allowNull: false,
			},
			sourceKey: "id",
		});

		Client.belongsTo(Employee, {
			foreignKey: {
				name: "creatorId",
				allowNull: true,
			},
		});

		Client.belongsToMany(TargetList, {
			through: ClientTargetList,
			foreignKey: "clientId",
			otherKey: "targetListId",
		});
	}

	async checkPassword(password: string) {
		const result = await bcrypt.compare(password, this.hashedPassword);
		return result;
	}
}

Client.init(
	{
		email: {
			type: DataTypes.STRING,
			allowNull: true,
			unique: true,
			validate: {
				isEmail: true,
			},
		},
		phone: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		firstname: {
			type: DataTypes.STRING,
			allowNull: true,
			validate: {
				len: [1, 50],
			},
		},
		lastname: {
			type: DataTypes.STRING,
			allowNull: true,
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
			values: [],
		},
		hashedPassword: {
			type: DataTypes.STRING,
		},
		isRegistered: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		isActive: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true,
		},
		language: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: "vi",
		},
	},
	{ sequelize: Loader.sequelize }
);

export default Client;
