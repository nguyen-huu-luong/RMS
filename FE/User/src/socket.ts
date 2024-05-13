import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useSession } from "next-auth/react";
import { useRouter } from "next-intl/client";

export default function useSocket() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [socket, setSocket] = useState<any>();
    const backend_api = `http://${process.env.NEXT_PUBLIC_BACKEND_HOST}:${process.env.NEXT_PUBLIC_BACKEND_PORT}`
    useEffect(() => {
        if (status == "unauthenticated") {
            return;
        } else if (status == "loading") return;

        const newSocket = io(backend_api, {
            auth: {
                token: session?.user.accessToken,
            },
        });

        newSocket.on("connect", () => {
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
    }, [session?.accessToken, router, status]);

    return socket;
}
