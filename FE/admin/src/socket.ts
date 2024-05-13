import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useSession } from "next-auth/react";
import { useRouter } from "next-intl/client";

const backend_api = `http://${process.env.NEXT_PUBLIC_BACKEND_HOST}:${process.env.NEXT_PUBLIC_BACKEND_PORT}`

export default function useSocket() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [socket, setSocket] = useState<any>();

    useEffect(() => {
        if (status == "unauthenticated") {
            router.push("/signin");
        } else if (status == "loading") return;

        const newSocket = io(backend_api, {
            auth: {
                token: session?.accessToken,
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
