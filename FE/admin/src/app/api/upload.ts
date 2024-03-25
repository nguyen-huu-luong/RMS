'use client'
import axios from 'axios';
import { useState } from 'react';

export const uploadImage = async (image: any) => {
    try {
        const upload_api = "https://api.cloudinary.com/v1_1/dohcd0ok1/image/upload"
        const formData = new FormData()
        formData.append("file", image)
        formData.append("upload_preset", "ifmkxn0t")
        let response = await axios.post(
            upload_api, formData
        )
        return response.data
    }
    catch (error) {
        console.log(error)
    }
}