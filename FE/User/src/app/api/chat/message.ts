'use client'
import axios from 'axios';
import { mutate } from 'swr';
export const messageFetcher = async (url: string, token: any) => {
    try {
        const response = await fetch(url, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          })
        return response.json();
    } catch (error) {
        console.log(error)
    }
};

export const sendMessage = async (token: any, requestBody: object) => {
  try {
    const response = await axios.post(`${process.env.BASE_URL}/channels`, requestBody, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    mutate([`http://localhost:3003/api/channels/messages`, token])
    return response.data;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};
