import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useRouter } from "next-intl/client";
import Cookies from "js-cookie";
export default function useAnonymousSocket() {
    const router = useRouter();
    const [socket, setSocket] = useState<any>();
    const backend_api = `http://${process.env.NEXT_PUBLIC_BACKEND_HOST}:${process.env.NEXT_PUBLIC_BACKEND_PORT}`
    useEffect(() => {
        const storedValue = Cookies.get('socketId');
        const newSocket = io(backend_api, {
            query: { customId: storedValue },
        });
        console.log("first connected");
        newSocket.on("connect", () => {
            if (!storedValue) {
                const id: any = newSocket.id;
                const expires = new Date();
                expires.setHours(expires.getHours() + 24);
                Cookies.set("socketId", id, { expires });
                newSocket.io.opts.query = { customId: id };
            }
            console.log("Connected");
            console.log(newSocket.io.opts.query);
        });

        newSocket.on("disconnect", () => {
            console.log("Disconnected");
        });

        newSocket.on("connect_error", async (err) => {
            console.log(`connect_error due to ${err.message}`);
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [router]);

    return socket;
}
