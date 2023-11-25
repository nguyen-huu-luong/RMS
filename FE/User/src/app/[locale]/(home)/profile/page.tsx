import { authOptions } from "@/app/api/auth/[...nextauth]/options"
import {getServerSession } from "next-auth"
import { Session } from "next-auth/core/types";
import { redirect } from "next/navigation";
import React from "react"

const Profile: React.FC = async () => {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect("/signin")
    }
    console.log(session)
    return <div>{JSON.stringify(session)}</div>
}

export default Profile