'use client'
import axios from 'axios';
import { mutate } from 'swr';
export const createOrder = async (token: any, requestBody: any) => {
    try {
        const response = await axios.post(`${process.env.BASE_URL}/orders`, requestBody, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        return response.data;
      } catch (error) {
        console.error('Error adding to cart:', error);
        throw error;
      }
};