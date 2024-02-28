import { NextFunction } from "express";
import DBConnect from "./db";
import { Channel } from "../Models";
import { TokenUtil } from "../Utils";
import { UnauthorizedError } from "../Errors";
class SocketConnection {
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
                }
                next();
            } catch (error) {
                console.log(error)
                next(error);
            }
        });
        io.on("connection", (socket: any) => {
            socket.on(
                "client:message:send",
                (channelId: string, message: string) => {
                    socket
                        .to("Channel_" + channelId)
                        .emit("message:send:fromClient", channelId, message);
                }
            );
            socket.on(
                "staff:message:send",
                (channelId: string, message: string) => {
                    socket
                        .to("Channel_" + channelId)
                        .emit("message:send:fromStaff", channelId, message);
                }
            );
            socket.on("client:message:read", (channelId: string) => {
                console.log("Channel id" + channelId);
            });
            socket.on("staff:message:read", (channelId: string) => {
                console.log("Staff read from channel ", channelId);
                socket
                    .to("Channel_" + channelId)
                    .emit("message:read:fromStaff", channelId);
            });
        });
    }
}

export default SocketConnection;
