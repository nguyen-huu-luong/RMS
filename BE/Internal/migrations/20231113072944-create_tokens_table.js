// 20231113072944-create_tokens_table.js
module.exports = {
    up: (queryInterface, Sequelize) => {
      return queryInterface.createTable('Tokens', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        value: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        tokenableId: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        tokenableType: {
            type: Sequelize.STRING,
            allowNull: false
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      });
    },
  
    down: (queryInterface, Sequelize) => {
      return queryInterface.dropTable('Tokens');
    },
  };