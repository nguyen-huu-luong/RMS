'use client'
import axios from 'axios';
import { mutate } from 'swr';

const backend_api = `http://${process.env.NEXT_PUBLIC_BACKEND_HOST}:${process.env.NEXT_PUBLIC_BACKEND_PORT}/api`

export const voucherFetcher = async (url: string, token: any) => {
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

export const consumeVoucher = async (token: any, id: any,  requestBody: object) => {
  try {
    const response = await axios.patch(`${backend_api}/vouchers/${id}`, requestBody, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    mutate([`${backend_api}/vouchers/all`, token])
    return response.data;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};
