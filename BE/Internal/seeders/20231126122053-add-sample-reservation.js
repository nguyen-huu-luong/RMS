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
                status: "Occupied",
                numRes: 0,
                floorId: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "T4",
                status: "Occupied",
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
                status: "Occupied",
                numRes: 0,
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
            }
        ]

        const reservations = [
            {
                customerCount: 3,
                customerName: "Luong Nguyen",
                customerPhone: "0123456789",
                status: "Waiting",
                dateTo:  new Date("2024-04-20"),
                timeTo: "15:00",
                timeEnd: "17:00",
                description: "",
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
                description: "",
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
                description: "",
                createdAt: new Date(2024,3,5),
                updatedAt: new Date(2024,3,5),

            },
            {
                customerCount: 2,
                customerName: "Tony Le",
                customerPhone: "0423456798",
                status: "Waiting",
                dateTo:  new Date("2024-03-19"),
                timeTo: "07:00",
                timeEnd: "10:00",
                description: "",
                createdAt: new Date(2024,3,12),
                updatedAt: new Date(2024,3,12),

            },
            {
                customerCount: 2,
                customerName: "Dung Tran",
                customerPhone: "0443456798",
                status: "Waiting",
                dateTo:  new Date("2024-04-20"),
                timeTo: "08:00",
                timeEnd: "11:00",
                description: "",
                createdAt: new Date(2024,3,15),
                updatedAt: new Date(2024,3,25),

            },
        ]

        const table_reservations = [
            {
                tableId: 1,
                reservationId: 1
            },
            {
                tableId: 2,
                reservationId: 2
            },
            {
                tableId: 3,
                reservationId: 3
            },
            {
                tableId: 5,
                reservationId: 4
            },
            {
                tableId: 9,
                reservationId: 4
            },
            {
                tableId: 5,
                reservationId: 5
            },
            {
                tableId: 9,
                reservationId: 5
            },
        ]

        await queryInterface.bulkInsert("Floors", floors);
        await queryInterface.bulkInsert("Tables", tables);
        await queryInterface.bulkInsert("Reservations", reservations);
        await queryInterface.bulkInsert("TableReservations", table_reservations);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("Floors", null, {});
    },
};