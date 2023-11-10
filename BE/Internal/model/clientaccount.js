'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ClientAccount extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  ClientAccount.init({
    username: DataTypes.STRING,
    role: DataTypes.STRING,
    hashedPassword: DataTypes.STRING,
    isRegisterd: DataTypes.BOOLEAN,
    isActive: DataTypes.BOOLEAN,
    language: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ClientAccount',
  });
  return ClientAccount;
};