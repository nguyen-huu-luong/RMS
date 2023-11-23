// models/token.ts
import { DataTypes, Model } from "sequelize";
import { Client, Employee } from "./"; // Import your sequelize instance
import Loader from "../Loaders";


class Token extends Model {
	declare id: number;
	declare value: string;
    declare tokenableId: number ;
    declare tokenableType: string ;

	

	public static associate(): void {
		Token.belongsTo(Client, { foreignKey: "tokenableId", constraints: false });
		Token.belongsTo(Employee, {
			foreignKey: "tokenableId",
			constraints: false,
		});
	}
}

Token.init(
	{
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER,
		},
		value: {
			type: DataTypes.STRING,
			allowNull: false,
		},
        tokenableId: {
            type: DataTypes.INTEGER,
            allowNull: false, 
        },
        tokenableType: {
            type: DataTypes.STRING,
            allowNull: false, 
        }, 

		createdAt: {
			allowNull: false,
			type: DataTypes.DATE,
		},
		updatedAt: {
			allowNull: false,
			type: DataTypes.DATE,
		},
	},
	{
		sequelize: Loader.sequelize,
	}
);

export default Token;
