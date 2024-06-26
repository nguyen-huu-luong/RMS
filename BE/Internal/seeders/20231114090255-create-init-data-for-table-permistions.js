'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        let d = new Date();
        return queryInterface.bulkInsert('Permissions', [
            { role: 'user', resource: 'products', action: 'read:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'user', resource: 'customers', action: 'read:own', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'user', resource: 'customers', action: 'update:own', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'user', resource: 'carts', action: 'read:own', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'user', resource: 'carts', action: 'update:own', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'user', resource: 'carts', action: 'create:own', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'user', resource: 'carts', action: 'delete:own', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'user', resource: 'profile', action: 'read:own', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'user', resource: 'profile', action: 'update:own', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'user', resource: 'orders', action: 'read:own', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'user', resource: 'orders', action: 'create:own', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'user', resource: 'orders', action: 'update:own', attributes: 'status', createdAt: d, updatedAt: d },
            { role: 'user', resource: 'chatMessage', action: 'read:own', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'user', resource: 'vouchers', action: 'read:own', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'user', resource: 'vouchers', action: 'update:own', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'user', resource: 'channels', action: 'read:own', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'user', resource: 'messages', action: 'read:own', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'user', resource: 'channels', action: 'create:own', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'user', resource: 'messages', action: 'create:own', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'user', resource: 'channels', action: 'update:own', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'user', resource: 'messages', action: 'update:own', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'user', resource: 'notifications', action: 'read:own', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'user', resource: 'notifications', action: 'update:own', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'user', resource: 'clienthistories', action: 'read:own', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'user', resource: 'clienthistories', action: 'create:own', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'user', resource: 'subscribers', action: 'read:own', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'user', resource: 'subscribers', action: 'create:own', attributes: '*', createdAt: d, updatedAt: d },

            { role: 'employee', resource: 'customers', action: 'read:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'employee', resource: 'customers', action: 'update:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'employee', resource: 'customers', action: 'create:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'employee', resource: 'leads', action: 'read:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'employee', resource: 'leads', action: 'update:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'employee', resource: 'leads', action: 'create:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'employee', resource: 'products', action: 'read:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'employee', resource: 'products', action: 'update:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'employee', resource: 'products', action: 'create:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'employee', resource: 'orders', action: 'read:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'employee', resource: 'orders', action: 'update:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'employee', resource: 'orders', action: 'create:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'employee', resource: 'campaigns', action: 'read:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'employee', resource: 'campaigns', action: 'update:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'employee', resource: 'campaigns', action: 'create:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'employee', resource: 'target-lists', action: 'read:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'employee', resource: 'target-lists', action: 'update:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'employee', resource: 'target-lists', action: 'create:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'employee', resource: 'message-templates', action: 'read:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'employee', resource: 'message-templates', action: 'update:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'employee', resource: 'message-templates', action: 'create:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'employee', resource: 'tables', action: 'read:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'employee', resource: 'tables', action: 'update:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'employee', resource: 'tables', action: 'create:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'employee', resource: 'floors', action: 'read:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'employee', resource: 'floors', action: 'update:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'employee', resource: 'floors', action: 'create:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'employee', resource: 'floors', action: 'delete:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'employee', resource: 'reservations', action: 'read:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'employee', resource: 'reservations', action: 'update:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'employee', resource: 'reservations', action: 'create:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'employee', resource: 'reservations', action: 'delete:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'employee', resource: 'chat-messages', action: 'read:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'employee', resource: 'chat-messages', action: 'create:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'employee', resource: 'conversations', action: 'read:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'employee', resource: 'vouchers', action: 'read:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'employee', resource: 'vouchers', action: 'create:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'employee', resource: 'vouchers', action: 'update:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'employee', resource: 'channels', action: 'read:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'employee', resource: 'messages', action: 'read:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'employee', resource: 'channels', action: 'create:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'employee', resource: 'messages', action: 'create:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'employee', resource: 'messages', action: 'update:own', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'employee', resource: 'channels', action: 'update:own', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'employee', resource: 'channels', action: 'update:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'employee', resource: 'notifications', action: 'create:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'employee', resource: 'chlienthistories', action: 'read:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'employee', resource: 'clientistories', action: 'create:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'employee', resource: 'subscribers', action: 'read:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'employee', resource: 'subscribers', action: 'create:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'employee', resource: 'subscribers', action: 'update:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'employee', resource: 'subscribers', action: 'delete:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'employee', resource: 'categories', action: 'create:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'employee', resource: 'categories', action: 'update:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'employee', resource: 'categories', action: 'delete:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'employee', resource: 'pos_notifications', action: 'create:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'employee', resource: 'pos_notifications', action: 'read:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'employee', resource: 'groups', action: 'delete:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'employee', resource: 'groups', action: 'create:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'employee', resource: 'groups', action: 'read:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'employee', resource: 'reports', action: 'read:any', attributes: '*', createdAt: d, updatedAt: d },

            // Thêm dữ liệu cho các role khác tương tự ở đây

            { role: 'manager', resource: 'customers', action: 'read:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'customers', action: 'update:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'customers', action: 'create:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'customers', action: 'delete:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'leads', action: 'read:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'leads', action: 'update:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'leads', action: 'create:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'leads', action: 'delete:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'employees', action: 'read:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'employees', action: 'update:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'employees', action: 'create:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'employees', action: 'delete:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'permissions', action: 'read:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'permissions', action: 'create:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'permissions', action: 'update:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'permissions', action: 'delete:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'products', action: 'read:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'products', action: 'create:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'products', action: 'update:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'products', action: 'delete:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'orders', action: 'read:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'orders', action: 'update:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'orders', action: 'create:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'orders', action: 'delete:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'campaigns', action: 'read:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'campaigns', action: 'update:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'campaigns', action: 'create:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'campaigns', action: 'delete:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'target-lists', action: 'read:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'target-lists', action: 'update:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'target-lists', action: 'create:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'target-lists', action: 'delete:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'message-templates', action: 'read:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'message-templates', action: 'update:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'message-templates', action: 'create:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'message-templates', action: 'delete:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'tables', action: 'read:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'tables', action: 'update:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'tables', action: 'create:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'tables', action: 'delete:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'floors', action: 'read:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'floors', action: 'update:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'floors', action: 'create:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'floors', action: 'delete:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'reservations', action: 'read:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'reservations', action: 'update:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'reservations', action: 'create:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'reservations', action: 'delete:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'chat-messages', action: 'read:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'chat-messages', action: 'create:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'conversations', action: 'read:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'vouchers', action: 'read:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'vouchers', action: 'create:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'vouchers', action: 'update:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'vouchers', action: 'delele:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'channels', action: 'read:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'messages', action: 'read:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'channels', action: 'create:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'messages', action: 'create:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'messages', action: 'update:own', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'channels', action: 'update:own', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'notifications', action: 'create:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'reports', action: 'read:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'clienthistories', action: 'read:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'clienthistories', action: 'create:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'subscribers', action: 'read:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'subscribers', action: 'create:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'subscribers', action: 'update:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'subscribers', action: 'delete:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'categories', action: 'create:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'categories', action: 'update:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'categories', action: 'delete:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'pos_notifications', action: 'create:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'pos_notifications', action: 'read:any', attributes: '*', createdAt: d, updatedAt: d },

            { role: 'manager', resource: 'targetlists', action: 'read:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'targetlists', action: 'create:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'targetlists', action: 'update:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'targetlists', action: 'delete:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'groups', action: 'delete:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'groups', action: 'create:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'manager', resource: 'groups', action: 'read:any', attributes: '*', createdAt: d, updatedAt: d },

            // Thêm dữ liệu cho các role khác tương tự ở đây

            { role: 'chef', resource: 'orders', action: 'update:any', attributes: 'status', createdAt: d, updatedAt: d },
            { role: 'chef', resource: 'orders', action: 'read:any', attributes: 'order.items', createdAt: d, updatedAt: d },
            { role: 'chef', resource: 'notifications', action: 'create:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'chef', resource: 'pos_notifications', action: 'create:any', attributes: '*', createdAt: d, updatedAt: d },
            { role: 'chef', resource: 'pos_notifications', action: 'read:any', attributes: '*', createdAt: d, updatedAt: d },
            // Thêm dữ liệu cho các role khác tương tự ở đây
        ], {});
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Permissions', null, {});
    }
};
