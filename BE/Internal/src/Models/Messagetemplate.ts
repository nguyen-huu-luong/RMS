import { Model, DataTypes } from "sequelize";
import Loader from "../Loaders";
import EmailCampaign from "./EmailCampaign";

class MessageTemplate extends Model {
    static associate() { 
        MessageTemplate.hasMany(EmailCampaign, {
            foreignKey: {
				name: "templateId",
				allowNull: true,
			},
        })

    }
}

MessageTemplate.init(
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        deleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    { sequelize: Loader.sequelize }
);

export default MessageTemplate;
