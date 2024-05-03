import { NextFunction } from "express";
import { Cart, Channel, Client, Message, Table } from "../Models";
import { TokenUtil } from "../Utils";
import type { Socket } from "socket.io";
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
                        socket.join("Channel_" + existClient?.dataValues.id);
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
                        socket.join(
                            "Channel_" + anonymousChannel?.dataValues.id
                        );
                        this.employee.map((item: Socket) => {
                            item.join(
                                "Channel_" + anonymousChannel?.dataValues.id
                            );
                        });
                        socket
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
                        socket.join("Channel_" + channel?.dataValues.id);
                        socket.join("PrivateChannel_" + id);
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
                        socket.join("Kitchen");
                        socket.join("Employee");
                        socket.join("Order");
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
            socket.to("Employee").emit("initial:channels", this.channels);

            // Chat service
            socket.on(
                "client:message:send",
                (channelId: string, message: string, clientId: string) => {
                    io.to("Channel_" + channelId).emit(
                        "message:send:fromClient",
                        channelId,
                        message,
                        clientId
                    );
                }
            );
            socket.on(
                "staff:message:send",
                (channelId: string, message: string, employeeId: string) => {
                    io.to("Channel_" + channelId).emit(
                        "message:send:fromStaff",
                        channelId,
                        message,
                        employeeId
                    );
                }
            );
            socket.on("client:message:read", (channelId: string) => {
                io.to("Channel_" + channelId).emit(
                    "message:read:fromClient",
                    channelId
                );
            });
            socket.on("staff:message:read", (channelId: string) => {
                io.to("Channel_" + channelId).emit(
                    "message:read:fromStaff",
                    channelId
                );
            });
            socket.on(
                "staff:channel:join",
                (channelId: string, staffId: string, callback: any) => {
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
                        io.emit("channel:status:update", this.channels);
                        callback({
                            status: "1",
                        });
                    }
                }
            );
            socket.on(
                "staff:channel:leave",
                (channelId: string, staffId: string, callback: any) => {
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
                async (message: string) => {
                    const id = socket.handshake.query.customId
                        ? socket.handshake.query.customId
                        : socket.id;
                    const client = await Client.findOne({
                        where: {
                            firstname: id,
                        },
                    });
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
                    console.log(message, channel?.dataValues.id);
                    io.to("Channel_" + channel?.dataValues.id).emit(
                        "message:send:fromClient",
                        channel?.dataValues.id,
                        message,
                        client?.dataValues.id
                    );
                }
            );

            // Kitchen display service
            socket.on("chef:order:finish", (orderId: string) => {
                io.to("Kitchen").emit("order:finish:fromChef", orderId);
            });
            socket.on("staff:order:prepare", (orderId: string) => {
                io.to("Kitchen").emit("order:prepare:fromStaff", orderId);
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
                (clientId: string, orderId: string) => {
                    io.to("PrivateChannel_" + clientId).emit(
                        "notification:prepare:fromStaff",
                        orderId
                    );
                }
            );

            socket.on(
                "staff:notifications:deliver",
                (clientId: string, orderId: string) => {
                    io.to("PrivateChannel_" + clientId).emit(
                        "notification:deliver:fromStaff",
                        orderId
                    );
                }
            );

            socket.on(
                "staff:notifications:done",
                (clientId: string, orderId: string) => {
                    io.to("PrivateChannel_" + clientId).emit(
                        "notification:done:fromStaff",
                        orderId
                    );
                }
            );
            socket.on(
                "staff:notifications:reject",
                (clientId: string, orderId: string) => {
                    io.to("PrivateChannel_" + clientId).emit(
                        "notification:reject:fromStaff",
                        orderId
                    );
                }
            );

            // New order from clients or cancel orders from clients
            socket.on("client:newOrder", (name: any) => {
                io.to("Order").emit("newOrder:fromClient", name);
            });
            socket.on("client:cancelOrder", (orderId: any) => {
                io.to("Order").emit("cancelOrder:fromClient", orderId);
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
