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
  class ChatSession extends Model {
     public static association() {
      // Client.assocOrder();
      // Client.assocAccount();
    }
  };
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
      sequelize: Loader.sequelize
    }
  );
  
  export default ChatSession;  
  