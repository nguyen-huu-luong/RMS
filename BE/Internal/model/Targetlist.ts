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
import Order from "./order";
import Loader from "../loader";
  class TargetList extends Model {
    public static association() {
      // Client.assocOrder();
      // Client.assocAccount();
    }
  };
  TargetList.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize: Loader.sequelize
    }
  );
  
  export default TargetList;