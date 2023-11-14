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
import Token from "./Token";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../Constants";
import jwt from "jsonwebtoken";
import { TokenUtil } from "../Utils";

class Client extends Model {
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

		Client.hasMany(Token, { foreignKey: "clientId" });
	}

	public async checkPassword(password: string) {
		const result = await bcrypt.compare(password, this.hashedPassword);
		return result;
	}

	public generateAccessToken() {
		const user = this;

		if (!ACCESS_TOKEN.secret) {
			throw Error("Can't found serket key!");
		}
		const accessToken = jwt.sign(
			{
				id: user.id.toString(),
				fullName: `${user.firstname} ${user.lastname}`,
				email: user.email,
			},
			ACCESS_TOKEN.secret,
			{
				expiresIn: ACCESS_TOKEN.expiry,
			}
		);

		return accessToken;
	}

	public async generateRefreshToken() {
		const user = this;

		// Create signed refresh token
		if (!REFRESH_TOKEN.secret) {
			throw Error("Can't found serket key!");
		}
		const refreshToken = jwt.sign(
			{
				id: user.id.toString(),
			},
			REFRESH_TOKEN.secret,
			{
				expiresIn: REFRESH_TOKEN.expiry,
			}
		);

		// Create a 'refresh token hash' from 'refresh token'
		const rTknHash = TokenUtil.hash(refreshToken, REFRESH_TOKEN.secret)
            
		// Save 'refresh token hash' to database
		await user.createToken({value: rTknHash});
		await user.save();


		return refreshToken;
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
