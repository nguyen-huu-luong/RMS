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
import Loader from "../Loaders";
import Client from "./Client";
import Reservation from "./Reservation";
import ChatSession from "./ChatSession";
class Employee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
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
        Client.hasMany(ChatSession, {
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
