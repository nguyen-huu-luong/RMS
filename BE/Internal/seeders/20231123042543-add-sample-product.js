"use strict";
const faker = require("faker");
module.exports = {
    up: async (queryInterface, Sequelize) => {
      const products = Array.from({ length: 50 }, () => {
			return {
            name: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            price: faker.commerce.price(),
            thumbnails: faker.image.image(),
			      categoryId: faker.random.number({ min: 1, max: 7 }),
            createdAt: new Date(),
            updatedAt: new Date(),
			}
        });
        await queryInterface.bulkInsert("Products", products);
    },

    down: async (queryInterface, Sequelize) => {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete("Products", null, {});
    },
};