import { NextFunction } from "express";
import { Cart, Channel, Client, Message, Table } from "../Models";
import { TokenUtil } from "../Utils";
import type { Socket } from "socket.io";
import { callback } from "chart.js/dist/helpers/helpers.core";
class SocketConnection {
    private channels: { [channelId: string]: string } = {};
    private employee: Socket[] = [];
    private client: string[] = [];
    public async init(io: any) {
        io.use(async (socket: any, next: NextFunction) => {
            try {
                const token = socket.handshake.auth.token;
                if (!token) {
                    // Create new client
                    const customId = socket.handshake.query.customId;
                    const existClient = await Client.findOne({
                        where: {
                            firstname: customId,
                        },
                    });
                    if (existClient && customId) {
                        const channel = await Channel.findOne({
                            where: { clientId: existClient?.dataValues.id },
                        });
                        await socket.join("Channel_" + channel?.dataValues.id);
                    } else {
                        const client = {
                            firstname: socket.id,
                            lastname: "User",
                            isRegistered: true,
                            isActive: true,
                            language: "vi",
                            type: "Anonymous Client",
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        };
                        const anonymousClient = await Client.create(client);
                        const anonymousChannel = await Channel.create({
                            clientId: anonymousClient.getDataValue("id"),
                        });
                        await Message.create({
                            channelId: anonymousChannel.getDataValue("id"),
                            clientId: anonymousClient.getDataValue("id"),
                            content: "New user want to chat!",
                            status: "Not seen",
                        });
                        await socket.join(
                            "Channel_" + anonymousChannel?.dataValues.id
                        );
                        this.employee.map(async (item: Socket) => {
                            await item.join(
                                "Channel_" + anonymousChannel?.dataValues.id
                            );
                        });
                        await socket
                            .to("Channel_" + anonymousChannel?.dataValues.id)
                            .emit(
                                "anonymous:channel:create",
                                anonymousChannel?.dataValues.id,
                                `User ${socket.id}`,
                                anonymousClient.getDataValue("id")
                            );
                    }
                } else {
                    const decoded = await TokenUtil.verify(token);
                    const { id, role, ...data } = decoded;
                    if (role == "user") {
                        const channel = await Channel.findOne({
                            where: { clientId: id },
                        });
                        this.client.push(channel?.dataValues.id);
                        await socket.join("Channel_" + channel?.dataValues.id);
                        await socket.join("PrivateChannel_" + id);
                        this.employee.map((item: Socket) => {
                            let channelId = "Channel_" + channel?.dataValues.id;
                            if (!(channelId in item.rooms)) {
                                item.join("Channel_" + channel?.dataValues.id);
                            }
                        });
                    } else if (
                        role == "employee" ||
                        role == "manager" ||
                        role == "chef"
                    ) {
                        const channels = await Channel.findAll();
                        channels.forEach((channel: any) => {
                            socket.join("Channel_" + channel.dataValues.id);
                        });
                        await socket.join("Kitchen");
                        await socket.join("Employee");
                        await socket.join("Order");
                        this.employee.push(socket);
                    }
                }
                next();
            } catch (error) {
                console.log(error);
                next(error);
            }
        });
        io.on("connection", (socket: any) => {
            io.to("Employee").emit("initial:channels", this.channels);

            // Chat service
            socket.on(
                "client:message:send",
                async (
                    channelId: string,
                    message: string,
                    clientId: string,
                    callback: any
                ) => {
                    try {
                        await Message.create({
                            channelId: channelId,
                            clientId: clientId,
                            content: message,
                            status: "Not seen",
                        });
                        await io
                            .to("Channel_" + channelId)
                            .emit(
                                "message:send:fromClient",
                                channelId,
                                message,
                                clientId
                            );
                        callback({
                            status: true,
                        });
                    } catch (error: any) {
                        callback({
                            status: false,
                            error: error.message,
                        });
                    }
                }
            );

            socket.on(
                "staff:message:send",
                async (
                    channelId: string,
                    message: string,
                    employeeId: string,
                    callback: any
                ) => {
                    try {
                        await Message.create({
                            channelId: channelId,
                            employeeId: employeeId,
                            content: message,
                            status: "Not seen",
                        });
                        await io
                            .to("Channel_" + channelId)
                            .emit(
                                "message:send:fromStaff",
                                channelId,
                                message,
                                employeeId
                            );
                        callback({
                            status: true,
                        });
                    } catch (error: any) {
                        callback({
                            status: true,
                            error: error.message,
                        });
                    }
                }
            );

            socket.on(
                "newClient:message:info",
                async (clientId: string, callback: any) => {
                    try {
                        const user = await Client.findByPk(clientId);
                        callback({
                            status: true,
                            client: {
                                userAvatar: user?.getDataValue("avatar"),
                                userName:
                                    user?.getDataValue("lastname") +
                                    " " +
                                    user?.getDataValue("firstname"),
                            },
                        });
                    } catch (error: any) {
                        callback({
                            status: true,
                            error: error.message,
                        });
                    }
                }
            );

            socket.on("client:message:read", async (channelId: string) => {
                await io
                    .to("Channel_" + channelId)
                    .emit("message:read:fromClient", channelId);
            });
            socket.on("staff:message:read", async (channelId: string) => {
                await io
                    .to("Channel_" + channelId)
                    .emit("message:read:fromStaff", channelId);
            });
            socket.on(
                "staff:channel:join",
                async (channelId: string, staffId: string, callback: any) => {
                    if (
                        this.channels[channelId] &&
                        this.channels[channelId] != socket.id
                    ) {
                        callback({
                            status: "0",
                        });
                    } else {
                        // Check if user has joined other rooms
                        const previousChannelId = Object.keys(
                            this.channels
                        ).find((key) => this.channels[key] === socket.id);
                        if (previousChannelId) {
                            delete this.channels[previousChannelId];
                        }
                        this.channels[channelId] = socket.id;
                        await io.emit("channel:status:update", this.channels);
                        callback({
                            status: "1",
                        });
                    }
                }
            );
            socket.on(
                "staff:channel:leave",
                async (channelId: string, staffId: string, callback: any) => {
                    if (this.channels[channelId] === socket.id) {
                        delete this.channels[channelId];
                        if (callback) {
                            callback({ status: "Left chat successfully!" });
                        }
                    } else {
                        if (callback) {
                            callback({
                                status: "You are not serving this channel!",
                            });
                        }
                    }
                }
            );

            // Chat service - anonymous client
            socket.on(
                "anonymousclient:message:send",
                async (message: string, socketId: string, callback: any) => {
                    try {
                        const id = socketId;
                        const client = await Client.findOne({
                            where: {
                                firstname: id,
                            },
                        });
                        if (!client) {
                        }
                        const channel = await Channel.findOne({
                            where: {
                                clientId: client?.dataValues.id,
                            },
                        });
                        await Message.create({
                            channelId: channel?.dataValues.id,
                            clientId: client?.dataValues.id,
                            content: message,
                            status: "Not seen",
                        });
                        await io
                            .to("Channel_" + channel?.dataValues.id)
                            .emit(
                                "message:send:fromClient",
                                channel?.dataValues.id,
                                message,
                                client?.dataValues.id
                            );
                        callback({
                            status: true,
                        });
                    } catch (error: any) {
                        console.log(error);
                        callback({
                            status: false,
                            error: error.message,
                        });
                    }
                }
            );

            // Kitchen display service
            socket.on("chef:order:finish", async (orderId: string) => {
                await io.to("Kitchen").emit("order:finish:fromChef", orderId);
            });
            socket.on("staff:order:prepare", async (orderId: string) => {
                await io.to("Kitchen").emit("order:prepare:fromStaff", orderId);
            });

            // Table service
            socket.on("staff:table:prepare", async (tableId: string) => {
                const table = await Table.findByPk(tableId);
                io.to("Kitchen").emit(
                    "table:prepare:fromStaff",
                    table?.getDataValue("name")
                );
            });
            socket.on(
                "chef:tableItem:finish",
                async (tableId: string, name: string) => {
                    const cart = await Cart.findByPk(tableId);
                    const table = await Table.findByPk(
                        cart?.getDataValue("tableId")
                    );
                    io.to("Kitchen").emit(
                        "tableItem:finish:fromChef",
                        table?.getDataValue("name"),
                        name
                    );
                }
            );

            //Notification service
            socket.on(
                "staff:notifications:prepare",
                async (clientId: string, orderId: string) => {
                    await io
                        .to("PrivateChannel_" + clientId)
                        .emit("notification:prepare:fromStaff", orderId);
                }
            );

            socket.on(
                "staff:notifications:deliver",
                async (clientId: string, orderId: string) => {
                    await io
                        .to("PrivateChannel_" + clientId)
                        .emit("notification:deliver:fromStaff", orderId);
                }
            );

            socket.on(
                "staff:notifications:done",
                async (clientId: string, orderId: string) => {
                    await io
                        .to("PrivateChannel_" + clientId)
                        .emit("notification:done:fromStaff", orderId);
                }
            );
            socket.on(
                "staff:notifications:reject",
                async (clientId: string, orderId: string) => {
                    await io
                        .to("PrivateChannel_" + clientId)
                        .emit("notification:reject:fromStaff", orderId);
                }
            );

            // New order from clients or cancel orders from clients
            socket.on("client:newOrder", async (name: any) => {
                await io.to("Order").emit("newOrder:fromClient", name);
            });
            socket.on("client:cancelOrder", async (orderId: any) => {
                await io.to("Order").emit("cancelOrder:fromClient", orderId);
            });

            // Disconnect
            socket.on("disconnect", () => {
                Object.keys(this.channels).forEach((channelId) => {
                    if (this.channels[channelId] === socket.id) {
                        delete this.channels[channelId];
                        io.emit("channel:status:update", this.channels);
                    }
                });
                const index = this.employee.indexOf(socket);
                if (index !== -1) {
                    this.employee.splice(index, 1);
                }
                setTimeout(async () => {
                    try {
                        const client = await Client.findOne({
                            where: {
                                firstname: socket.id,
                            },
                        });
                        if (client) {
                            const message = await Message.findOne({
                                where: {
                                    clientId: client.getDataValue("id"),
                                },
                            });
                            if (!message) await client.destroy();
                        }
                    } catch (error) {
                        console.error("Error deleting client:", error);
                    }
                }, 1 * 60 * 1000);
            });
        });
    }
}

export default SocketConnection;
