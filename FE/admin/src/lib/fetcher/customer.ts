'use client'
import axios from 'axios';
import { mutate } from 'swr';
import fetchClient from '../fetch-client';

// export const queryClientInfo = async (token: any, requestBody: object) => {
//   try {
//     const respone = fetchClient({url: })
//     return response.data;
//   } catch (error) {
//     console.error('Error adding to cart:', error);
//     throw error;
//   }
// };

export const customerFetcher = async (url: string) => {
  try {
    let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJmdWxsTmFtZSI6Ik1hbmFnZXIgTWFuYWdlciIsImVtYWlsIjoiQ291cnRuZXkuUm9tYWd1ZXJhODRAeWFob28uY29tIiwicm9sZSI6Im1hbmFnZXIiLCJpYXQiOjE3MDg4NTM3ODYsImV4cCI6MTcwODk0MDE4Nn0.LG9bEVniTB08gPTX-1dsHgtzu_nJ1sYy2qSvg_SZMMY"
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

export const updateCustomerInfo = async (data: any, cid: any) => {
  let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJmdWxsTmFtZSI6Ik1hbmFnZXIgTWFuYWdlciIsImVtYWlsIjoiQ291cnRuZXkuUm9tYWd1ZXJhODRAeWFob28uY29tIiwicm9sZSI6Im1hbmFnZXIiLCJpYXQiOjE3MDg4NTM3ODYsImV4cCI6MTcwODk0MDE4Nn0.LG9bEVniTB08gPTX-1dsHgtzu_nJ1sYy2qSvg_SZMMY"
  try {
    const response = await axios.put(`http://localhost:3003/api/customers/${cid}`, data, {
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
}