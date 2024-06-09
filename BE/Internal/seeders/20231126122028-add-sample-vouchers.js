"use strict";
const faker = require("faker");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const voucherNames = [
            "Friday sale",
            "Flash sale 12.12",
            "Flash sale 11.11",
            "Flash sale 10.10",
            "Flash sale 9.9",
            "Flash sale 8.8",
            "Flash sale 7.7",
            "Flash sale 6.6",
            "Flash sale 5.5",
            "Flash sale 4.4",
            "Flash sale 3.3",
            "Flash sale 2.2",
            "Flash sale 1.1",
            "Weekend special",
            "Holiday discount",
            "New Year offer",
            "Spring savings",
            "Summer deal",
            "Back to school",
            "Autumn sale",
            "Winter promotion",
            "Black Friday",
            "Valentine's Day",
            "Mother's Day",
            "Father's Day",
            "Easter discount",
            "Halloween special",
            "Christmas sale",
        ];

        const voucherDescriptions = [
            "Happy Friday! Enjoy this special discount.",
            "Limited time offer for the flash sale!",
            "Special discounts for the weekend.",
            "Enjoy holiday savings with this voucher.",
            "Ring in the New Year with big savings!",
            "Save big this spring with our exclusive deals.",
            "Beat the heat with our summer savings event.",
            "Get ready for school with our back-to-school deals.",
            "Cozy up with autumn discounts.",
            "Warm up your winter with our promotion.",
            "Don't miss out on our Black Friday deals!",
            "Celebrate love with special Valentine's Day offers.",
            "Treat mom with our Mother's Day discounts.",
            "Celebrate dad with our Father's Day specials.",
            "Egg-citing Easter discounts await!",
            "Spook-tacular savings for Halloween.",
            "Christmas comes early with our holiday sale!",
        ];
        // Convert voucher
        const convertVoucher = [
            {
                name: "Welome customers",
                description: "For new leads",
                promo_code: "HICUSTOMER",
                type: "percentage",
                amount: 15,
                maximum_reduce: 30000,
                minimum_paid: 35000,
                quantity: 100000,
                begin_date: new Date(),
                end_date: new Date(2030, 1, 1),
                can_redeem: true,
                redeemedNumber: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ];

        const loyaltyVoucher = [
            {
                name: "Discount for committed customers",
                description: "for committed customers",
                promo_code: "HICUSTOMER",
                type: "percentage",
                amount: 25,
                maximum_reduce: 50000,
                minimum_paid: 60000,
                quantity: 100000,
                begin_date: new Date(),
                end_date: new Date(2030, 1, 1),
                can_redeem: true,
                redeemedNumber: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ];

        const vouchers = Array.from({ length: 50 }, () => {
            let voucherType = faker.random.arrayElement([
                "percentage",
                "fixed",
            ]);
            let voucherAmount =
                voucherType === "percentage"
                    ? faker.datatype.number({
                        min: 10,
                        max: 25,
                        precision: 5,
                    })
                    : faker.datatype.number({
                        min: 20000,
                        max: 50000,
                        precision: 5000,
                    });
            return {
                name: faker.random.arrayElement(voucherNames),
                description: faker.random.arrayElement(voucherDescriptions),
                promo_code: faker.random.alphaNumeric(10),
                type: voucherType,
                amount: voucherAmount,
                maximum_reduce: faker.datatype.number({
                    min: 30000,
                    max: 70000,
                    precision: 5000,
                }),
                minimum_paid: faker.datatype.number({
                    min: 80000,
                    max: 200000,
                    precision: 10000,
                }),
                quantity: faker.datatype.number({
                    min: 50,
                    max: 100,
                    precision: 5,
                }),
                begin_date: new Date(),
                end_date: new Date(2030, 1, 1),
                can_redeem: true,
                redeemedNumber: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
        });

        const clients = await queryInterface.sequelize.query(
            `
            SELECT * from public."Clients" WHERE type = 'lead';
            `,
            { type: queryInterface.sequelize.QueryTypes.SELECT }
        );

        const clientVouchers = [];
        for (let client of clients) {
            clientVouchers.push({
                voucherId: 1,
                clientId: client.id,
                status: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }

        await queryInterface.bulkInsert("Vouchers", convertVoucher);
        await queryInterface.bulkInsert("Vouchers", loyaltyVoucher);
        await queryInterface.bulkInsert("Vouchers", vouchers);
        await queryInterface.bulkInsert("ClientVouchers", clientVouchers);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("Vouchers", null, {});
    },
};
