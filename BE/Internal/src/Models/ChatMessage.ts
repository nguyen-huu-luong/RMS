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
  class ChatMessage extends Model {
     public static association() {
      // Client.assocOrder();
      // Client.assocAccount();
    }
  };
  ChatMessage.init(
    {
      body: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sentAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      isRead: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      readAt: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize: Loader.sequelize
    }
  );
  
  export default ChatMessage;