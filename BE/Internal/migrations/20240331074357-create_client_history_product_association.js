'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('ClientHistories', 'orderId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Orders',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('ClientHistories', 'orderId');
  },
};