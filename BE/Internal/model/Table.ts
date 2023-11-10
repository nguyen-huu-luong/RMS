import {
    Model, DataTypes,
    type BelongsToManySetAssociationsMixin,
    type BelongsToManyAddAssociationMixin,
    type BelongsToManyGetAssociationsMixin,
    type BelongsToManyRemoveAssociationMixin
} from 'sequelize';
import Loader from '../loader';
import Order from './order';

class Table extends Model {
    declare setOrders: BelongsToManySetAssociationsMixin<Order, Order>;
    declare getOrders: BelongsToManyGetAssociationsMixin<Order>;
    declare addOrders: BelongsToManyAddAssociationMixin<Order, Order>;
    declare removeOrders: BelongsToManyRemoveAssociationMixin<Order, Order>;

    public static association() {
        Table.assocOrder();
    }

    public static assocOrder() {
        Table.belongsToMany(Order, { through: "Table_order" });
    }
}

Table.init({
    name: DataTypes.STRING,
    status: DataTypes.STRING,
    capacity: DataTypes.INTEGER,
    floor: DataTypes.INTEGER,
    num_reserved: DataTypes.INTEGER,
}, { sequelize: Loader.sequelize })

export default Table