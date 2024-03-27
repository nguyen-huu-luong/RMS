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
    HasManyCreateAssociationMixin,
    HasManyRemoveAssociationMixin,
} from "sequelize";
import bcrypt from "bcrypt";
import Loader from "../Loaders";
import Order from "./Order";
import Cart from "./Cart";
import Employee from "./Employee";
import TargetList from "./Targetlist";
import ClientTargetList from "./ClientTargetList";
import Reservation from "./Reservation";
import ChatSession from "./ChatSession";
import Token from "./Token";
import { ACCESS_TOKEN, REFRESH_TOKEN, Role } from "../Constants";
import jwt from "jsonwebtoken";
import { TokenUtil } from "../Utils";
import Person from "./Person";
import Voucher from "./Voucher";
import ClientVoucher from "./ClientVoucher";
import Channel from "./Channel";
import Message from "./Message";

class Client extends Person {
	declare getOrders: HasManyGetAssociationsMixin<Order>;
	declare setOrders: HasManySetAssociationsMixin<Order, Order>;
	declare addOrders: HasManyAddAssociationMixin<Order, Order>;
	declare removeOrders: HasManyRemoveAssociationsMixin<Order, Order>;
	declare getClient: HasOneGetAssociationMixin<Client>;


    declare createToken: HasManyCreateAssociationMixin<Token>
    declare getTokens: HasManyGetAssociationsMixin<Token> 
    declare removeTokens: HasManyRemoveAssociationsMixin<Token, number>

	declare id: number;
	declare firstname: string;
	declare lastname: string;
	declare email: string;
	declare isRegistered: boolean;
	declare hashedPassword: string;
    getVouchers: any;
    getChannel: any;
    createMessage: any;
	createChannel: any;

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

		Client.hasMany(Reservation, {
			foreignKey: {
				name: "clientId",
				allowNull: false,
			},
			sourceKey: "id",
		});

		Client.hasMany(ChatSession, {
			foreignKey: {
				name: "clientId",
				allowNull: false,
			},
			sourceKey: "id",
		});

		Client.hasMany(Token, { foreignKey: "tokenableId", constraints: false, scope: {
            tokenableType: 'client'
        } });
		Client.belongsToMany(Voucher, {
			through: ClientVoucher,
			foreignKey: "clientId",
			otherKey: "voucherId",
		  });

		Client.hasOne(Channel, {
			foreignKey: {
				name: "clientId",
				allowNull: false,
			},
			sourceKey: "id",
		});
		Client.hasMany(Message, {
			foreignKey: {
				name: "clientId",
				allowNull: true,
			},
			sourceKey: "id",
		});
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
			type: DataTypes.STRING,
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
		profit: {
			type: DataTypes.INTEGER,
		},
	},
	{ sequelize: Loader.sequelize }
);

export default Client;
