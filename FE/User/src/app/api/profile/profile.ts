'use client'
import axios from 'axios';
import { useState } from 'react';

export const uploadImage = async (image: any) => {
    try {
        const upload_api = "https://api.cloudinary.com/v1_1/djdpobmlv/image/upload"
        const formData = new FormData()
        formData.append("file", image)
        formData.append("upload_preset", "xpdzs2kn")
        formData.append("folder", "Client")

        let response = await axios.post(
            upload_api, formData
        )
        return response.data
    }
    catch (error) {
        console.log(error)
    }
}

export const editProfile = async (token: any, requestBody: object) => {
    try {
        const response = await axios.put(
            `${process.env.BASE_URL}/customers`,
            requestBody,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error update user profile:", error);
        throw error;
    }
};

export const getProfile = async (token: any) => {
    try {
        const response = await axios.get(
            `${process.env.BASE_URL}/customers`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error update user profile:", error);
        throw error;
    }
};