"use strict";

const { time } = require("console");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const groups = [
            {
                name: "Group 0",
                description: "Descriptions for group 0",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: "Group 1",
                description: "Descriptions for group 1",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: "Group 2",
                description: "Descriptions for group 2",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: "Group 3",
                description: "Descriptions for group 3",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: "Group 4",
                description: "Descriptions for group 4",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: "Group 5",
                description: "Descriptions for group 5",
                createdAt: new Date(),
                updatedAt: new Date()
            },
        ];
        await queryInterface.bulkInsert("Groups", groups);

    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("Groups", null, {});
    },
};