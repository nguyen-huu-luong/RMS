import axios from "axios";
import { getSession, signOut } from "next-auth/react";

interface fetchGeneralProps {
    method?: string;
    url: string;
    body?: any;
    data_return?: boolean
}

async function fetchGeneral({ method = "GET", url, body = "", data_return = false }: fetchGeneralProps) {
    try {
        const response = await axios("http://localhost:3003/api" + url, {
            method: method,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            data: body || undefined,
        });

        if (data_return) {
            return response.data
        }

        return response;

    } catch (error) {
        console.log(error)
        if (error instanceof Response) {
            if (error.status === 401) {
                signOut();
            }

            throw error;
        }

        throw new Error("Failed to fetch data", { cause: error });
    }
}

export default fetchGeneral;