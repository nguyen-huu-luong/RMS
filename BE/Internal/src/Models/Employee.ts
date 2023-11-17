import { DataTypes } from "sequelize";
import Client from "./Client";
import Reservation from "./Reservation";
import ChatSession from "./ChatSession";
import Person from "./Person";
import Loader from "../Loaders";
import Token from "./Token";
class Employee extends Person {
	public static associate() {
		Employee.hasMany(Client, {
			foreignKey: {
				name: "creatorId",
				allowNull: true,
			},
		});
		Employee.hasMany(Reservation, {
			foreignKey: {
				name: "creatorId",
				allowNull: true,
			},
		});
		Employee.hasMany(ChatSession, {
			foreignKey: {
				name: "employeeId",
				allowNull: true,
			},
			sourceKey: "id",
		});

		Employee.hasMany(Token, {
			foreignKey: "tokenableId",
			constraints: false,
			scope: {
				tokenableType: "employee",
			},
		});
	}
}

Employee.init(
	{
		username: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		phone: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		firstname: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		lastname: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		gender: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
		},
		birthday: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		avatar: {
			type: DataTypes.BLOB,
			allowNull: true,
		},
		role: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		hashedPassword: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		isActive: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
		},
		language: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		sequelize: Loader.sequelize,
	}
);

export default Employee;
