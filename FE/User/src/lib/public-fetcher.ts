import axios from "axios";

interface fetchClientProps {
    method?: string;
    url: string;
    body?: any;
    data_return?: boolean;
}

const backend_api = `http://${process.env.NEXT_PUBLIC_BACKEND_HOST}:${process.env.NEXT_PUBLIC_BACKEND_PORT}/api`

async function publicFetcher({
    method = "GET",
    url,
    body = "",
    data_return = false,
}: fetchClientProps) {
    try {
        console.log(
            "Fetch public infor",
            url,
            process.env.NEXT_BACKEND_API_URL
        );
        const response = await axios(backend_api + url, {
            method: method,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            data: body || undefined,
        });

        if (data_return) {
            return response.data;
        }

        return response;
    } catch (error) {
        console.log(error);
        if (error instanceof Response) {
            throw error;
        }

        throw new Error("Failed to fetch data", { cause: error });
    }
}

export default publicFetcher;
