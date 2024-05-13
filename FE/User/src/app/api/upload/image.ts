'use client'
import axios from 'axios';
import { useState } from 'react';

export const uploadImage = async (image: any, folder_name="General") => {
    try {
        const upload_api = "https://api.cloudinary.com/v1_1/djdpobmlv/image/upload"
        const formData = new FormData()
        formData.append("file", image)
        formData.append("upload_preset", "xpdzs2kn")
        formData.append("folder", folder_name)
        let response = await axios.post(
            upload_api, formData
        )
        return response.data
    }
    catch (error) {
        console.log(error)
    }
}