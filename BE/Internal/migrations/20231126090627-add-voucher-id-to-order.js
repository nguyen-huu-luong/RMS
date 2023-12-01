"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn("Orders", "voucherId", {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: "Vouchers",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn("Orders", "voucherId");
    },
};
