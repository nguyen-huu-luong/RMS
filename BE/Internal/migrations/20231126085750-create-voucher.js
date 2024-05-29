'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Vouchers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      promo_code: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING
      },
      amount: {
        type: Sequelize.INTEGER
      },
      maximum_reduce: {
        type: Sequelize.INTEGER
      },
      minimum_paid: {
        type: Sequelize.INTEGER
      },
      quantity: {
        type: Sequelize.INTEGER
      },
      begin_date: {
        type: Sequelize.DATE
      },
      end_date: {
        type: Sequelize.DATE
      },
      can_redeem: {
        type: Sequelize.BOOLEAN
      },
      redeemedNumber: {
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
    await queryInterface.dropTable('Vouchers');
  }
};