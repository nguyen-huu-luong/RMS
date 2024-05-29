'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('TrackUrls', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      redirectUrl: {
        type: Sequelize.STRING,
        allowNull: false
      },
      codeToInsert: {
        type: Sequelize.STRING,
        allowNull: false
      },
      campaignId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Campaigns',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
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
    await queryInterface.dropTable('TrackUrls');
  }
};