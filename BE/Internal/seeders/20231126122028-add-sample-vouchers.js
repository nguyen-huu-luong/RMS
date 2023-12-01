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
        amount: faker.random.number({ min: 1, max: 100 }),
        maximum_reduce: faker.random.number({ min: 10, max: 50 }),
        minimum_paid: faker.random.number({ min: 100, max: 1000 }),
        quantity: faker.random.number({ min: 1, max: 10 }),
        begin_date: new Date(),
        end_date: faker.date.future(),
        createdAt: new Date(),
        updatedAt: new Date(),
        categoryId: faker.random.number({ min: 1, max: 7 }),
      };
    });
    await queryInterface.bulkInsert("Vouchers", vouchers);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Vouchers", null, {});
  },
};