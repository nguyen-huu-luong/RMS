import axios from "axios";

interface fetchClientProps {
    method?: string;
    url: string;
    body?: any;
    data_return?: boolean;
}

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
        const response = await axios("http://localhost:3003/api" + url, {
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
