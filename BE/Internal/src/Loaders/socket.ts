import { NextFunction } from "express";
import { Channel } from "../Models";
import { TokenUtil } from "../Utils";
class SocketConnection {
    private channels: { [channelId: string]: string } = {};

    public async init(io: any) {
        io.use(async (socket: any, next: NextFunction) => {
            try {
                const token = socket.handshake.auth.token;
                const decoded = await TokenUtil.verify(token);
                const { id, role, ...data } = decoded;
                if (role == "user") {
                    const channel = await Channel.findOne({
                        where: { clientId: id },
                    });
                    socket.join("Channel_" + channel?.dataValues.id);
                } else if (role == "employee" || role == "manager") {
                    const channels = await Channel.findAll();
                    channels.forEach((channel: any) => {
                        socket.join("Channel_" + channel.dataValues.id);
                    });
                    socket.join("Kitchen");
                }
                next();
            } catch (error) {
                console.log(error);
                next(error);
            }
        });
        io.on("connection", (socket: any) => {
            socket.emit("initial:channels", this.channels);

            //Chat
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

            //Kitchen
            socket.on("chef:order:finish", (orderId: string) => {
                io.to("Kitchen").emit("order:finish:fromChef", orderId);
            });
            socket.on("staff:order:prepare", (orderId: string) => {
                io.to("Kitchen").emit("order:prepare:fromStaff", orderId);
            });
            socket.on(
                "staff:channel:join",
                (channelId: string, staffId: string, callback: any) => {
                    console.log(this.channels);
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
            socket.on("disconnect", () => {
                Object.keys(this.channels).forEach((channelId) => {
                    if (this.channels[channelId] === socket.id) {
                        delete this.channels[channelId];
                        io.emit("channel:status:update", this.channels);
                    }
                });
            });
        });
    }
}

export default SocketConnection;
