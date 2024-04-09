import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useSession } from "next-auth/react";
import { useRouter } from "next-intl/client";

export default function useSocket() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [socket, setSocket] = useState<any>();

    useEffect(() => {
        if (status == "unauthenticated") {
            router.push("/signin");
        } else if (status == "loading") return;

        const newSocket = io(`http://localhost:3003`, {
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
