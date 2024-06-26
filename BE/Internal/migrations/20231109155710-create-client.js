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
        type: Sequelize.STRING,
        allowNull: false
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
        type: Sequelize.STRING
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
      convertDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      segmentDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      lastPurchase: {
        type: Sequelize.DATE,
        allowNull: true
      },
      hashedPassword: {
        type: Sequelize.STRING
      },
      isRegistered: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      isActive: {
        type: Sequelize.BOOLEAN
      },
      language: {
        type: Sequelize.STRING
      },
      profit: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      total_items: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      average: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
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