'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Employee.init({
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    gender: DataTypes.BOOLEAN,
    birthday: DataTypes.DATE,
    avatar: DataTypes.BLOB,
    role: DataTypes.STRING,
    hashedPassword: DataTypes.STRING,
    isActive: DataTypes.BOOLEAN,
    language: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Employee',
  });
  return Employee;
};