"use strict";
const faker = require("faker");
module.exports = {
	up: async (queryInterface, Sequelize) => {
		const clients = Array.from({ length: 20 }, () => ({
			email: faker.internet.email(),
			phone: faker.phone.phoneNumber(),
			firstname: faker.name.firstName(),
			lastname: faker.name.lastName(),
			gender: faker.random.boolean(),
			birthday: faker.date.past(),
			avatar: faker.image.avatar(),
			score: faker.random.number(),
			address: faker.address.streetAddress(),
			source: faker.random.word(),
			type: faker.random.word(),
			hashedPassword: faker.internet.password(),
			isRegistered: faker.random.boolean(),
			isActive: faker.random.boolean(),
			language: "vi", // Assuming a default language
			createdAt: new Date(),
			updatedAt: new Date(),
		}));        

	},

	down: async (queryInterface, Sequelize) => {
		/**
		 * Add commands to revert seed here.
		 *
		 * Example:
		 * await queryInterface.bulkDelete('People', null, {});
		 */
        await queryInterface.bulkDelete('Clients', null, {});
	},
};
