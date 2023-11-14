'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Permissions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      resource: {
        type: Sequelize.STRING
      },
      role: {
        type: Sequelize.STRING
      },
      action: {
        type: Sequelize.STRING,
      },
      attributes: {
        type: Sequelize.STRING
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
    await queryInterface.addConstraint('Permissions', {
        type: 'unique',
        fields: ['action', 'resource', 'role'],
        name: 'unique_action_resource_role_constraint'
      });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('Permissions', 'unique_action_resource_role_constraint');
    await queryInterface.dropTable('Permissions');
  }
};