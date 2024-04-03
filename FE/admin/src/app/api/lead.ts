'use client'
import axios from 'axios';
import { mutate } from 'swr';

export const queryClientInfo = async (customerId: any, token: any, requestBody: object) => {
    try {
        const response = await axios.get(`${process.env.BASE_URL}/customers/${customerId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error geting lead info:', error);
        throw error;
    }
};

export const leadFetcher = async (leadId: string, token: any) => {
    try {
        let url = `${process.env.BASE_URL}/customers/${leadId}`
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
        return response.json();
    } catch (error) {
        console.error('Error fetching lead info:', error);
        throw error;
    }
};

export const updateLeadInfo = async (data: any, cid: any, token: any) => {
    try {
        console.log(token)
        const response = await axios.put(`${process.env.BASE_URL}/customers/${cid}`, data, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating lead info:', error);
        throw error;
    }
}

export const leadsFetcher = async (token: any, tableParams: any, sortQueries: any) => {
    try {
        console.log(`${process.env.BASE_URL}`)
        const response = await axios.get(`${process.env.BASE_URL}/customers/all?page=${tableParams.pagination?.current}
    &pageSize=${tableParams.pagination?.pageSize}${sortQueries}&type=Lead`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            })
        return response.data

    } catch (error) {
        console.error('Error updating leads info:', error);
        throw error;
    }
}