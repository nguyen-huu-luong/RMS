"use strict";

const { time } = require("console");
const faker = require("faker");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        let actions = ["add_to_cart", "view_item"]
        let clients = await queryInterface.sequelize.query(
            `SELECT id FROM public."Clients"`);
        let products = await queryInterface.sequelize.query(
            `
              SELECT id
              FROM public."Products"
              `
        );
        let histories = []
        products = products[0]

        clients[0].map((client) => {
            for (let i = 0; i < 10; i++) {
                let product = products[Math.floor(Math.random() * (products.length))]
                let date_ = faker.date.between(2023, 2024)
                histories.push({
                    action: actions[Math.floor(Math.random() * (actions.length))],
                    clientId: client.id,
                    productId: product.id,
                    createdAt: date_,
                    updatedAt: date_,
                })
            }
        })

        await queryInterface.bulkInsert("ClientHistories", histories);

    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("ClientHistories", null, {});
    },
};