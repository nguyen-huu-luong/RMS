"use strict";

const { time } = require("console");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // const notification = [
        //     {
        //         table: 2,
        //         content: "Test",
        //         createdAt: new Date(),
        //         updatedAt: new Date(),
        //     },
        // ];
        // await queryInterface.bulkInsert("Pos_notifications", notification);

    },

    down: async (queryInterface, Sequelize) => {
        // await queryInterface.bulkDelete("Pos_notifications", null, {});
    },
};
