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
import Loader from "../loader";
  class Product extends Model {
    public static association() {
      // Client.assocOrder();
      // Client.assocAccount();
    }
  };
  Product.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      thumbnails: {
        type: DataTypes.BLOB,
        allowNull: true,
      },
    },
    {
      sequelize: Loader.sequelize
    }
  );
  
  export default Product;