import { DataTypes } from "sequelize";
import Client from "./Client";
import Reservation from "./Reservation";
import ChatSession from "./ChatSession";
import Person from "./Person";
import Loader from "../Loaders";
import Token from "./Token";
import Message from "./Message";
class Employee extends Person {
    createMessage: any;
	declare username: string ;
	declare email: string ;
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
		
		Employee.hasMany(Message, {
			foreignKey: {
				name: "employeeId",
				allowNull: true,
			},
			sourceKey: "id",
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
		},
		birthday: {
			type: DataTypes.DATE,
		},
		avatar: {
			type: DataTypes.BLOB,
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
			defaultValue: false
		},
		language: {
			type: DataTypes.STRING,
			defaultValue: "en"
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: false
		}
	},
	{
		sequelize: Loader.sequelize,
	}
);

export default Employee;
