"use strict";
const faker = require("faker");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        let orders = [];
        const yesterday = new Date()
        let currentDate = new Date()
        currentDate.setDate(currentDate.getDate()-1)
        const twoYearsAgo = new Date(
            currentDate.getFullYear() - 1,
            currentDate.getMonth(),
            currentDate.getDate()
        );

        let clientConvertDate = [];
        let clientAmounts = [];
        let clientItems = [];
        let clientLastPurchased = [];

        for (let i = 1; i <= 1000; i++) {
            clientAmounts.push(0);
            clientItems.push(0);
            clientConvertDate.push("");
            clientLastPurchased.push("");
        }

        for (let i = 1; i <= 2000; i++) {
            let clientId = faker.datatype.number({ min: 1, max: 1000 });
            let createdAt = faker.date.between(twoYearsAgo, currentDate);
            orders.push({
                clientId: clientId,
                num_items: faker.datatype.number({ min: 1, max: 12 }),
                amount: 0,
                status: "Done",
                paymentMethod: "CASH",
                createdAt: createdAt,
                updatedAt: createdAt,
            });
            if (
                clientConvertDate[clientId - 1] != "" &&
                clientConvertDate[clientId - 1] > createdAt
            ) {
                clientConvertDate[clientId - 1] = createdAt;
            } else if (clientConvertDate[clientId - 1] == "") {
                clientConvertDate[clientId - 1] = createdAt;
            }
            if (
                clientLastPurchased[clientId - 1] != "" &&
                clientLastPurchased[clientId - 1] < createdAt
            ) {
                clientLastPurchased[clientId - 1] = createdAt;
            } else if (clientLastPurchased[clientId - 1] == "") {
                clientLastPurchased[clientId - 1] = createdAt;
            }
        }

        let orderItems = [];
        for (let orderId = 0; orderId < 2000; orderId++) {
            let preProducts = [];
            for (let j = 0; j < orders[orderId].num_items; j++) {
                let randomProduct;
                let quantity;
                do {
                    randomProduct = Math.floor(Math.random() * 70) + 1;
                } while (preProducts.includes(randomProduct));
                preProducts.push(randomProduct);
                const product = await queryInterface.sequelize.query(
                    `
                    SELECT price from public."Products" WHERE id = ${randomProduct};
                    `,
                    { type: queryInterface.sequelize.QueryTypes.SELECT }
                );
                quantity = faker.datatype.number({ min: 1, max: 5 });
                clientItems[orders[orderId].clientId - 1] += quantity;
                orderItems.push({
                    orderId: orderId + 1,
                    productId: randomProduct,
                    quantity: quantity,
                    amount: quantity * product[0].price,
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

        let temp = 0;
        for (let order of orders) {
            clientAmounts[order.clientId - 1] += order.amount;
        }

        const promises = clientAmounts.map((profit, index) => {
            if (profit !== 0) {
                const convertDate = new Date(clientConvertDate[index]);
                const randomDays = Math.floor(Math.random() * 30) + 1;
                const newCreatedAt = new Date(convertDate.setDate(convertDate.getDate() - randomDays));

                return queryInterface.sequelize.query(
                    `
                    UPDATE public."Clients"
                    SET profit = :profit,
                        type = :type,
                        "convertDate" = :convertDate,
                        "lastPurchase" = :lastPurchase,
                        total_items = :num_items,
                        average = :average,
                        "segmentDate" = :segmentDate,
                        "createdAt" = :createdAt,
                        "updatedAt" = :updatedAt
                    WHERE id = :id
                    `,
                    {
                        replacements: {
                            profit: profit,
                            type: "customer",
                            convertDate: clientConvertDate[index],
                            lastPurchase: clientLastPurchased[index],
                            num_items: clientItems[index],
                            average: profit / clientItems[index],
                            segmentDate: clientConvertDate[index],
                            createdAt: newCreatedAt,
                            updatedAt: newCreatedAt,
                            id: index + 1,
                        },
                    }
                );
            } else {
                return Promise.resolve();
            }
        });
        await queryInterface.bulkInsert("Orders", orders, {});
        await queryInterface.bulkInsert("OrderItems", orderItems, {});
        await Promise.all(promises);
        await queryInterface.sequelize.query(
            `
            UPDATE public."Clients"
                SET type = 'lead',
                    "convertDate" = NULL
            WHERE profit = 0
            `
        );
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("Orders", null, {});
        await queryInterface.bulkDelete("OrderItems", null, {});
    },
};
