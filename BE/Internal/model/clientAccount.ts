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

ClientAccount.init({
    username: DataTypes.STRING,
    phone: DataTypes.INTEGER,
    email: DataTypes.STRING,
    encrypted_password: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN,
    language: DataTypes.STRING,
}, { sequelize: Loader.sequelize })

export default ClientAccount;
