import axios from "axios"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
    try {
        const data = await request.formData()
        const upload_api = "https://api.cloudinary.com/v1_1/djdpobmlv/image/upload"

        data.append("folder", data.get("form_name") || "General")
                
        let imageUrl = await axios.post(
            upload_api, data
        )

        console.log(imageUrl)
        return  NextResponse.json(imageUrl.data)
    }
    catch (error) {
        console.log(error)
        return NextResponse.json({
            status: 500,
            message: "Faild to upload image"
        })
    }
  }