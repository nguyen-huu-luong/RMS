'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const categoriesData = [
      "Pizza",
      "Drink",
      "Fruits",
      "Hotdog",
      "Snacks",
      "Burger",
      "Veggies",
    ];

    const categories = categoriesData.map((name) => ({
      name: name,
      description: 'Some description', // You can customize the description
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert('Categories', categories, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Categories', null, {});
  },
};