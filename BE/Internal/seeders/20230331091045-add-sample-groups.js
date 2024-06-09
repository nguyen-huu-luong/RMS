"use strict";

const { time } = require("console");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const groups = [
            {
                name: "Group 0",
                description: "The average age is over 30. Their cumulative spending on restaurants is high. They tend to choose high-priced dishes. They often return to use restaurant services after a long period of time.",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: "Group 1",
                description: "The average age is over 30. Their cumulative spending on restaurants is average. They tend to choose dishes with average prices. They often return to use restaurant services after an average period of time.",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: "Group 2",
                description: "The average age is over 40. Their cumulative spending on restaurants is low. They tend to choose dishes with average prices. They often return to use restaurant services after a long period of time.",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: "Group 3",
                description: "The average age is under 30. Their cumulative spending on restaurants is high. They tend to choose dishes with high prices. They often return to use restaurant services after a short period of time.",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: "Group 4",
                description: "The average age is under 30. Their cumulative spending on restaurants is average. They tend to choose dishes with average prices. They often return to use restaurant services after a long period of time.",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: "Group 5",
                description: "The average age is over 30. Their cumulative spending on restaurants is low. They tend to choose dishes with average prices. They often return to use restaurant services after a long period of time.",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: "Group 6",
                description: "The average age is over 30. Their cumulative spending on restaurants is average. They tend to choose dishes with average prices. They often return to use restaurant services after a long period of time",
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];
        await queryInterface.bulkInsert("Groups", groups);

    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("Groups", null, {});
    },
};