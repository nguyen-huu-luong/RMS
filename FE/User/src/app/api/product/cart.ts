"use client";
import axios from "axios";
import { mutate } from "swr";

const backend_api = `http://${process.env.NEXT_PUBLIC_BACKEND_HOST}:${process.env.NEXT_PUBLIC_BACKEND_PORT}/api`

export const cartFetcher = async (url: string, token: any) => {
    try {
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        return response.json();
    } catch (error) {
        console.log(error);
    }
};

export const addToCart = async (token: any, requestBody: object) => {
    try {
        const response = await axios.post(
            `${backend_api}/carts`,
            requestBody,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        await mutate([`${backend_api}/carts`, token]);
        return response.data;
    } catch (error) {
        console.error("Error adding to cart:", error);
        throw error;
    }
};

export const editCart = async (token: any, requestBody: object) => {
    try {
        const response = await axios.put(
            `${backend_api}/carts`,
            requestBody,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        await mutate([`${backend_api}/carts`, token]);
        return response.data;
    } catch (error) {
        console.error("Error update cart:", error);
        throw error;
    }
};

export const removeProduct = async (token: any, productId: number) => {
    try {
        const response = await axios.delete(
            `${backend_api}/carts/${productId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        await mutate([`${backend_api}/carts`, token]);
        return response.data;
    } catch (error) {
        console.error("Error adding to cart:", error);
        throw error;
    }
};
