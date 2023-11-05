import {
    Model, DataTypes,
    type HasManyAddAssociationMixin,
    type HasManySetAssociationsMixin,
    type HasManyGetAssociationsMixin,
    type HasManyRemoveAssociationsMixin,
    type HasOneGetAssociationMixin,
    type HasOneSetAssociationMixin,
    type HasOneCreateAssociationMixin
} from 'sequelize';
import Order from './order';
import Loader from '../loader';
import ClientAccount from './clientAccount';

class Customer extends Model {
    declare getOrders: HasManyGetAssociationsMixin<Order>;
    declare setOrders: HasManySetAssociationsMixin<Order, Order>
    declare addOrders: HasManyAddAssociationMixin<Order, Order>;
    declare removeOrders: HasManyRemoveAssociationsMixin<Order, Order>;
    declare getCustomer: HasOneGetAssociationMixin<Customer>;
    declare setCustomer: HasOneSetAssociationMixin<Customer, Customer>;
    declare createCustomer: HasOneCreateAssociationMixin<Customer>;

    public static association() {
        Customer.assocOrder();
        Customer.assocAccount();
    }

    public static assocOrder() {
        Customer.hasMany(Order);
    }

    public static assocAccount() {
        Customer.hasOne(ClientAccount);
    }
}

Customer.init({
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    gender: DataTypes.STRING,
    birthday: DataTypes.DATEONLY,
    avatar: DataTypes.BLOB,
    score: DataTypes.INTEGER,
    address: DataTypes.STRING,
}, { sequelize: Loader.sequenlize })

export default Customer;
