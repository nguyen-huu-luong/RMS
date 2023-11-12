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

  class Reservation extends Model {
    public static association() {
      // Client.assocOrder();
      // Client.assocAccount();
    }
  };
  Reservation.init(
    {
      customerCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: true, // Example: Ensures the value is an integer
        },
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dateTo: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isDate: true, // Example: Ensures the value is a valid date
        },
      },
      description: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize: Loader.sequelize
    }
  );
  
  export default Reservation;