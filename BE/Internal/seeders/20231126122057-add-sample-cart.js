"use strict";

const { time } = require("console");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const carts = [
            {
                tableId: 2,
                total: 0,
                amount: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                tableId: 3,
                total: 0,
                amount: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                tableId: 4,
                total: 0,
                amount: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                tableId: 5,
                total: 0,
                amount: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                tableId: 6,
                total: 0,
                amount: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                tableId: 7,
                total: 0,
                amount: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                tableId: 8,
                total: 0,
                amount: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                tableId: 9,
                total: 0,
                amount: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                tableId: 10,
                total: 0,
                amount: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                tableId: 11,
                total: 0,
                amount: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                tableId: 12,
                total: 0,
                amount: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                tableId: 13,
                total: 0,
                amount: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            },

        ]

        await queryInterface.bulkInsert("Carts", carts);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("Carts", null, {});
    },
};