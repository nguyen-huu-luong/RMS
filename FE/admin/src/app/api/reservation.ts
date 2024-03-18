'use client'
import axios from 'axios';
import { mutate } from 'swr';

export const reserverionFetcher = async (url: string, token: any) => {
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
