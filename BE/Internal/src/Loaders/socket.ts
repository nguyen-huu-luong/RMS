import { NextFunction } from "express";
import { Channel, Client, Message } from "../Models";
import { TokenUtil } from "../Utils";
class SocketConnection {
    private channels: { [channelId: string]: string } = {};
    private anonymousChannels: { [channelId: string]: string } = {};
    public async init(io: any) {
        io.use(async (socket: any, next: NextFunction) => {
            try {
                const token = socket.handshake.auth.token;
                if (!token) {
                    // Create new client
                    const client = {
                        firstname: "User",
                        lastname: socket.id,
                        isRegistered: true,
                        isActive: true,
                        language: "vi",
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    };
                    const anonymousClient = await Client.create(client);
                    const anonymousChannel = await Channel.create({
                        clientId: anonymousClient.getDataValue("id"),
                    });
                    socket.join("Channel_" + anonymousChannel?.dataValues.id);
                } else {
                    const decoded = await TokenUtil.verify(token);
                    const { id, role, ...data } = decoded;
                    if (role == "user") {
                        const channel = await Channel.findOne({
                            where: { clientId: id },
                        });
                        socket.join("Channel_" + channel?.dataValues.id);
                        socket.join("PrivateChannel_" + id);
                    } else if (
                        role == "employee" ||
                        role == "manager" ||
                        role == "chef"
                    ) {
                        const channels = await Channel.findAll();
                        channels.forEach((channel: any) => {
                            socket.join("Channel_" + channel.dataValues.id);
                        });
                        socket.join("Anonymous_receiver");
                        socket.join("Kitchen");
                    }
                }
                next();
            } catch (error) {
                console.log(error);
                next(error);
            }
        });
        io.on("connection", (socket: any) => {
            socket.emit("initial:channels", this.channels);

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
                console.log("staff:message:read from channel ", channelId);
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
                    const client = await Client.findOne({
                        where: {
                            lastname: socket.id,
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
                    io.to("Anonymous_receiver").emit(
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

            //Notification service
            socket.on(
                "staff:notifications:prepare",
                (clientId: string, orderId: string) => {
                    console.log("Channel_" + clientId);
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

            // Disconnect
            socket.on("disconnect", () => {
                Object.keys(this.channels).forEach((channelId) => {
                    if (this.channels[channelId] === socket.id) {
                        delete this.channels[channelId];
                        io.emit("channel:status:update", this.channels);
                    }
                });
                setTimeout(async () => {
                    try {
                        const client = await Client.findOne({
                            where: {
                                lastname: socket.id,
                            },
                        });
                        if (client) {
                            await client.destroy();
                        }
                    } catch (error) {
                        console.error("Error deleting client:", error);
                    }
                }, 15 * 60 * 1000);
            });
        });
    }
}

export default SocketConnection;
