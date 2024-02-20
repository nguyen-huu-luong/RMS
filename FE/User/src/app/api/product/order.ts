'use client'
import axios from 'axios';
import { mutate } from 'swr';
import { useRouter } from 'next/navigation';

export const useCreateOrder = async (token: any, requestBody: any, method: any) => {
    try {
        const response = await axios.post(`${process.env.BASE_URL}/orders?method=${method}`, requestBody, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        mutate([`http://localhost:3003/api/carts`, token])
        return response.data;
    } catch (error) {
        console.error('Error adding to cart:', error);
        throw error;
    }
};

export const recordMoMoOrder = async (requestBody: any) => {
    try {
        const response = await axios.post(`${process.env.BASE_URL}/orders/momo`, requestBody);
        return response.data;
    } catch (error) {
        console.error('Error recording MoMo result:', error);
        throw error;
    }
}
