'use client'
import axios from 'axios';
import { mutate } from 'swr';
import { useRouter } from 'next/navigation';

const backend_api = `http://${process.env.NEXT_PUBLIC_BACKEND_HOST}:${process.env.NEXT_PUBLIC_BACKEND_PORT}/api`

export const useCreateOrder = async (token: any, requestBody: any, method: any) => {
    try {
        const response = await axios.post(`${backend_api}/orders?method=${method}`, requestBody, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        mutate([`${backend_api}/carts`, token])
        return response.data;
    } catch (error) {
        console.error('Error adding to cart:', error);
        throw error;
    }
};

export const recordMoMoOrder = async (requestBody: any) => {
    try {
        const response = await axios.post(`${backend_api}/orders/momo`, requestBody);
        return response.data;
    } catch (error) {
        console.error('Error recording MoMo result:', error);
        throw error;
    }
}

export const cancelOrder = async (token: any, requestBody: any) => {
    try {
        const response = await axios.put(`${backend_api}/orders`, requestBody, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        mutate([`${backend_api}/orders`, token])
        return response.data;
    } catch (error) {
        console.error('Error adding to cart:', error);
        throw error;
    }
};