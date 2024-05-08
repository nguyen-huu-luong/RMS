"use strict";

const { time } = require("console");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        let tables = await queryInterface.sequelize.query(
            `SELECT id from public."Tables" WHERE id <> :id`,
            {
                replacements: {
                    id: 1,
                },
            }
        );
        tables = tables[0];
        let carts = [];
        for (let i = 0; i < tables.length; i++) {
            carts.push({
                tableId: tables[i].id,
                total: 0,
                amount: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }
        let channels = [];
        for (let i = 1; i <= 10; i++) {
            let cart = {
                clientId: i,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            channels.push(cart);
        }

        await queryInterface.bulkInsert("Carts", carts);
        await queryInterface.bulkInsert("Channels", channels);

        let cart_order = await queryInterface.sequelize.query(
            `SELECT id, "tableId" from public."Carts" WHERE "tableId" IS NOT NULL LIMIT 4`
        );
        cart_order = cart_order[0];

        let products = await queryInterface.sequelize.query(
            `
              SELECT id, price
              FROM public."Products"
              `
        );

        products = products[0];

        for (let i = 0; i < cart_order.length; i++) {
            let product_1 =
                products[Math.floor(Math.random() * products.length)];
            let product_2 =
                products[Math.floor(Math.random() * products.length)];

            while (product_1.id === product_2.id) {
                product_2 =
                    products[Math.floor(Math.random() * products.length)];
            }

            let product_3 =
                products[Math.floor(Math.random() * products.length)];

            while (
                product_3.id === product_1.id ||
                product_3.id === product_2.id
            ) {
                product_3 =
                    products[Math.floor(Math.random() * products.length)];
            }
            let cart_product = [
                {
                    cartId: cart_order[i].id,
                    productId: product_1.id,
                    amount: product_1.price,
                    quantity: 1,
                    status: "Preparing",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    cartId: cart_order[i].id,
                    productId: product_2.id,
                    amount: product_2.price,
                    quantity: 1,
                    status: "Preparing",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    cartId: cart_order[i].id,
                    productId: product_3.id,
                    amount: product_3.price,
                    quantity: 1,
                    status: "Preparing",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];
            await queryInterface.bulkInsert("CartItems", cart_product);
            let amount = product_1.price + product_2.price + product_3.price;
            await queryInterface.sequelize.query(
                `
              UPDATE public."Carts"
              SET total = 3, amount=:amount
              WHERE id = :id
          `,
                {
                    replacements: {
                        amount: amount,
                        id: cart_order[i].id,
                    },
                }
            );

            await queryInterface.sequelize.query(
                `
              UPDATE public."Tables"
              SET status = 'Occupied'
              WHERE id = :id
          `,
                {
                    replacements: {
                        id: cart_order[i].tableId,
                    },
                }
            );
        }
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("Carts", null, {});
    },
};
