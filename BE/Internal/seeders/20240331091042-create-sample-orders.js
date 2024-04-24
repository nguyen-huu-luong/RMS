"use strict";
const faker = require("faker");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        let orders = [];
        for (let i = 1; i <= 10; i++) {
            for (let j = 0; j < 3; j++) {
                orders.push({
                    clientId: i,
                    num_items: faker.random.number({ min: 1, max: 5 }),
                    amount: 0,
                    status: "Done",
                    paymentMethod: "CASH",
                    createdAt: faker.date.past(),
                    updatedAt: new Date(),
                });
            }
        }
        let orderItems = [];
        for (let orderId = 0; orderId < 30; orderId++) {
            let preProducts = [];
            for (let j = 0; j < orders[orderId].num_items; j++) {
                let randomProduct;
                let quantity;
                do {
                    randomProduct = Math.floor(Math.random() * 70) + 1;
                } while (preProducts.includes(randomProduct));
                preProducts.push(randomProduct);

                quantity = faker.random.number({ min: 1, max: 5 });

                orderItems.push({
                    orderId: orderId + 1,
                    productId: randomProduct,
                    quantity: quantity,
                    amount:
                        quantity *
                        faker.random.number({
                            min: 40000,
                            max: 70000,
                            precision: 5000,
                        }),
                    status: "Done",
                    createdAt: faker.date.past(),
                    updatedAt: new Date(),
                });
            }
        }
        let base = 0;
        for (let order of orderItems) {
            orders[order.orderId - 1].amount += order.amount;
            orders[order.orderId - 1].num_items += order.quantity;
        }

        let clientAmounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        let temp = 0;
        for (let orderId = 0; orderId < 30; orderId++) {
            clientAmounts[temp] += orders[orderId].amount;
            if ((orderId + 1) % 3 == 0) {
                temp++;
            }
        }

        const promises = clientAmounts.map((profit, index) => {
            return queryInterface.sequelize.query(
                `
              UPDATE public."Clients"
              SET profit = :profit
              WHERE id = :id
          `,
                {
                    replacements: {
                        profit: profit,
                        id: index + 1,
                    },
                }
            );
        });
        await queryInterface.bulkInsert("Orders", orders, {});
        await queryInterface.bulkInsert("OrderItems", orderItems, {});
        await Promise.all(promises);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("Orders", null, {});
        await queryInterface.bulkDelete("OrderItems", null, {});
    },
};
