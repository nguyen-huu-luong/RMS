'use client'
import axios from 'axios';
import { mutate } from 'swr';
export const ordersFetcher = async (url:any, token: any) => {
    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
};

export const orderFetcher = async (url:any, token: any) => {
    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
};
