'use client'
import axios from 'axios';
import { mutate } from 'swr';

export const queryClientInfo = async (token: any, requestBody: object) => {
    try {
        const response = await axios.get(`${process.env.BASE_URL}/customers/21`, {
            headers: {
                'Authorization': `Bearer ${process.env.TOKEN}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error geting customer info:', error);
        throw error;
    }
};

export const customerFetcher = async (customerId: string, token: any) => {
    try {
        let url = `${process.env.BASE_URL}/customers/${customerId}`
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
        return response.json();
    } catch (error) {
        console.error('Error fetching customer info:', error);
        throw error;
    }
};

export const updateCustomerInfo = async (data: any, cid: any, token: any) => {
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
        console.error('Error updating customer info:', error);
        throw error;
    }
}

export const customersFetcher = async (token: any, tableParams: any, sortQueries: any) => {
    try {
        console.log(`${process.env.BASE_URL}`)
        const response = await axios.get(`${process.env.BASE_URL}/customers/all?page=${tableParams.pagination?.current}
    &pageSize=${tableParams.pagination?.pageSize}${sortQueries}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            })
        return response.data

    } catch (error) {
        console.error('Error updating customers info:', error);
        throw error;
    }
}