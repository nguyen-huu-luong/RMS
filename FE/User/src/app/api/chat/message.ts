"use client";
import axios from "axios";
import { mutate } from "swr";

const backend_api = `http://${process.env.NEXT_PUBLIC_BACKEND_HOST}:${process.env.NEXT_PUBLIC_BACKEND_PORT}/api`

export const messageFetcher = async (url: string, token: any, index: any) => {
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            params: {
                index: !index ? 1 : index,
            },
        });
        return response.data;
    } catch (error) {
        console.log(error);
    }
};

export const sendMessage = async (token: any, requestBody: object) => {
    try {
        const response = await axios.post(
            `${backend_api}/channels`,
            requestBody,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        mutate([`${backend_api}/channels/messages`, token]);
        return response.data;
    } catch (error) {
        console.error("Error adding to cart:", error);
        throw error;
    }
};

export const seenMessage = async (token: any) => {
    try {
        const response = await axios.put(
            `${backend_api}/channels`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export default seenMessage;
