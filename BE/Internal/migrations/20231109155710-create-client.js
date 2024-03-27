'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Clients', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING
      },
      firstname: {
        type: Sequelize.STRING
      },
      lastname: {
        type: Sequelize.STRING
      },
      gender: {
        type: Sequelize.BOOLEAN
      },
      birthday: {
        type: Sequelize.DATE
      },
      avatar: {
        type: Sequelize.BLOB
      },
      score: {
        type: Sequelize.INTEGER
      },
      address: {
        type: Sequelize.STRING
      },
      source: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING
      },
      hashedPassword: {
        type: Sequelize.STRING
      },
      isRegistered: {
        type: Sequelize.BOOLEAN
      },
      isActive: {
        type: Sequelize.BOOLEAN
      },
      language: {
        type: Sequelize.STRING
      },
      profit: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Clients');
  }
};