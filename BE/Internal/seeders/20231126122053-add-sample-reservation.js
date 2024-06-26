"use strict";

const { time } = require("console");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const floors = [
            {
                name: "1st",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "2nd",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]

        const tables = [
            {
                name: "N/A",
                status: "Free",
                numRes: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "T1",
                status: "Free",
                numRes: 1,
                floorId: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "T2",
                status: "Free",
                numRes: 0,
                floorId: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "T3",
                status: "Free",
                numRes: 0,
                floorId: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "T4",
                status: "Free",
                numRes: 0,
                floorId: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "T5",
                status: "Free",
                numRes: 2,
                floorId: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "T6",
                status: "Free",
                numRes: 0,
                floorId: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "T7",
                status: "Free",
                numRes: 0,
                floorId: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "T8",
                status: "Free",
                numRes: 0,
                floorId: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "T9",
                status: "Free",
                numRes: 2,
                floorId: 2,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "T10",
                status: "Free",
                numRes: 1,
                floorId: 2,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "T11",
                status: "Free",
                numRes: 0,
                floorId: 2,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "T12",
                status: "Free",
                numRes: 0,
                floorId: 2,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "T13",
                status: "Free",
                numRes: 0,
                floorId: 2,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "T14",
                status: "Free",
                numRes: 0,
                floorId: 2,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "T15",
                status: "Free",
                numRes: 0,
                floorId: 2,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "T16",
                status: "Free",
                numRes: 0,
                floorId: 2,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        ]

        const reservations = [
            {
                customerCount: 3,
                customerName: "Luong Nguyen",
                customerPhone: "0123456789",
                status: "Waiting",
                dateTo:  new Date("2024-05-29"),
                timeTo: "15:00",
                timeEnd: "17:00",
                description: "Food is requested to not be too spicy due to the presence of children",
                createdAt: new Date(2024,3,19),
                updatedAt: new Date(2024,3,19),
            },
            {
                customerCount: 4,
                customerName: "Hung Nguyen",
                customerPhone: "0323456788",
                status: "Done",
                dateTo:  new Date("2024-03-15"),
                timeTo: "15:00",
                timeEnd: "17:00",
                description: "The customer requested a table with flowers",
                createdAt: new Date(2024,3,10),
                updatedAt: new Date(2024,3,10),

            },
            {
                customerCount: 2,
                customerName: "Vuong Lieu",
                customerPhone: "0223456798",
                status: "Canceled",
                dateTo:  new Date("2024-03-14"),
                timeTo: "07:00",
                timeEnd: "09:00",
                description: "The customer was suddenly busy",
                createdAt: new Date(2024,3,5),
                updatedAt: new Date(2024,3,5),

            },
            {
                customerCount: 2,
                customerName: "Tony Le",
                customerPhone: "0423456798",
                status: "Waiting",
                dateTo:  new Date("2024-06-19"),
                timeTo: "07:00",
                timeEnd: "10:00",
                description: "Food is suggested according to customer's request",
                createdAt: new Date(2024,3,12),
                updatedAt: new Date(2024,3,12),

            },
            {
                customerCount: 2,
                customerName: "Dung Tran",
                customerPhone: "0443456798",
                status: "Waiting",
                dateTo:  new Date("2024-06-20"),
                timeTo: "08:00",
                timeEnd: "11:00",
                description: "Request a dedicated waiter",
                createdAt: new Date(2024,3,15),
                updatedAt: new Date(2024,3,25),

            },
            {
                customerCount: 5,
                customerName: "Vien Tran",
                customerPhone: "0793456798",
                status: "Waiting",
                dateTo:  new Date("2024-05-30"),
                timeTo: "14:00",
                timeEnd: "16:00",
                description: "Request a dedicated waiter",
                createdAt: new Date(2024,4,15),
                updatedAt: new Date(2024,4,25),

            },
            {
                customerCount: 3,
                customerName: "Philip Dang",
                customerPhone: "0797756798",
                status: "Done",
                dateTo:  new Date("2024-02-15"),
                timeTo: "14:00",
                timeEnd: "16:00",
                description: "",
                createdAt: new Date(2024,4,15),
                updatedAt: new Date(2024,4,25),

            },
            {
                customerCount: 3,
                customerName: "Danh Tran",
                customerPhone: "0793488798",
                status: "Canceled",
                dateTo:  new Date("2024-04-12"),
                timeTo: "14:00",
                timeEnd: "16:00",
                description: "The customer arrived late",
                createdAt: new Date(2024,4,15),
                updatedAt: new Date(2024,4,25),

            },
        ]

        const table_reservations = [
            {
                tableId: 2,
                reservationId: 1
            },
            {
                tableId: 3,
                reservationId: 2
            },
            {
                tableId: 4,
                reservationId: 3
            },
            {
                tableId: 6,
                reservationId: 4
            },
            {
                tableId: 10,
                reservationId: 4
            },
            {
                tableId: 6,
                reservationId: 5
            },
            {
                tableId: 10,
                reservationId: 5
            },
            {
                tableId: 11,
                reservationId: 6
            },
            {
                tableId: 13,
                reservationId: 7
            },
            {
                tableId: 14,
                reservationId: 8
            },
        ]

        await queryInterface.bulkInsert("Floors", floors);
        await queryInterface.bulkInsert("Tables", tables);
        await queryInterface.bulkInsert("Reservations", reservations);
        await queryInterface.bulkInsert("TableReservations", table_reservations);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("TableReservations", null, {});
        await queryInterface.bulkDelete("Reservations", null, {});
        await queryInterface.bulkDelete("Tables", null, {});
        await queryInterface.bulkDelete("Floors", null, {});
    },
};