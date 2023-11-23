import React from "react";
import { LoginForm } from "@/app/components/LoginForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { redirect, useRouter } from "next/navigation";

const SignIn: React.FC = async () => {
    const session = await getServerSession(authOptions) ;
    if (session) {
        redirect("/profile")
    }

    return (
        <main className="flex items-center justify-center w-full space-x-6">
            <div className="hidden w-3/5 max-h-screen overflow-hidden md:flex items-center justify-center">
                <img alt="" src="/Login/food2.svg" width={"100%"} />
            </div>
            <div className="h-[600px] rounded-lg w-full md:w-2/5 flex items-center justify-center">
              <LoginForm />
            </div>
        </main>
    );
};

export default SignIn;
