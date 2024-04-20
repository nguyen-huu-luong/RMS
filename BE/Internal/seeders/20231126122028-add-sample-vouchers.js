"use strict";
const faker = require("faker");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const vouchers = Array.from({ length: 50 }, () => {
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
        createdAt: new Date(),
        updatedAt: new Date(),
        categoryId: faker.datatype.number({ min: 1, max: 7 }),
      };
    });
    await queryInterface.bulkInsert("Vouchers", vouchers);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Vouchers", null, {});
  },
};