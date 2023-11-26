'use client'
import axios from 'axios';
import { mutate } from 'swr';
export const cartFetcher = async (url: string, token: any) => {
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

export const addToCart = async (token: any, requestBody: object) => {
  try {
    const response = await axios.post(`${process.env.BASE_URL}/carts`, requestBody, {
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

export const editCart = async (token: any,requestBody: object) => {
    try {
      const response = await axios.post(`${process.env.BASE_URL}/carts`, requestBody, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log(requestBody)
      mutate([`http://localhost:3003/api/carts`, token])
      return response.data;
    } catch (error) {
      console.error('Error update cart:', error);
      throw error;
    }
  };

export const removeProduct = async (token: any,productId: number) => {
    try {
      const response = await axios.delete(`${process.env.BASE_URL}/carts/${productId}`, {
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