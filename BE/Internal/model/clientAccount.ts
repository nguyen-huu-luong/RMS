import {
    Model, DataTypes,
    type BelongsToCreateAssociationMixin,
    type BelongsToGetAssociationMixin,
    type BelongsToSetAssociationMixin
} from 'sequelize';
import Client from './Client';
import Loader from '../loader';

class ClientAccount extends Model {
    declare setClient: BelongsToSetAssociationMixin<Client, Client>;
    declare getClient: BelongsToGetAssociationMixin<Client>;
    declare createClient: BelongsToCreateAssociationMixin<Client>;

    public static association() {
        ClientAccount.assocClient();
    }

    public static assocClient() {
        ClientAccount.belongsTo(Client);
    }
}

ClientAccount.init(    {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hashedPassword: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isRegistered: {
      type: DataTypes.BOOLEAN,
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
  }, { sequelize: Loader.sequelize })

export default ClientAccount;
