"use strict";
const bcrypt = require('bcrypt')
const faker = require("faker");
module.exports = {
    up: async (queryInterface, Sequelize) => {
        const clientPassword = await bcrypt.hash("client", 10) ;
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
            hashedPassword: clientPassword,
            isRegistered: faker.random.boolean(),
            isActive: faker.random.boolean(),
            language: "vi", // Assuming a default language
            createdAt: new Date(),
            updatedAt: new Date(),
        }));
        const admins = [
            {
                username: "manager",
                email: faker.internet.email(),
                phone: faker.phone.phoneNumber(),
                firstname: "Manager",
                lastname: 'Manager',
                role: "manager",
                gender: faker.random.boolean(),
                birthday: faker.date.past(),
                hashedPassword: await bcrypt.hash("manager", 10),
                isActive: true,
                language: "vi",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                username: "staff",
                email: faker.internet.email(),
                phone: faker.phone.phoneNumber(),
                firstname: "Staff",
                lastname: 'Staff',
                role: 'employee',
                gender: faker.random.boolean(),
                birthday: faker.date.past(),
                hashedPassword: await bcrypt.hash("staff", 10),
                isActive: true,
                language: "vi",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                username: "chef",
                email: faker.internet.email(),
                phone: faker.phone.phoneNumber(),
                firstname: "Chef",
                lastname: 'Chef',
                role: 'chef',
                gender: faker.random.boolean(),
                birthday: faker.date.past(),
                hashedPassword: await bcrypt.hash("chef", 10),
                isActive: true,
                language: "vi",
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        ]
        await queryInterface.bulkInsert('Clients', clients);
        await queryInterface.bulkInsert('Employees', admins);
    },

    down: async (queryInterface, Sequelize) => {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete('Clients', null, {});
        await queryInterface.bulkDelete('Employees', null, {});
    },
};
