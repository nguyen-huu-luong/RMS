"use strict";

const { time } = require("console");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        let clients = await queryInterface.sequelize.query(
            `SELECT id FROM public."Clients"`);
        let products = await queryInterface.sequelize.query(
            `
              SELECT id, price
              FROM public."Products"
              `
        );

        products = products[0]
        let carts = []

        clients[0].map((client) => {
            carts.push({
                clientId: client.id,
                total: 0,
                amount: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            })
        })

        await queryInterface.bulkInsert("Carts", carts);

        carts = await queryInterface.sequelize.query(
            `SELECT id FROM public."Carts" WHERE "clientId" IS NOT NULL LIMIT 100`);
        carts = carts[0]

        for (let i = 0; i < carts.length; i++) {
            let product_1 = products[Math.floor(Math.random() * (products.length))]
            let product_2 = products[Math.floor(Math.random() * (products.length))]

            while (product_1.id === product_2.id) {
                product_2 = products[Math.floor(Math.random() * (products.length))]
            }

            let product_3 = products[Math.floor(Math.random() * (products.length))]

            while (product_3.id === product_1.id || product_3.id === product_2.id) {
                product_3 = products[Math.floor(Math.random() * (products.length))]
            }
            let cart_product = [{
                cartId: carts[i].id,
                productId: product_1.id,
                amount: product_1.price,
                quantity: 1,
                status: "Preparing",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                cartId: carts[i].id,
                productId: product_2.id,
                amount: product_2.price,
                quantity: 1,
                status: "Preparing",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                cartId: carts[i].id,
                productId: product_3.id,
                amount: product_3.price,
                quantity: 1,
                status: "Preparing",
                createdAt: new Date(),
                updatedAt: new Date()
            }
            ]
            await queryInterface.bulkInsert("CartItems", cart_product);
            let amount = product_1.price + product_2.price + product_3.price
            await queryInterface.sequelize.query(
                `
              UPDATE public."Carts"
              SET total = 3, amount=:amount
              WHERE id = :id
          `,
                {
                    replacements: {
                        amount: amount,
                        id: carts[i].id,
                    },
                }
            );

        }
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("Carts", null, {});
        await queryInterface.bulkDelete("CartItems", null, {});
    },
};