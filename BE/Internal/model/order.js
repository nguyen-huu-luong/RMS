'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Order.init({
    status: DataTypes.STRING,
    descriptions: DataTypes.STRING,
    discountAmount: DataTypes.FLOAT,
    amount: DataTypes.FLOAT,
    num_items: DataTypes.INTEGER,
    shippingAddress: DataTypes.STRING,
    paymentMethod: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};