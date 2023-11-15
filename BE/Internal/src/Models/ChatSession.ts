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
import Client from "./Client";
import Employee from "./Employee";
import Loader from "../Loaders";
import ChatMessage from "./ChatMessage";
class ChatSession extends Model {
    public static associate() {
        ChatSession.belongsTo(Client, {
            foreignKey: {
                name: "clientId",
                allowNull: false,
            },
        });
        ChatSession.belongsTo(Employee, {
            foreignKey: {
                name: "employeeId",
                allowNull: false,
            },
        });
        ChatSession.hasMany(ChatMessage, {
          foreignKey: {
            name: "sessionId",
            allowNull: false,
          },
          sourceKey: "id",
        });
    }
}
ChatSession.init(
    {
        status: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        startAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        endAt: {
            type: DataTypes.DATE,
        },
    },
    {
        sequelize: Loader.sequelize,
    }
);

export default ChatSession;
