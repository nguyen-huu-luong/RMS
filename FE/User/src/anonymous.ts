import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useSession } from "next-auth/react";
import { useRouter } from "next-intl/client";

export default function useAnonymousSocket() {
    const router = useRouter();
    const [socket, setSocket] = useState<any>();

    useEffect(() => {
        const newSocket = io(`http://localhost:3003`);

        newSocket.on("connect", () => {
            console.log(newSocket)
            console.log("Connected");
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
