import {
    Model, DataTypes,
    type BelongsToCreateAssociationMixin,
    type BelongsToGetAssociationMixin,
    type BelongsToSetAssociationMixin
} from 'sequelize';
import Customer from './customer';
import Loader from '../loader';

class ClientAccount extends Model {
    declare setCustomer: BelongsToSetAssociationMixin<Customer, Customer>;
    declare getCustomer: BelongsToGetAssociationMixin<Customer>;
    declare createCustomer: BelongsToCreateAssociationMixin<Customer>;

    public static association() {
        ClientAccount.assocCustomer();
    }

    public static assocCustomer() {
        ClientAccount.belongsTo(Customer);
    }
}

ClientAccount.init({
    username: DataTypes.STRING,
    phone: DataTypes.INTEGER,
    email: DataTypes.STRING,
    encrypted_password: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN,
    language: DataTypes.STRING,
}, { sequelize: Loader.sequenlize })

export default ClientAccount;
