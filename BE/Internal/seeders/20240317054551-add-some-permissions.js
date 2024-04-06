'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        let d = new Date();
        return await queryInterface.bulkInsert('Permissions', [

            { role: 'employee', resource: 'send-email', action: 'any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'send-email', action: "any", attributes: '*', createdAt: d, updatedAt: d }
            
        ], {});

    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Permissions', null, {});
    }
};
