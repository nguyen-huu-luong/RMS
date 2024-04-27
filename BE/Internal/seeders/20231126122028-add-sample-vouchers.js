"use strict";
const faker = require("faker");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const vouchers = Array.from({ length: 10 }, () => {
      return {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        promo_code: faker.random.alphaNumeric(10),
        type: faker.random.arrayElement(["percentage", "fixed"]), // Chọn loại voucher ngẫu nhiên
        amount: faker.datatype.number({ min: 10, max: 30,  precision: 5 }),
        maximum_reduce: faker.datatype.number({ min: 20000, max: 50000,  precision: 5000  }),
        minimum_paid: faker.datatype.number({ min: 70000, max: 100000,  precision: 5000  }),
        quantity: faker.datatype.number({ min: 1, max: 10 }),
        begin_date: new Date(),
        end_date: faker.date.future(),
        can_redeem: true,
        redeemedNumber:  0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });
    const clientVouchers = [];
    for (let i = 1; i <= 10; i++) {
      clientVouchers.push(
        {
          voucherId: 1,
          clientId: i,
          status: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          voucherId: 2, 
          clientId: i,
          status: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      );
    }
    await queryInterface.bulkInsert("Vouchers", vouchers);
    await queryInterface.bulkInsert("ClientVouchers", clientVouchers);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Vouchers", null, {});
  },
};