"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const customerMessages = [];

        for (let i = 1; i <= 10; i++) {
            customerMessages.push({
                channelId: i,
                clientId: i,
                content:
                    "Hi, I'd like to make a reservation for dinner tonight.",
                status: "Seen",
                employeeId: null,
                createdAt: new Date(2024, 0, 1, 8, 0, 0),
                updatedAt: new Date(2024, 0, 1, 8, 0, 0),
            });

            customerMessages.push({
                channelId: i,
                clientId: null,
                content: "Sure! How many people will be joining you?",
                status: "Seen",
                employeeId: 1,
                createdAt: new Date(2024, 0, 1, 8, 15, 0),
                updatedAt: new Date(2024, 0, 1, 8, 15, 0),
            });

            customerMessages.push({
                channelId: i,
                clientId: i,
                content:
                    "There will be 4 of us. Can we reserve a table by the window?",
                status: "Seen",
                employeeId: null,
                createdAt: new Date(2024, 0, 1, 9, 0, 0),
                updatedAt: new Date(2024, 0, 1, 9, 0, 0),
            });

            customerMessages.push({
                channelId: i,
                clientId: null,
                content:
                    "Sure, we can arrange that for you. What time would you like to dine?",
                status: "Seen",
                employeeId: 1,
                createdAt: new Date(2024, 0, 1, 9, 15, 0),
                updatedAt: new Date(2024, 0, 1, 9, 15, 0),
            });

            customerMessages.push({
                channelId: i,
                clientId: i,
                content: "Let's go with 7 PM. Thank you!",
                status: "Seen",
                employeeId: null,
                createdAt: new Date(2024, 0, 1, 9, 30, 0),
                updatedAt: new Date(2024, 0, 1, 9, 30, 0),
            });
        }
        await queryInterface.bulkInsert("Messages", customerMessages);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("Messages", null, {});
    },
};
