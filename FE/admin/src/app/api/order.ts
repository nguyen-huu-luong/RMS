'use client'
import axios from 'axios';
import { mutate } from 'swr';


export const clientOrderFetcher = async (url: string) => {
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