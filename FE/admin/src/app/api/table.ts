'use client'
import axios from 'axios';
import { mutate } from 'swr';
import { useRouter } from 'next/navigation';
import { request } from 'https';

export const tableFetcher = async (id: string, token: any) => {
    try {
        let url = `${process.env.BASE_URL}/tables?id=${id}`
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
        const response = await axios.put(`${process.env.BASE_URL}/tables?id=${id}`, requestBody, {
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