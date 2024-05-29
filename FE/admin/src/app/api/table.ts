'use client'
import axios from 'axios';
import { mutate } from 'swr';
import { useRouter } from 'next/navigation';
import { request } from 'https';

NEXTAUTH_URL

export const tableFetcher = async (id: string, token: any) => {
    try {
        let url = `${backend_api}/tables?id=${id}`
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


export const updateTable = async (requestBody: any, id: string,token: any) => {
    try {
        const response = await axios.put(`${backend_api}/tables?id=${id}`, requestBody, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
        return response.data;
    } catch (error) {
        console.log(error)
    }
};

export const getCartItems = async ( url: string,token: any) => {
    try {
        // let url = `${backend_api}/tables/cart/${id}`
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
}

export const addToCart = async (requestBody: any, id: string,token: any) => {
    try {
        const response = await axios.post(`${backend_api}/tables/cart/${id}`, requestBody, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
        return response.data;
    } catch (error) {
        console.log(error)
    }
}

export const updateCart = async (requestBody: any, id: string,token: any) => {
    try {
        const response = await axios.put(`${backend_api}/tables/cart/${id}`, requestBody, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
        return response.data;
    } catch (error) {
        console.log(error)
    }
}