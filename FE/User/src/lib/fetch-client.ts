import axios from "axios";
import { getSession, signOut } from "next-auth/react";

interface fetchClientProps {
  method?: string;
  url: string;
  body?: any;
  token?: string;
  data_return?: boolean
}

const backend_api = `http://${process.env.NEXT_PUBLIC_BACKEND_HOST}:${process.env.NEXT_PUBLIC_BACKEND_PORT}/api`

async function fetchClient({ method = "GET", url, body = "", token, data_return = false }: fetchClientProps) {
  try {
    const session = await getSession();
    const accessToken = token || session?.user.accessToken;
    if (accessToken) {
      console.log("Fetch client", url, session, accessToken, process.env.NEXT_BACKEND_API_URL)
      const response = await axios(backend_api + url, {
        method: method,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
        data: body || undefined,
      });

      if (data_return) {
        return response.data
      }

      return response;
    }
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

export default fetchClient;